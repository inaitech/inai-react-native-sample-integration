import React, { useEffect } from "react";

import { useState } from "react";
import { SafeAreaView, NativeModules, Alert, Button, View } from "react-native";
import Constants from "./../../../Constants";
import  InaiCheckout  from  "ay-inai-react-native-sdk";
const Colors = {
    "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
    "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
  };

const GooglePayFields = ({ navigation, route }) => {


    const { paymentOption, orderId } = route.params;
    
    const [shouldShowGpayButton, setShouldShowGpayButton] = useState(false);

    const initGooglePay = () => {
        // Convert data object into JSON object as required by SDK.
        let paymentMethodsArray = []
        paymentMethodsArray.push(paymentOption)
        let paymentDetailsFields = { "payment_method_options": paymentMethodsArray }
        //  Fire off google pay checks here..
        InaiCheckout.initGooglePay(
            paymentDetailsFields
        ).then((response) => {
            //  Show Gpay button only if the user is allowed to use google pay.
            if (response == true) {
                setShouldShowGpayButton(!shouldShowGpayButton);
            }else{
                Alert.alert(
                    "Result",
                    "Google Pay Not Available!"
                );
            }
            
        }).catch((err) => {
            Alert.alert(
                "Result",
                JSON.stringify(err)
            );
        });
    }
    //  On Google Pay Button Press
    const launchGooglePay = () => {
        let inaiConfig = {
            token: Constants.token,
            orderId: orderId,
            countryCode: Constants.country
        };
        InaiCheckout.launchGooglePay(inaiConfig).then(
            (response) => {
                //   If google pay is success then handle success.
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