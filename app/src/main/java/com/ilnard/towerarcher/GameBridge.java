package com.ilnard.towerarcher;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.webkit.JavascriptInterface;

/** Мост JS → Android: вибрация, версия, флаги сборки и реклама. */
public class GameBridge {
    private final Activity activity;
    private final AdsManager ads;

    GameBridge(Activity activity, AdsManager ads) { this.activity = activity; this.ads = ads; }

    @JavascriptInterface
    public void vibrate(long ms) {
        Vibrator v = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
        if (v == null || !v.hasVibrator()) return;
        if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createOneShot(Math.min(ms, 300), VibrationEffect.DEFAULT_AMPLITUDE));
        else v.vibrate(Math.min(ms, 300));
    }

    @JavascriptInterface public boolean isAndroid() { return true; }
    @JavascriptInterface public String version() { return BuildConfig.VERSION_NAME; }
    @JavascriptInterface public boolean isTesterBuild() { return BuildConfig.TESTER_TOOLS; }
    @JavascriptInterface public boolean isDemoAds() { return BuildConfig.REWARDED_AD_UNIT.startsWith("demo-"); }

    @JavascriptInterface public void initAds(boolean personalized) { activity.runOnUiThread(() -> ads.init(personalized)); }
    @JavascriptInterface public boolean isRewardedReady() { return ads.isReady(); }
    @JavascriptInterface public void showRewarded(String placement) { activity.runOnUiThread(() -> ads.show(placement)); }
}
