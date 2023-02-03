import React from "react";

 import {
   SafeAreaView, Button, View
 } from 'react-native';
 
 const Flows = {
   "DropInCheckout": "Checkout",
   "AddPaymentMethod": "Add A Payment Method",
   "PayWithPaymentMethod": "Pay With Payment Method"
 };

 const Colors = {
  "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
  "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
 };
 
 const DropInFlows = ({navigation}) => {
  const openFlow = (flowKey) => {
    let options = null;
    let navKey = flowKey;

    if (flowKey == "DropInCheckout") {
      //  Load product view with normal
      navKey = "DropInCheckout";
    }  else if (flowKey == "AddPaymentMethod") {
      //  Load product view with pay with Apple Pay Mode
      navKey = "AddPaymentMethod";
    }  else if (flowKey == "PayWithPaymentMethod") {
      //  Load product view with pay with saved method mode
      navKey = "PayWithPaymentMethod";
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
 
 export default DropInFlows;