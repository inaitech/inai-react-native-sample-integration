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
 
 //  Apple Pay
 import ApplePay from "./Screens/HeadlessCheckout/ApplePay/ApplePay";

 //  Validate Fields
 import ValidateFields from "./Screens/HeadlessCheckout/ValidateFields/ValidateFields";
 import ValidateFields_Fields from "./Screens/HeadlessCheckout/ValidateFields/ValidateFields_Fields";

 // Get Card Info
 import GetCardInfo from "./Screens/HeadlessCheckout/GetCardInfo/GetCardInfo";

 // Drop In Flows
 import DropInFlows from "./Screens/DropIn/DropInFlows";

 // Drop In Checkput
 import DropInCheckout from "./Screens/DropIn/DropInCheckout/DropInCheckout";

 // Add Payment Method
 import AddPaymentMethod from "./Screens/DropIn/AddPaymentMethod/AddPaymentMethod";

 // Pay With Payment Method
 import PayWithPaymentMethod from "./Screens/DropIn/PayWithPaymentMethod/PayWithPaymentMethod";

 // Google Pay
 import GooglePayPaymentOptions from "./Screens/HeadlessCheckout/GooglePay/GooglePayPaymentOptions";
 import GooglePayFields from "./Screens/HeadlessCheckout/GooglePay/GooglePayFields"

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

            <Stack.Screen name="ApplePay" component={ApplePay} options={{ title: "Apple Pay" }} />

            <Stack.Screen name="ValidateFields" component={ValidateFields} options={{ title: "Payment Methods" }} />
            <Stack.Screen name="ValidateFields_Fields" component={ValidateFields_Fields} options={{ title: "Validate Fields" }} />

            <Stack.Screen name="GetCardInfo" component={GetCardInfo} options={{ title: "Get Card Info" }} />

            <Stack.Screen name="DropInFlows" component={DropInFlows} options={{ title: "Drop In Checkout"}} />

            <Stack.Screen name="DropInCheckout" component={DropInCheckout} options={{ title: "Checkout" }} />

            <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethod} options={{ title: "Add Payment Method" }} />

            <Stack.Screen name="PayWithPaymentMethod" component={PayWithPaymentMethod} options = {{ title: "Pay With Payment method"}}/>

            <Stack.Screen name="GooglePay" component={GooglePayPaymentOptions} options = {{title : "Payment Methods"}} />
            <Stack.Screen name="GooglePayFields" component={GooglePayFields} options = {{title : "Google Pay"}} />
            
        </Stack.Navigator>
     </NavigationContainer>
   );
 };
 
 export default App;
 