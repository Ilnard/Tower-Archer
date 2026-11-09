package com.ilnard.towerarcher;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.yandex.mobile.ads.common.AdError;
import com.yandex.mobile.ads.common.AdRequestConfiguration;
import com.yandex.mobile.ads.common.AdRequestError;
import com.yandex.mobile.ads.common.ImpressionData;
import com.yandex.mobile.ads.common.MobileAds;
import com.yandex.mobile.ads.rewarded.Reward;
import com.yandex.mobile.ads.rewarded.RewardedAd;
import com.yandex.mobile.ads.rewarded.RewardedAdEventListener;
import com.yandex.mobile.ads.rewarded.RewardedAdLoadListener;
import com.yandex.mobile.ads.rewarded.RewardedAdLoader;

/**
 * Реклама с вознаграждением (Yandex Mobile Ads).
 * Награда выдаётся игре только если SDK вызвал onRewarded, и только после закрытия объявления.
 * События уходят в JS: window.__onAdEvent(placement, event), event ∈ ready|shown|rewarded|dismissed|failed|unavailable.
 */
final class AdsManager {
    private final Activity activity;
    private final WebView web;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private RewardedAdLoader loader;
    private RewardedAd ad;
    private boolean initStarted, loading, rewarded;
    private int retries;
    private volatile boolean ready;

    AdsManager(Activity activity, WebView web) { this.activity = activity; this.web = web; }

    /** Запуск SDK после выбора игрока о персонализации. Повторный вызов только обновляет согласие. */
    void init(boolean personalized) {
        MobileAds.setUserConsent(personalized);
        if (initStarted) return;
        initStarted = true;
        MobileAds.initialize(activity, () -> {
            loader = new RewardedAdLoader(activity);
            loader.setAdLoadListener(new RewardedAdLoadListener() {
                @Override public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                    ad = rewardedAd; ready = true; loading = false; retries = 0; emit("", "ready");
                }
                @Override public void onAdFailedToLoad(@NonNull AdRequestError error) {
                    ad = null; ready = false; loading = false;
                    long delay = Math.min(120_000L, 5_000L * (1L << Math.min(retries++, 5)));   // 5 с … 2 мин
                    handler.postDelayed(AdsManager.this::load, delay);
                }
            });
            load();
        });
    }

    private void load() {
        if (loader == null || loading || ad != null) return;
        loading = true;
        loader.loadAd(new AdRequestConfiguration.Builder(BuildConfig.REWARDED_AD_UNIT).build());
    }

    boolean isReady() { return ready; }

    void show(String placement) {
        final String p = placement == null ? "" : placement.replaceAll("[^a-z_]", "");
        final RewardedAd current = ad;
        if (current == null) { emit(p, "unavailable"); load(); return; }
        ad = null; ready = false; rewarded = false;
        current.setAdEventListener(new RewardedAdEventListener() {
            @Override public void onAdShown() { emit(p, "shown"); }
            @Override public void onAdFailedToShow(@NonNull AdError adError) { current.setAdEventListener(null); emit(p, "failed"); load(); }
            @Override public void onAdDismissed() { current.setAdEventListener(null); emit(p, rewarded ? "rewarded" : "dismissed"); load(); }
            @Override public void onAdClicked() { }
            @Override public void onAdImpression(@Nullable ImpressionData data) { }
            @Override public void onRewarded(@NonNull Reward reward) { rewarded = true; }
        });
        current.show(activity);
    }

    private void emit(String placement, String event) {
        web.post(() -> web.evaluateJavascript("window.__onAdEvent&&window.__onAdEvent('" + placement + "','" + event + "')", null));
    }

    void destroy() {
        handler.removeCallbacksAndMessages(null);
        if (loader != null) { loader.setAdLoadListener(null); loader = null; }
        if (ad != null) { ad.setAdEventListener(null); ad = null; }
    }
}
