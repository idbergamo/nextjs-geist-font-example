package com.controle.financeiro;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);
        
        // Enable DOM storage API (localStorage)
        webSettings.setDomStorageEnabled(true);
        
        // Enable database storage API
        webSettings.setDatabaseEnabled(true);
        
        // Enable caching
        webSettings.setAppCacheEnabled(true);
        
        // Set cache mode
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // Enable zooming
        webSettings.setBuiltInZoomControls(false);
        
        // Improve WebView performance
        webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        webSettings.setEnableSmoothTransition(true);
        
        // Set custom WebViewClient
        webView.setWebViewClient(new CustomWebViewClient());
        
        // Load the local HTML file
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
