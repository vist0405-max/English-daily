package uz.englishdaily

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader
import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale

class MainActivity : Activity(), TextToSpeech.OnInitListener {

    private lateinit var web: WebView
    private var tts: TextToSpeech? = null
    private var ttsReady = false
    private var recognizer: SpeechRecognizer? = null
    private var recognizerReady = false
    private var pendingListen = false
    private val main = Handler(Looper.getMainLooper())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.parseColor("#1f2a44")

        val loader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        web = WebView(this)
        setContentView(web)
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.mediaPlaybackRequiresUserGesture = false
        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                loader.shouldInterceptRequest(request.url)

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                if (url.host == "appassets.androidplatform.net") return false
                try { startActivity(Intent(Intent.ACTION_VIEW, url)) } catch (_: Exception) {}
                return true
            }
        }
        web.addJavascriptInterface(Bridge(), "Android")
        web.loadUrl("https://appassets.androidplatform.net/assets/index.html")

        tts = TextToSpeech(this, this)
        Reminder.schedule(this)

        if (Build.VERSION.SDK_INT >= 33 &&
            checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), REQ_NOTIFY)
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.US
            ttsReady = true
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        web.evaluateJavascript("(window.__back && window.__back()) ? 'yes' : 'no'") { r ->
            if (r?.contains("yes") != true) {
                @Suppress("DEPRECATION")
                super.onBackPressed()
            }
        }
    }

    override fun onDestroy() {
        recognizer?.destroy()
        tts?.shutdown()
        web.destroy()
        super.onDestroy()
    }

    // ---------- Сообщения в JavaScript ----------
    private fun send(type: String, key: String? = null, value: String? = null) {
        val o = JSONObject().put("type", type)
        if (key != null) o.put(key, value)
        main.post { web.evaluateJavascript("window.__native && window.__native(${o})", null) }
    }

    // ---------- Распознавание речи ----------
    private fun beginListening() {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            pendingListen = true
            requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), REQ_MIC)
            return
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            send("error", "code", "unavailable")
            return
        }
        tts?.stop()
        recognizer?.destroy()
        recognizerReady = false
        val r = SpeechRecognizer.createSpeechRecognizer(this)
        recognizer = r
        r.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                recognizerReady = true
                send("state", "state", "listening")
            }
            override fun onPartialResults(partialResults: Bundle?) {
                val t = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()
                if (!t.isNullOrBlank()) send("partial", "text", t)
            }
            override fun onResults(results: Bundle?) {
                val all = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION).orEmpty().filter { it.isNotBlank() }
                if (all.isNotEmpty()) {
                    val o = JSONObject().put("type", "final").put("text", all[0]).put("alts", JSONArray(all))
                    main.post { web.evaluateJavascript("window.__native && window.__native(${o})", null) }
                }
                send("state", "state", "idle")
            }
            override fun onError(error: Int) {
                if (!recognizerReady) send("error", "code", "error") else send("state", "state", "idle")
            }
            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {}
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US")
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "en-US")
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
        }
        r.startListening(intent)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQ_MIC && pendingListen) {
            pendingListen = false
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) beginListening()
            else send("error", "code", "not_granted")
        }
    }

    // ---------- Мост для веб-части ----------
    inner class Bridge {
        @JavascriptInterface
        fun speak(text: String, rate: Double) {
            main.post {
                if (ttsReady) {
                    tts?.setSpeechRate(rate.toFloat())
                    tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "say")
                }
            }
        }

        @JavascriptInterface
        fun startListening() { main.post { beginListening() } }

        @JavascriptInterface
        fun stopListening() { main.post { recognizer?.stopListening() } }

        @JavascriptInterface
        fun setReminder(hour: Int, minute: Int) { Reminder.set(this@MainActivity, hour, minute) }

        @JavascriptInterface
        fun getReminder(): String = Reminder.get(this@MainActivity)
    }

    companion object {
        private const val REQ_MIC = 1
        private const val REQ_NOTIFY = 2
    }
}
