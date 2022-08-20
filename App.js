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
 
 // Make Paymnent Screens
 import MakePayment from "./Screens/HeadlessCheckout/MakePayment/MakePayment";
 import MakePayment_Fields from "./Screens/HeadlessCheckout/MakePayment/MakePayment_Fields";
 
 // Save Paymnent Method Screens
 import SavePaymentMethod from "./Screens/HeadlessCheckout/SavePaymentMethod/SavePaymentMethod";
 import SavePaymentMethod_Fields from "./Screens/HeadlessCheckout/SavePaymentMethod/SavePaymentMethod_Fields";

 // Make Payment With Saved Method
 import MakePaymentWithSavedMethod from "./Screens/HeadlessCheckout/MakePaymentWithSavedMethod/MakePaymentWithSavedMethod";
 import MakePaymentWithSavedMethod_Fields from "./Screens/HeadlessCheckout/MakePaymentWithSavedMethod/MakePaymentWithSavedMethod_Fields";
 
 //  Validate Fields
 import ValidateFields from "./Screens/HeadlessCheckout/ValidateFields/ValidateFields";
 import ValidateFields_Fields from "./Screens/HeadlessCheckout/ValidateFields/ValidateFields_Fields";

 const Stack = createNativeStackNavigator();

 const App = () => {
   return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{ title: "Home" }} />
            
            <Stack.Screen name="HeadlessCheckout" component={HeadlessCheckout} options={{ title: "Headless Checkout"}} />
            <Stack.Screen name="Product" component={Product} options={{ title: "Product" }} />

            <Stack.Screen name="MakePayment" component={MakePayment} options={{ title: "Payment Methods" }} />
            <Stack.Screen name="MakePayment_Fields" component={MakePayment_Fields} options={{ title: "Payment" }} />

            <Stack.Screen name="SavePaymentMethod" component={SavePaymentMethod} options={{ title: "Payment Methods" }} />
            <Stack.Screen name="SavePaymentMethod_Fields" component={SavePaymentMethod_Fields} options={{ title: "Save Payment Method" }} />

            <Stack.Screen name="MakePaymentWithSavedMethod" component={MakePaymentWithSavedMethod} options={{ title: "Saved Payment Methods" }} />
            <Stack.Screen name="MakePaymentWithSavedMethod_Fields" component={MakePaymentWithSavedMethod_Fields} options={{ title: "Payment" }} />

            <Stack.Screen name="ValidateFields" component={ValidateFields} options={{ title: "Payment Methods" }} />
            <Stack.Screen name="ValidateFields_Fields" component={ValidateFields_Fields} options={{ title: "Validate Fields" }} />

        </Stack.Navigator>
     </NavigationContainer>
   );
 };
 
 export default App;
 