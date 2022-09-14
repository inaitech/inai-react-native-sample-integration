package com.inai_react_native_sample_integration

import android.app.Activity
import android.app.Activity.RESULT_CANCELED
import android.app.Activity.RESULT_OK
import android.content.Intent
import com.facebook.react.bridge.*
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.ResolvableApiException
import com.google.android.gms.wallet.PaymentData
import com.google.android.gms.wallet.WalletConstants
import io.inai.android_sdk.*
import kotlinx.serialization.decodeFromString
import org.json.JSONObject
import kotlinx.serialization.json.Json

class InaiCheckoutModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    InaiCheckoutDelegate, InaiValidateFieldsDelegate, InaiCardInfoDelegate, ActivityEventListener {

    private var paymentCallback: Promise? = null
    private var googlePayRequestData: InaiGooglePayRequestData? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "InaiCheckoutModule"
    }

    @ReactMethod
    fun makePayment(
        config: ReadableMap,
        paymentMethodOption: String,
        paymentDetailsObject: ReadableMap,
        promise: Promise
    ) {
        this.paymentCallback = promise
        try {
            val inaiConfig = getInaiConfigObjectFromMap(config)
            val checkout = InaiCheckout(inaiConfig)
            val paymentDetailsJSON = JSONObject(paymentDetailsObject.toHashMap())
            currentActivity.let {
                if (it != null) {
                    checkout.makePayment(paymentMethodOption, paymentDetailsJSON, it, this)
                }
            }
        } catch (e: Exception) {
            promise.reject("Init failed. " + e.message)
        }
    }

    private fun getInaiConfigObjectFromMap(map: ReadableMap): InaiConfig {
        val jsonString = JSONObject(map.toHashMap()).toString()
        return Json.decodeFromString(jsonString)
    }

    @ReactMethod
    fun validateFields(
        config: ReadableMap,
        paymentMethodOption: String,
        paymentDetailsObject: ReadableMap,
        promise: Promise
    ) {
        this.paymentCallback = promise
        try {
            val inaiConfig = getInaiConfigObjectFromMap(config)
            val checkout = InaiCheckout(inaiConfig)
            val paymentDetailsJSON = JSONObject(paymentDetailsObject.toHashMap())
            currentActivity.let {
                if (it != null) {
                    checkout.validateFields(paymentMethodOption, paymentDetailsJSON, it, this)
                }
            }
        } catch (e: Exception) {
            promise.reject("Init failed. " + e.message)
        }
    }

    @ReactMethod
    fun getCardInfo(
        config: ReadableMap,
        cardNumber: String,
        promise: Promise
    ) {
        this.paymentCallback = promise
        try {
            val inaiConfig = getInaiConfigObjectFromMap(config)
            val checkout = InaiCheckout(inaiConfig)
            currentActivity.let {
                if (it != null) {
                    checkout.getCardInfo(cardNumber, it, this)
                }
            }
        } catch (e: Exception) {
            promise.reject("Init failed. " + e.message)
        }
    }

    @ReactMethod
    fun presentCheckout(
        config: ReadableMap,
        promise: Promise
    ) {
        this.paymentCallback = promise
        try {
            val inaiConfig = getInaiConfigObjectFromMap(config)
            val checkout = InaiCheckout(inaiConfig)
            currentActivity.let {
                if (it != null) {
                    checkout.presentCheckout(it, this)
                }
            }
        } catch (e: Exception) {
            promise.reject("Init failed. " + e.message)
        }
    }

    @ReactMethod
    fun initGooglePay(
        paymentMethodJson: ReadableMap,
        promise: Promise
    ) {
        this.paymentCallback = promise
        val paymentDetailsJSON = JSONObject(paymentMethodJson.toHashMap())
        currentActivity.let {
            if (it != null) {
                try {
                    InaiCheckout.initGooglePay(
                        paymentDetailsJSON,
                        WalletConstants.ENVIRONMENT_TEST,
                        it
                    ) { googlePayRequestData ->
                        if (googlePayRequestData != null) {
                            if (googlePayRequestData.canMakePayments) {
                                // Send back data
                                this.googlePayRequestData = googlePayRequestData
                                paymentCallback?.resolve(googlePayRequestData.canMakePayments)
                            } else {
                                paymentCallback?.resolve(googlePayRequestData)
                            }
                        } else {
                            promise.reject("Google Pay Not Available")
                        }
                    }
                } catch (e: Exception) {
                    promise.reject("Init failed. " + e.message)
                }
            }
        }
    }

    @ReactMethod
    fun launchGooglePay(
        promise: Promise
    ) {
        this.paymentCallback = promise
        googlePayRequestData?.let {
            val task = InaiCheckout.launchGooglePayRequest(googlePayRequestData!!)
            task.addOnCompleteListener { completedTask ->
                if (completedTask.isSuccessful) {
                    completedTask.result?.let { paymentData ->
                        val paymentDataJsonString = paymentData.toJson()
                        paymentCallback?.resolve(paymentDataJsonString)
                    }
                } else {
                    when (val exception = completedTask.exception) {
                        is ResolvableApiException -> {
                            currentActivity?.let { exception.startResolutionForResult(it, 101) }
                        }
                        is ApiException -> {
                            val errorStr =
                                "ApiException Error code ${exception.statusCode} ${exception.message}"
                            promise.reject(errorStr)
                        }
                        else -> {
                            val errorStr =
                                "Error ${CommonStatusCodes.INTERNAL_ERROR} Unexpected exception"
                            promise.reject(errorStr)
                        }
                    }
                }
            }
        }
    }

    @ReactMethod
    fun handleGooglePaySuccess(
        paymentDataJSON: String,
        paymentMethodOption: String,
        config: ReadableMap,
        promise: Promise
    ) {
        //  Google Auth successful
        //  Init Inai SDK and process checkout
        paymentCallback = promise
        try {
            //  Process google token for payment details data
            val paymentData = PaymentData.fromJson(paymentDataJSON)
            val paymentDetails = InaiCheckout.getGooglePayRequestData(paymentData)
            val inaiConfig = getInaiConfigObjectFromMap(config)
            val checkout = InaiCheckout(inaiConfig)
            currentActivity?.let {
                checkout.makePayment(paymentMethodOption, paymentDetails, it, this)
            }

        } catch (ex: Exception) {
            //  Handle initialization error
            promise.reject("Error while initializing sdk : ${ex.message}")
        }
    }

    override fun cardInfoFetched(result: InaiCardInfoResult) {
        val resultData = JSONObject()
        var status = "failed"
        if (result.status == InaiCardInfoStatus.Success) {
            status = "success"
        }
        resultData.put("status", status)
        resultData.put("data", result.data)

        val jsonMap = convertJSONToWritableMap(resultData)
        paymentCallback?.resolve(jsonMap)
    }

    override fun paymentFinished(result: InaiPaymentResult) {
        val resultData = JSONObject()
        var status = "canceled"
        if (result.status == InaiPaymentStatus.Success) {
            status = "success"
        } else if (result.status == InaiPaymentStatus.Success) {
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
        if (result.status == InaiValidateFieldsStatus.Success) {
            status = "success"
        }
        resultData.put("status", status)
        resultData.put("data", result.data)

        val jsonMap = convertJSONToWritableMap(resultData)
        paymentCallback?.resolve(jsonMap)
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, intentData: Intent?) {
        when (resultCode) {
            RESULT_OK ->
                intentData?.let { intent ->
                    PaymentData.getFromIntent(intent)?.let { paymentData ->
                        val paymentDataJsonString = paymentData.toJson()
                        paymentCallback?.resolve(paymentDataJsonString)
                    }
                }

            RESULT_CANCELED -> {
                // The user canceled the payment attempt
                paymentCallback?.reject("Google Pay Canceled")
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {

    }

    private fun convertJSONToWritableMap(jsonObject: JSONObject): WritableMap {
        val wMap = WritableNativeMap()
        val keys = jsonObject.keys()
        while (keys.hasNext()) {
            val key = keys.next()
            val value = jsonObject.get(key)
            if (value is String) {
                wMap.putString(key, value)
            } else if (value is JSONObject) {
                val map = convertJSONToWritableMap(value)
                wMap.putMap(key, map)
            }
        }
        return wMap
    }
}