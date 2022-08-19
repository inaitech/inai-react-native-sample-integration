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

 import {
   SafeAreaView, FlatList, Text, View, Alert, TouchableOpacity
 } from 'react-native';
 
 const preapreOrder =
    async () => {        
     let postData = {
         "amount": Constants.amount,
         "currency": Constants.currency,
         "description": "Acme Shirt",
         "metadata": {"test_order_id": "5735"},
         "customer" : {
             "email": "testdev@test.com",
             "first_name": "Dev",
             "last_name": "Smith",
             "contact_number": "01010101010"
         }
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
     let id = jsonData.id || null;
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

 const MakePayment = ({navigation}) => {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
      async function initData() {
        //  Load order id
        let generatedOrderId = await preapreOrder();
        if (generatedOrderId!= null) {
            //  Load the payment options data
            let payment_method_options = await getPaymentOptions(generatedOrderId);
            
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
      }

      initData();
  }, [])

  const paymentOptionSelected = (paymentOption) => {
    navigation.navigate("MakePayment_Fields", {paymentOption, orderId});
  }

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
            >{item.rail_code}</Text>
          </TouchableOpacity>
        }
        />
       </SafeAreaView>
   );
 };

 export default MakePayment;
 