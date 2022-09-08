package com.inai_react_native_sample_integration

import com.facebook.react.bridge.*
import io.inai.android_sdk.*
import kotlinx.serialization.decodeFromString
import org.json.JSONObject
import kotlinx.serialization.json.Json

class InaiCheckoutModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    InaiCheckoutDelegate, InaiValidateFieldsDelegate, InaiCardInfoDelegate {

    private var paymentCallback: Promise? = null

    override fun getName(): String {
        return "InaiCheckoutModule"
    }

    @ReactMethod
    fun makePayment(
        config:ReadableMap,
        paymentMethodOption: String,
        paymentDetailsObject: ReadableMap,
        promise: Promise
    ) {
        this.paymentCallback = promise
        try {
            val inaiConfig = getInaiConfigObjectFromMap(config)
            val checkout = InaiCheckout(inaiConfig)
            val paymentDetailsJSON = JSONObject(paymentDetailsObject.toString())
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
        config:ReadableMap,
        paymentMethodOption: String,
        paymentDetailsObject: ReadableMap,
        promise: Promise
    ) {
        this.paymentCallback = promise
        try {
            val inaiConfig = getInaiConfigObjectFromMap(config)
            val checkout = InaiCheckout(inaiConfig)
            val paymentDetailsJSON = JSONObject(paymentDetailsObject.toString())
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
        config:ReadableMap,
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
        config:ReadableMap,
        promise: Promise
    ){
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

    override fun cardInfoFetched(result: InaiCardInfoResult) {
        val resultData = JSONObject()
        var status = "failed"
        if (result.status == InaiCardInfoStatus.Success){
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