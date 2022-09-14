import React, { useEffect } from "react";

import { useState } from "react";
import { SafeAreaView, NativeModules, Alert, Button, View } from "react-native";
import Constants from "./../../../Constants";

const Colors = {
    "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
    "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
  };

const GooglePayFields = ({ navigation, route }) => {

    const { InaiCheckoutModule } = NativeModules;
    const { paymentOption, orderId } = route.params;
    var googlePayRequestData = {};
    const [shouldShowGpayButton, setShouldShowGpayButton] = useState(false);

    const initGooglePay = () => {
        // Convert data object into JSON object as required by SDK.
        let paymentMethodsArray = []
        paymentMethodsArray.push(paymentOption)
        let paymentDetailsFields = { "payment_method_options": paymentMethodsArray }
        //  Fire off google pay checks here..
        InaiCheckoutModule.initGooglePay(
            paymentDetailsFields
        ).then((response) => {
            if (response) setShouldShowGpayButton(!shouldShowGpayButton);
        }).catch((err) => {
            Alert.alert(
                "Result",
                JSON.stringify(err)
            );
        });
    }
    //  On Google Pay Button Press
    const launchGooglePay = () => {
        InaiCheckoutModule.launchGooglePay().then(
            (response) => {
                //   If google pay is success then handle success.
                googlePaySuccess(response)
            }
        ).catch(
            (err) => {
                Alert.alert(
                    "Result",
                    JSON.stringify(err)
                );
            }
        );
    }

    const googlePaySuccess = (paymentDataJson) => {
        let styles = {
            container: { backgroundColor: "#fff" },
            cta: { backgroundColor: "#123456" },
            errorText: { color: "#000000" }
        };
        let inaiConfig = {
            token: Constants.token,
            orderId: orderId,
            countryCode: Constants.country,
            styles: styles
        };
        InaiCheckoutModule.handleGooglePaySuccess(
            paymentDataJson,
            "google_pay",
            inaiConfig
        ).then(
            (response) => {
                //  Make payment with google pay data was success.
                Alert.alert(
                    "Result",
                    JSON.stringify(response),
                    [
                        {
                            text: 'OK', onPress: () => {
                                navigation.navigate("Home");
                            }
                        },
                    ]
                );
            }
        ).catch(
            (err) => {
                Alert.alert(
                    "Result",
                    JSON.stringify(err)
                );
            }
        );
    }

    useEffect(() => {
        async function initData() {
            initGooglePay();
        }

        initData();
    }, []

    )


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View
                style={{
                    backgroundColor: Colors.button_container_bg,
                    marginLeft: 15,
                    borderRadius: 5,
                    marginRight: 15,
                    marginTop: 10,
                    padding: 5
                }}
            >
                {
                    shouldShowGpayButton ? <Button
                    onPress={() => {
                        launchGooglePay();
                    }
                    }
                    color={Colors.button_bg}
                    title="Pay With GPay"
                />  : null

                }
            </View>
        </SafeAreaView>
    )
}

export default GooglePayFields;