/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useCallback, useEffect, useState } from "react";
 
 import Constants from "../../../Constants";
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import Base64 from "./Base64";
 import InaiCheckout from "react-native-inai-sdk";

 import {
   SafeAreaView, Alert, Button, View, Text, Image, TextInput, ActivityIndicator, NativeModules
 } from 'react-native';
 
const Colors = {
    "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
    "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
};
 
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

 const GetCardInfo = () => {

    let [cardNumber, setCardNumber] = useState("");
    let [showActivityIndicator, setShowActivityIndicator] = useState(true);

    const [orderId, setOrderId] = useState(null);

    let [showCardImage, setShowCardImage] = useState(false);
    
    const assetPath = "../../../Assets/";
    const CardImages = {
        "unknown": require(assetPath + "unknown_card.png"),
        "visa": require(assetPath + "visa.png"),
        "mastercard": require(assetPath + "mastercard.png"),
        "americanexpress": require(assetPath + "americanexpress.png"),
        "discover": require(assetPath + "discover.png")
    }

    let [cardImagePath, setCardImagePath] = useState(CardImages.unknown);
   
    useEffect(() => {
        async function initData() {
          //  Load order id
          let generatedOrderId = await preapreOrder();
          if (generatedOrderId!= null) {
                setOrderId(generatedOrderId);
                setShowActivityIndicator(false); 
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
        }
        initData();
    }, []);
    
    const processCardInfoResult = (result) => {
        let status = result.status;
        let cardImage = "unknown_card.png";
        if (status == "success") {
            let data = result.data;
            if (data.card && data.card.brand) {
                cardImage = data.card.brand.toLowerCase();
            }
        }
        setShowCardImage(true);
        setCardImagePath(CardImages[cardImage]);
    }

    const debounce = (func) => {
        let timeout = null;
        return function(...args) {
            const context = this;
            if(timeout) { 
                clearTimeout(timeout);
            }
            timeout = setTimeout( () => {
                timeout = null;
                func.apply(context, args);
            }, 400);
        }
    };

    const fieldChanged = (val, orderId) => {
        setCardNumber(val);
        if (val.length > 5) {
            getCardInfo(val, orderId);
        } else {
            setShowCardImage(false);
        }
    };

    const debounceFieldChange = useCallback(debounce(fieldChanged), []);

    const getCardInfo = (currentCardNumber, orderId, showResultAlert=false) => {

        if (showResultAlert) {
            setShowActivityIndicator(true);
        }

        let inaiConfig = {
            token: Constants.token,
            orderId: orderId,
            countryCode: Constants.country,
        };
        
        InaiCheckout.getCardInfo(
            inaiConfig, currentCardNumber).then((response) => {
                setShowActivityIndicator(false);
                if (showResultAlert){
                    Alert.alert(
                        "Result",
                        JSON.stringify(response),
                        [{text: 'OK'}]
                    );
                } else {
                    //  Process current result
                    processCardInfoResult(response);
                }
            }).catch((err) => {
            setShowActivityIndicator(false);
            Alert.alert(
                "Error",
                JSON.stringify(err),
                [{text: 'OK'}]
                );
            });
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <View style={{padding: 20}}>
            <TextInput 
                    style={{
                        padding: 10,
                        fontSize: 18,
                        borderWidth: 1, 
                        borderColor: "#ccc",
                        borderRadius: 5,
                        height: 44}}
                        placeholder="Card Number"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText ={text => debounceFieldChange(text, orderId)}/>
                {showCardImage && 
                 <Image source={cardImagePath} 
                    style={{ position:"absolute", right: 20, top: 26, width: 60, height: 30, resizeMode: 'contain' }} />
                }
                <View style={{backgroundColor: Colors.button_container_bg, marginTop: 20}}>
                    <Button 
                        color={Colors.button_bg}
                        style={{backgroundColor: Colors.button_bg}}
                        title='Get Card Info' onPress={() => getCardInfo(cardNumber, orderId, true)} />
               </View>
            </View>
            {showActivityIndicator &&
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
 
 export default GetCardInfo;
 