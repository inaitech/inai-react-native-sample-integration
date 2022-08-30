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
 
 // Add more flows here
 const Flows = {
   "HeadlessCheckout":  "Headless Checkout",
   "DropInCheckout": "Drop In Checkout"
 }

 const Colors = {
  "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
  "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
};

const openFlow = (flowKey, navigation) => {
  let options = null;
  let navKey = flowKey;

  if (flowKey == "HeadlessCheckout") {
    //  Load Headless flows view 
    navigation.navigate(flowKey);
  } else if (flowKey == "DropInCheckout") {
    //  Load product view with pay with saved method mode
    navKey = "Product";
    options = {mode: "dropInCheckout"};
  } 
  navigation.navigate(navKey, options); 
};
 
 const HomeFlows = ({navigation}) => {   
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
                    openFlow(flowKey, navigation);
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

export default HomeFlows;
 