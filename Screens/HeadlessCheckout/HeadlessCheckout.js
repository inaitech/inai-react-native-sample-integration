/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from "react";

 import {
   SafeAreaView, Button, View
 } from 'react-native';
 
 const Flows = {
   "MakePayment": "Make Payment",
   "SavePaymentMethod": "Save A Payment Method",
   "MakePaymentWithSavedMethod": "Pay With saved Payment Method",
   "ValidateFields": "Validate Fields",
   "GetCardInfo": "Get Card Info",
   "GooglePay":"Google Pay"
 };

 const Colors = {
  "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
  "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
 };
 
 const HeadlessChekout = ({navigation}) => {
  const openFlow = (flowKey) => {
    let options = null;
    let navKey = flowKey;

    if (flowKey == "MakePayment") {
      //  Load product view with normal
      navKey = "Product";
      options = {mode: "normal"};
    } else if (flowKey == "MakePaymentWithSavedMethod") {
      //  Load product view with pay with saved method mode
      navKey = "Product";
      options = {mode: "payWithSavedMethod"};
    } 
    navigation.navigate(navKey, options); 
  };

  const renderButtons = () => {
    if (Platform.OS !== 'android') {
      //  Remove Google Pay option for non android platforms
      delete Flows["GooglePay"];
    }
    const views = [];
    for (let flowKey in Flows) {
      let flow = Flows[flowKey];
      views.push(
        <View
          key={flowKey}
          style={{
            backgroundColor: Colors.button_container_bg, 
            marginLeft: 15, 
            borderRadius: 5,
            marginRight: 15, 
            marginTop: 10, 
            padding: 5}}
        >
          <Button
            onPress= { () => {
                openFlow(flowKey);
              }
            }
            color={Colors.button_bg}
            title= {flow}
          />
        </View>
        );
    }
    
    return views;
  }

   return (
     <>
       <SafeAreaView>
       <View style={{paddingTop: 20, backgroundColor: "#fff"}}>
         {
           renderButtons()
         }
         </View>
       </SafeAreaView>
     </>
   );
 };
 
 export default HeadlessChekout;
 