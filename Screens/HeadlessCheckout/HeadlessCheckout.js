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
   "SavePaymentMethod": "Save Payment Method"
 };

 const Colors = {
  "button_bg" : "#7673dd"
};
 
 const HeadlessChekout = ({navigation}) => {
  const openFlow = (flowKey) => {
    let options = null;
    let navKey = flowKey;

    if (flowKey == "MakePayment") {
      navKey = "Product";
      options = {mode: "normal"};
    }

    navigation.navigate(navKey, options); 
  };

  const renderButtons = () => {
    const views = [];
    for (let flowKey in Flows) {
      let flow = Flows[flowKey];
      views.push(
        <View
          key={flowKey}
          style={{
            backgroundColor: Colors.button_bg, 
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
            color="white"
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
 