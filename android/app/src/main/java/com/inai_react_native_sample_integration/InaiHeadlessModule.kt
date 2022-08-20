import android.util.Log
import com.facebook.react.bridge.*
import io.inai.android_sdk.*

class InaiHeadlessModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), InaiCheckoutDelegate {

    var paymentCallback: Callback? = null

    override fun getName(): String {
        return "InaiHeadlessModule"
    }

    @ReactMethod
    fun callMakePaymentMethod(
        inaiToken: String,
        orderId: String,
        countryCode: String,
        callback: Callback
    ) {
        this.paymentCallback = callback
        val styles = InaiConfigStyles(
            container = InaiConfigStylesContainer(backgroundColor= "#efefef"),
            cta = InaiConfigStylesCta(backgroundColor = "#53509a"),
            errorText = InaiConfigStylesErrorText(color = "#000000")
        )

        val config = InaiConfig(
            token = inaiToken,
            orderId = orderId,
            styles = styles,
            countryCode = countryCode,
        )
        try {
            val checkout = InaiCheckout(config)
            currentActivity.let {
                if (it != null) {
                    checkout.presentCheckout(it, this)
                }
            }
        } catch (e: Exception) {
            Log.e("er", "Exception: $e")
        }
    }

    override fun paymentFinished(result: InaiPaymentResult) {
        paymentCallback?.invoke(result.data.toString())
    }
}