package com.ilnard.towerarcher;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.DisplayCutout;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.Locale;

/** Полноэкранная обёртка над HTML5-игрой из assets/index.html. */
public class MainActivity extends Activity {

    private WebView web;
    private AdsManager ads;
    private WindowInsets lastInsets;

    /** Передаёт в CSS безопасные отступы выреза камеры (--sat/--sab), чтобы интерфейс не прятался под ним. */
    private void pushInsets() {
        if (web == null) return;
        float top = 0, bottom = 0, d = getResources().getDisplayMetrics().density;
        if (Build.VERSION.SDK_INT >= 28 && lastInsets != null) {
            DisplayCutout c = lastInsets.getDisplayCutout();
            if (c != null) { top = c.getSafeInsetTop() / d; bottom = c.getSafeInsetBottom() / d; }
        }
        web.evaluateJavascript(String.format(Locale.US,
                "document.documentElement.style.setProperty('--sat','%.1fpx');document.documentElement.style.setProperty('--sab','%.1fpx');", top, bottom), null);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#1f2a44"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // localStorage для сохранений
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        s.setTextZoom(100);                    // системный масштаб шрифта не ломает вёрстку
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView view, String url) { view.requestApplyInsets(); pushInsets(); }
            // внешние ссылки (политика конфиденциальности) открываются в браузере, а не внутри игры
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl(); String sch = u.getScheme();
                if ("http".equals(sch) || "https".equals(sch)) { try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { } return true; }
                return false;
            }
        });
        web.setOnApplyWindowInsetsListener((v, insets) -> { lastInsets = insets; pushInsets(); return v.onApplyWindowInsets(insets); });
        ads = new AdsManager(this, web);
        web.addJavascriptInterface(new GameBridge(this, ads), "AndroidBridge");
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);   // только в тестовой сборке

        setContentView(web);
        hideSystemUi();

        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl("file:///android_asset/index.html");
    }

    @SuppressWarnings("deprecation")
    private void hideSystemUi() {
        web.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemUi();
    }

    @Override
    protected void onPause() {
        web.evaluateJavascript("window.__onAndroidPause && window.__onAndroidPause()", null);
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        hideSystemUi();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.__onAndroidBack ? window.__onAndroidBack() : 'exit'", value -> {
            if (value == null || value.contains("exit")) finish();
        });
    }

    @Override
    protected void onDestroy() {
        if (ads != null) ads.destroy();
        if (web != null) web.destroy();
        super.onDestroy();
    }
}
