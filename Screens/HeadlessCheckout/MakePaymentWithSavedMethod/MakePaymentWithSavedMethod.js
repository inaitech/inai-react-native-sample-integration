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
   SafeAreaView, FlatList, Text, View, ActivityIndicator, Alert, TouchableOpacity
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

    let storedCustomerId = await getStoredCustomerId();
     let postData = {
         "amount": Constants.amount,
         "currency": Constants.currency,
         "description": "Acme Shirt",
         "metadata": {"test_order_id": "5735"},
         "customer" : {"id": storedCustomerId}
     };

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
     console.log("jsonData: " + JSON.stringify(jsonData));
     
     let id = jsonData.id || null;
     if(id != null) {
      //  Store the customer id
      storeCustomerId(jsonData.customer_id);
     }
     return id;
 }

 const getCustomerPayments = async () => {        
  const authStr = `Basic ${Base64.btoa(Constants.token + ":" + Constants.password, "base64")}`;
  const requestOptions = {
      method: "GET",
      headers: { 
                  "Content-Type": "application/json",
                  "Authorization": authStr
              }
  };

  let storedCustomerId = await getStoredCustomerId();
  const url = `${Constants.base_url}/customers/${storedCustomerId}/payment-methods`;
  const response = await fetch(url, requestOptions);
  const jsonData = await response.json();
  let payment_method_options = jsonData.payment_methods || [];
  return payment_method_options;
}

 const MakePaymentWithSavedMethod = ({navigation}) => {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
      async function initData() {
        //  Load order id
        let storedCustomerId = await getStoredCustomerId();
        if (!storedCustomerId) {
          Alert.alert(
            "Alert",
            "No Saved Payment methods.",
            [
              {text: 'OK', onPress: () => { 
                navigation.navigate("Home");
              }},
            ]
          );
          return;
        }

        let generatedOrderId = await preapreOrder();
        if (generatedOrderId!= null) {
          //  Load the payment options data
          let payment_method_options = await getCustomerPayments(generatedOrderId);
          
          if (payment_method_options.length > 0) {
            setOrderId(generatedOrderId);
            setPaymentOptions(payment_method_options);
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


  const getPaymentOptions = async () => {
    const authStr = `Basic ${Base64.btoa(Constants.token + ":" + Constants.password, "base64")}`;
    const requestOptions = {
        method: "GET",
        headers: { 
                    "Content-Type": "application/json",
                    "Authorization": authStr
                }
    };

    const url = `${Constants.base_url}/payment-method-options?order_id=${orderId}&country=${Constants.country}&saved_payment_method=true`;
    const response = await fetch(url, requestOptions);
    const jsonData = await response.json();
    let payment_method_options = jsonData.payment_method_options || [];
    return payment_method_options;
  };

  const paymentOptionSelected = async (paymentOption) => {
    
    let customerPaymentMethodOptions = await getPaymentOptions();
    
    //  match our payment option  
    let customerPaymentMethod = customerPaymentMethodOptions.find((cpm) => cpm.rail_code == paymentOption.type);
    if (customerPaymentMethod) {
      customerPaymentMethod.paymentMethodId = paymentOption.id
      navigation.navigate("MakePaymentWithSavedMethod_Fields", {paymentOption: customerPaymentMethod, orderId});
    } else {
      Alert.alert(
        "Error",
        "Error while loading saved payment method details.",
        [
          {text: 'OK', onPress: () => { 
            //  navigation.navigate("Home");
          }},
        ]
      );
    }
  }

  const sanitizePaymentMethod = (paymentMethod) => {
    let paymentMethodType = paymentMethod.type;
    let retVal = paymentMethodType;
    if (paymentMethodType == "card") {
        let cardDetails = paymentMethod["card"];
        if (cardDetails) {
          let cardName = cardDetails["brand"];
          let last4 = cardDetails["last_4"];
          retVal = `${cardName} - ${last4}`;
        }
    }
    return retVal;
  };

   return (
       <SafeAreaView style={{flex: 1, backgroundColor: "#fff" }}>
        <FlatList
        style={{paddingTop: 10}}
          data={paymentOptions}
          keyExtractor={(item, index) => item.id }
          renderItem={({item}) => 
          <TouchableOpacity onPress={()=> paymentOptionSelected(item)} 
            style={{borderBottomWidth: 1, borderBottomColor: "#cfcfcf"}}>
          <Text 
            style={{
              padding: 10,
              fontSize: 18,
              height: 44}}
            >{sanitizePaymentMethod(item)}</Text>
          </TouchableOpacity>
        }
        />
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

 export default MakePaymentWithSavedMethod;
 