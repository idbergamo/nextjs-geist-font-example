package com.controle.financeiro

import android.graphics.Bitmap
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewClientCompat

class CustomWebViewClient : WebViewClientCompat() {
    
    override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
        // Handle all URLs within the WebView
        view.loadUrl(request.url.toString())
        return true
    }

    override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
        super.onPageStarted(view, url, favicon)
        // Show loading indicator if needed
    }

    override fun onPageFinished(view: WebView, url: String) {
        super.onPageFinished(view, url)
        // Hide loading indicator if needed
    }

    override fun onReceivedError(
        view: WebView,
        request: WebResourceRequest,
        error: WebResourceError
    ) {
        super.onReceivedError(view, request, error)
        // Load error page when there's a problem
        if (request.isForMainFrame) {
            view.loadUrl("file:///android_asset/www/error.html")
        }
    }

    override fun shouldInterceptRequest(
        view: WebView,
        request: WebResourceRequest
    ) = super.shouldInterceptRequest(view, request)

    override fun onReceivedHttpError(
        view: WebView,
        request: WebResourceRequest,
        errorResponse: android.webkit.WebResourceResponse
    ) {
        super.onReceivedHttpError(view, request, errorResponse)
        // Handle HTTP errors if needed
        if (request.isForMainFrame) {
            view.loadUrl("file:///android_asset/www/error.html")
        }
    }
}
