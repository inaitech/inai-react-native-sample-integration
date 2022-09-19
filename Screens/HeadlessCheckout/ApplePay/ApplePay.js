/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from "react";

 import {useEffect, useState} from "react";
 import Constants from "../../../Constants";
 import Base64 from "./Base64";
 import AsyncStorage from '@react-native-async-storage/async-storage';

 import {
   SafeAreaView, NativeModules, View, ActivityIndicator, Alert, Button, SliderBase
 } from 'react-native';
 
 const customerIdStoreKey = `customerId-${Constants.token}`;
 const storeCustomerId = async (customerId) => {
  if (customerId) {
   try {
     await AsyncStorage.setItem(customerIdStoreKey, customerId);
   } catch (error) {
      console.error(error);
   }
  }
 }
 
 const getStoredCustomerId = async () => {
  let storedCustomerId = null;
   try {
     storedCustomerId = await AsyncStorage.getItem(customerIdStoreKey);
    } catch (error) {
      console.error(error);
    }

    return storedCustomerId;
 }

 const preapreOrder =
    async () => {        
     let postData = {
         "amount": Constants.amount,
         "currency": Constants.currency,
         "description": "Acme Shirt",
         "metadata": {"test_order_id": "5735"},
         "customer" : {}
     };

     let storedCustomerId = await getStoredCustomerId();
     if (storedCustomerId) {
      postData.customer.id = storedCustomerId;
     } else {
      postData.customer = {
            "email": "testdev@test.com",
             "first_name": "Dev",
             "last_name": "Smith",
             "contact_number": "01010101010"
            };
     }

     const authStr = `Basic ${Base64.btoa(Constants.token + ":" + Constants.password, "base64")}`;
     const requestOptions = {
         method: "POST",
         headers: { 
                     "Content-Type": "application/json",
                     "Authorization": authStr
                 },
         body: JSON.stringify(postData)
     };

     const ordersUrl = `${Constants.base_url}/orders`;
     const response = await fetch(ordersUrl, requestOptions);
     const jsonData = await response.json();
     
     let id = jsonData.id || null;
     if(id != null) {
      //  Store the customer id
      storeCustomerId(jsonData.customer_id);
     }
     return id;
 }

 const getPaymentOptions = async (orderId) => {        
  const authStr = `Basic ${Base64.btoa(Constants.token + ":" + Constants.password, "base64")}`;
  const requestOptions = {
      method: "GET",
      headers: { 
                  "Content-Type": "application/json",
                  "Authorization": authStr
              }
  };

  const url = `${Constants.base_url}/payment-method-options?order_id=${orderId}&country=${Constants.country}`;
  const response = await fetch(url, requestOptions);
  const jsonData = await response.json();
  let payment_method_options = jsonData.payment_method_options || [];
  return payment_method_options;
}

  const Colors = {
    "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
    "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
  };

 const ApplePay = ({navigation}) => {
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [applePayRequestData, setApplePayRequestData] = useState(null);
  const [buttonTitle, setButtonTitle] = useState("Loading..");
  
  const { InaiCheckoutModule } = NativeModules;

  useEffect(() => {
      async function initData() {
        //  Load order id
        let generatedOrderId = await preapreOrder();
        if (generatedOrderId!= null) {
          //  Load the payment options data
          let payment_method_options = await getPaymentOptions(generatedOrderId);
          
          if (payment_method_options.length > 0) {
            setOrderId(generatedOrderId);
            let applePayMethod = payment_method_options.find((pm) => pm.rail_code.toLowerCase() == "apple_pay");
            if (applePayMethod != null) {
              setupApplePayUI(payment_method_options)
            } else {
              Alert.alert(
                "Error",
                "Apple Pay not available for this account",
                [
                  {text: 'OK', onPress: () => { 
                    navigation.navigate("Home");
                  }},
                ]
              );
            }
          }
        } else {
          Alert.alert(
            "Error",
            "Error while creating order",
            [
              {text: 'OK', onPress: () => { 
                navigation.navigate("Home");
              }},
            ]
          );
        }
        setIsLoading(false);
      }

      initData();
  }, [])

  
  const setupApplePayUI = (paymentMethods) => {
    InaiCheckoutModule.getApplePayRequestData({"payment_method_options": paymentMethods}).then((requestData) => {
      setApplePayRequestData(requestData);
    });
  }

  const payWithApplePay = () => {
    let inaiConfig = {
      token: Constants.token,
      orderId: orderId,
      countryCode: Constants.country
    };

    InaiCheckoutModule.payWithApplePay(inaiConfig, applePayRequestData).then((response) => {
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
    }).catch((err) => {
      Alert.alert(
        "Result",
        JSON.stringify(err),
        [
          {
            text: 'OK', onPress: () => {
              navigation.navigate("Home");
            }
          },
        ]
      );
    });
  };

  const setupApplePay = () => {
    InaiCheckoutModule.setupApplePay();
  };

  const sanitizeRailCode =(railCode) => {
    let cleanStr = railCode.replace(/_/g, " ");
    let capitalizedStr = cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1);
    return capitalizedStr;
  };

   return (
       <SafeAreaView style={{flex: 1, backgroundColor: "#fff" }}>
          
        <View style={{  
                      position: "absolute", 
                      backgroundColor: "#F5FCFF88",
                      top: 0, right: 0, bottom: 0, left: 0, 
                      alignItems: 'center',
                      justifyContent: 'center'}}>

        {applePayRequestData != null && 
          <View
            style={{
              backgroundColor: Colors.button_container_bg,
              marginLeft: 15,
              borderRadius: 5,
              marginRight: 15,
              marginTop: 10,
              padding: 5,
              width: "90%"
            }}
          >
            <Button
              onPress={() => {
                  if (applePayRequestData.canMakePayments) {
                    payWithApplePay();
                  } else {
                    setupApplePay();
                  }
                }
              }
              color={Colors.button_bg}
              title={ applePayRequestData.canMakePayments ? "Pay With Apple Pay" : "Setup Apple Pay"}
            />
          </View>
          }
        </View>

        {isLoading &&
        <View style={{  
                      position: "absolute", 
                      backgroundColor: "#F5FCFF88",
                      top: 0, right: 0, bottom: 0, left: 0, 
                      alignItems: 'center',
                      justifyContent: 'center'}}>
          <ActivityIndicator size='large' />
        </View>
        }
       </SafeAreaView>

   );
 };

 export default ApplePay;
 