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
    "button_bg" : "#7673dd"
 };

 const MakePayment = ({navigation, route}) => {

  const {mode} = route.params;

  const showPaymentOptions = () => {
    navigation.navigate("MakePayment");
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
Youth. Courage. Success. The thee pillars of Manchester United's motto have brought the club more than a century of triumphs. With its clean red design and white ribbed crewneck, this juniors' adidas football jersey takes inspiration from the iconic kit that carried them to some of their most memorable moments. Made for fans, its soft fabric and moisture-absorbing AEROREADY keep you comfortable. A devil signoff on the back shows your pride.

This product is made with Primegreen, a series of high-performance recycled materials.
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
               color="white"
               title= "Buy Now"
             />
           </View>
       </SafeAreaView>
     </>
   );
 };
 
 export default MakePayment;
 