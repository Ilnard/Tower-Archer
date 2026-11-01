package com.ilnard.towerarcher;

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.webkit.JavascriptInterface;

/**
 * Мост JS → Android. Сюда же позже добавится реклама:
 * showRewarded(placement) → Yandex Mobile Ads RewardedAd → колбэк в JS.
 */
public class GameBridge {
    private final Context ctx;

    GameBridge(Context ctx) { this.ctx = ctx.getApplicationContext(); }

    @JavascriptInterface
    public void vibrate(long ms) {
        Vibrator v = (Vibrator) ctx.getSystemService(Context.VIBRATOR_SERVICE);
        if (v == null || !v.hasVibrator()) return;
        if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE));
        else v.vibrate(ms);
    }

    @JavascriptInterface
    public boolean isAndroid() { return true; }
}
