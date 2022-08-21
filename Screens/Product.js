/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from "react";
 
 import {
   SafeAreaView, Button, Image, Text, View
 } from 'react-native';
 
 const Colors = {
  "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd"
};

 const Product = ({navigation, route}) => {

  const {mode} = route.params;

  const showPaymentOptions = () => {
    if (mode == "payWithSavedMethod") {
      navigation.navigate("MakePaymentWithSavedMethod");
    } else {
      navigation.navigate("MakePayment");
    }
  };

   return (
     <>
       <SafeAreaView style={{backgroundColor: "#fff"}}>

         <Text style={{marginTop: 20, marginBottom: 20, fontSize: 20, fontWeight: "700", textAlign: "center"}}>Acme Shirt</Text>
         
         <View style={{justifyContent: 'center', alignItems: 'center',}}>
            <Image source={require("../Assets/inai-white.png")} 
                style={{ width: 80, height: 80, resizeMode: 'contain' }} />

            <Image source={require("../Assets/tshirt.jpeg")} 
                style={{ width: 200, height: 220, resizeMode: 'contain' }} />
         </View>
         <Text style={{textAlign: 'center', width: "100%", fontSize: 16, fontWeight:"500"}}>MANCHESTER UNITED 21/22 HOME JERSEY</Text>
         <Text style={{textAlign: 'center'}}>{`
A FAN JERSEY INSPIRED BY A LEGENDARY HOME KIT.

`}</Text>
         <View
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
                    showPaymentOptions();
                 }
               }
               color={Colors.button_bg}
               title= "Buy Now"
             />
           </View>
       </SafeAreaView>
     </>
   );
 };
 
 export default Product;
 