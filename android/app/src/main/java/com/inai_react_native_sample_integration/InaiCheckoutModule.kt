import android.util.Log
import com.facebook.react.bridge.*
import io.inai.android_sdk.*
import org.json.JSONObject

class InaiCheckoutModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    InaiCheckoutDelegate {

    var paymentCallback: Callback? = null

    override fun getName(): String {
        return "InaiCheckoutModule"
    }

    @ReactMethod
    fun callMakePaymentMethod(
        inaiToken: String,
        orderId: String,
        countryCode: String,
        paymentMethodOption: String,
        paymentDetailsObject: JSONObject,
        callback: Callback
    ) {
        this.paymentCallback = callback
        val styles = InaiConfigStyles(
            container = InaiConfigStylesContainer(backgroundColor = "#efefef"),
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
                    checkout.makePayment(paymentMethodOption, paymentDetailsObject, it, this)
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