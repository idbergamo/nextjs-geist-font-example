package com.controle.financeiro

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        webView.webViewClient = CustomWebViewClient()

        webView.settings.apply {
            // Enable JavaScript
            javaScriptEnabled = true
            
            // Enable DOM storage API
            domStorageEnabled = true
            
            // Enable database storage API
            databaseEnabled = true
            
            // Enable caching
            setAppCacheEnabled(true)
            
            // Set cache mode
            cacheMode = WebSettings.LOAD_DEFAULT
            
            // Disable zooming
            builtInZoomControls = false
            
            // Improve WebView performance
            setRenderPriority(WebSettings.RenderPriority.HIGH)
            
            // Enable hardware acceleration
            setLayerType(WebView.LAYER_TYPE_HARDWARE, null)
            
            // Enable modern web features
            if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
                WebSettingsCompat.setForceDark(this, WebSettingsCompat.FORCE_DARK_OFF)
            }
        }

        // Load the local HTML file
        webView.loadUrl("file:///android_asset/www/index.html")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
