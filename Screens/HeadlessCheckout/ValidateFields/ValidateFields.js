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

 const ValidateFields = ({navigation}) => {
  let [paymentOptions, setPaymentOptions] = useState([]);
  let [orderId, setOrderId] = useState(null);
  let [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
      async function initData() {
        //  Load order id
        let generatedOrderId = await preapreOrder();
        if (generatedOrderId!= null) {
          //  Load the payment options data
          let payment_method_options = await getPaymentOptions(generatedOrderId);
          
          if (payment_method_options.length > 0) {
            setOrderId(generatedOrderId);
            payment_method_options = payment_method_options.filter(
              (pmo) => pmo.rail_code.toLowerCase() !== "apple pay" && pmo.rail_code.toLowerCase() !== "google pay");
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

  const paymentOptionSelected = (paymentOption) => {
    navigation.navigate("ValidateFields_Fields", {paymentOption, orderId});
  }

  const sanitizeRailCode =(railCode) => {
    let cleanStr = railCode.replace(/_/g, "");
    let capitalizedStr = cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1);
    return capitalizedStr;
  };

   return (
       <SafeAreaView style={{flex: 1, backgroundColor: "#fff" }}>
        <FlatList
        style={{paddingTop: 10}}
          data={paymentOptions}
          keyExtractor={(item, index) => item.rail_code }
          renderItem={({item}) => 
          <TouchableOpacity onPress={()=> paymentOptionSelected(item)} 
            style={{borderBottomWidth: 1, borderBottomColor: "#cfcfcf"}}>
          <Text 
            style={{
              padding: 10,
              fontSize: 18,
              height: 44}}
            >{sanitizeRailCode(item.rail_code)}</Text>
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

 export default ValidateFields;
 