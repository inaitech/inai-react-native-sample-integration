/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from "react";
 import { useEffect, useState } from 'react';
 
 import Constants from "../../../Constants";
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import Base64 from "./Base64";

 import {
   SafeAreaView, Alert, Button, View, Image, TextInput, ActivityIndicator, NativeModules
 } from 'react-native';
 
 const Colors = {
    "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd"
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

    const { InaiCheckoutModule } = NativeModules;

    let [cardNumber, setCardNumber] = useState("");
    let [isLoading, setIsLoading] = useState(true);
    let [orderId, setOrderId] = useState(null);
    let [pendingCardNumber, setPendingCardNumber] = useState(null);
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

    const fieldChanged = (val) => {
        console.log("Card Number : " + val);
        setCardNumber(val);
        if (val.length > 5) {
            getCardInfo(val);
        }
    };

    const getCardInfo = (getInfoForCardNumber, showResultAlert=false) => {

        if (isLoading) {
            //  Cache this as the next request
            console.log("Caching request for " + getInfoForCardNumber)
            setPendingCardNumber(getInfoForCardNumber);
            return;
        }

        console.log("Fetching Data for " + getInfoForCardNumber)
        setIsLoading(true);
        InaiCheckoutModule.getCardInfo(Constants.token, orderId, 
            Constants.country, getInfoForCardNumber).then((response) => {
                setIsLoading(false);
                if (showResultAlert){
                    Alert.alert(
                        "Result",
                        JSON.stringify(response),
                        [{text: 'OK'}]
                    );
                } else {
                    //  Process current result
                    processCardInfoResult(response);
                    
                    //  Process any cached requests now..
                    if (pendingCardNumber) {
                        getCardInfo(pendingCardNumber);
                        setPendingCardNumber(null);
                    }
                }
            }).catch((err) => {
            setIsLoading(false);
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
                        onChangeText ={text => fieldChanged(text)}/>

                {showCardImage && 
                 <Image source={cardImagePath} 
                    style={{ position:"absolute", right: 20, top: 26, width: 60, height: 30, resizeMode: 'contain' }} />
                }
                <View style={{backgroundColor: Colors.button_bg, marginTop: 20}}>
                    <Button 
                        color={Colors.button_bg}
                        style={{backgroundColor: Colors.button_bg}}
                        title='Get Card Info' onPress={() => getCardInfo(cardNumber, true)} />
               </View>
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
 
 export default GetCardInfo;
 