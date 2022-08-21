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
   "HeadlessCheckout":  "Headless Checkout"
 }

 const Colors = {
  "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd"
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
               backgroundColor: Colors.button_bg, 
               marginLeft: 15, 
               borderRadius: 5,
               marginRight: 15, 
               marginTop: 10, 
               padding: 5}}
           >
             <Button
               onPress= { () => {
                    navigation.navigate(flowKey);
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
 