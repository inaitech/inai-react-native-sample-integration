/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from "react";
 import { NavigationContainer } from '@react-navigation/native';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import Home from "./Screens/Home";
 import HeadlessCheckout from  "./Screens/HeadlessCheckout/HeadlessCheckout";
 import Product from "./Screens/Product";
 
 import MakePayment from "./Screens/HeadlessCheckout/MakePayment/MakePayment";
 import MakePayment_Fields from "./Screens/HeadlessCheckout/MakePayment/MakePayment_Fields";
 
 const Stack = createNativeStackNavigator();

 const App = () => {
   return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{ title: "Home" }} />
            
            <Stack.Screen name="HeadlessCheckout" component={HeadlessCheckout} options={{ title: "Headless Checkout"}} />
            <Stack.Screen name="Product" component={Product} options={{ title: "Product" }} />

            <Stack.Screen name="MakePayment" component={MakePayment} options={{ title: "Payment Options" }} />
            <Stack.Screen name="MakePayment_Fields" component={MakePayment_Fields} options={{ title: "Payment" }} />

        </Stack.Navigator>
     </NavigationContainer>
   );
 };
 
 export default App;
 