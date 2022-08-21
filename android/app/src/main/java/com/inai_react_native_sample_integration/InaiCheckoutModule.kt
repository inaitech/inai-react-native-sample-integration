package com.inai_react_native_sample_integration

import android.util.Log
import com.facebook.react.bridge.*
import io.inai.android_sdk.*
import org.json.JSONObject

class InaiCheckoutModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    InaiCheckoutDelegate, InaiValidateFieldsDelegate {

    private var paymentCallback: Promise? = null

    override fun getName(): String {
        return "InaiCheckoutModule"
    }

    @ReactMethod
    fun makePayment(
        inaiToken: String,
        orderId: String,
        countryCode: String,
        paymentMethodOption: String,
        paymentDetailsObject: ReadableMap,
        promise: Promise
    ) {
        this.paymentCallback = promise
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
            val paymentDetailsJSON = JSONObject(paymentDetailsObject.toString())
            currentActivity.let {
                if (it != null) {
                    checkout.makePayment(paymentMethodOption, paymentDetailsJSON, it, this)
                }
            }
        } catch (e: Exception) {
            Log.e("er", "Exception: $e")
        }
    }

    @ReactMethod
    fun validateFields(
        inaiToken: String,
        orderId: String,
        countryCode: String,
        paymentMethodOption: String,
        paymentDetailsObject: ReadableMap,
        promise: Promise
    ) {
        this.paymentCallback = promise
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
            val paymentDetailsJSON = JSONObject(paymentDetailsObject.toString())
            currentActivity.let {
                if (it != null) {
                    checkout.validateFields(paymentMethodOption, paymentDetailsJSON, it, this)
                }
            }
        } catch (e: Exception) {
            Log.e("er", "Exception: $e")
        }
    }

    override fun paymentFinished(result: InaiPaymentResult) {
        val resultData = JSONObject()
        var status = "canceled"
        if (result.status == InaiPaymentStatus.Success){
            status = "success"
        } else if (result.status == InaiPaymentStatus.Success){
            status = "failed"
        }
        resultData.put("status", status)
        resultData.put("data", result.data)

        val jsonMap = convertJSONToWritableMap(resultData)
        paymentCallback?.resolve(jsonMap)
    }
    override fun fieldsValidationFinished(result: InaiValidateFieldsResult) {
        val resultData = JSONObject()
        var status = "failed"
        if (result.status == InaiValidateFieldsStatus.Success){
            status = "success"
        }
        resultData.put("status", status)
        resultData.put("data", result.data)

        val jsonMap = convertJSONToWritableMap(resultData)
        paymentCallback?.resolve(jsonMap)
    }

    private fun convertJSONToWritableMap(jsonObject: JSONObject): WritableMap {
        val wMap = WritableNativeMap()
        val keys = jsonObject.keys()
        while(keys.hasNext()) {
            val key = keys.next()
            val value = jsonObject.get(key)
            if (value is String) {
                wMap.putString(key, value)
            } else if(value is JSONObject) {
                val map = convertJSONToWritableMap(value)
                wMap.putMap(key, map)
            }
        }
        return wMap
    }
}