
# inai-react-native-sample-integration

## Overview

This repository demonstrates how to use the Inai SDK in your React Native Project.
  
## Features

### Headless Checkout

- Make a payment with variety of payment methods
File : [MakePayment.js](https://github.com/inaitech/inai-react-native-sample-integration/blob/de52e5918dad05e9b1cbdb4a6a66bbf26b071e94/Screens/HeadlessCheckout/MakePayment/MakePayment.js)

- Save a payment method
   File : [SavePaymentMethod.js](https://github.com/inaitech/inai-react-native-sample-integration/blob/de52e5918dad05e9b1cbdb4a6a66bbf26b071e94/Screens/HeadlessCheckout/SavePaymentMethod/SavePaymentMethod.js)

- Pay with Saved Payment Method
File : [MakePaymentWithSavedMethod.js](https://github.com/inaitech/inai-react-native-sample-integration/blob/de52e5918dad05e9b1cbdb4a6a66bbf26b071e94/Screens/HeadlessCheckout/MakePaymentWithSavedMethod/MakePaymentWithSavedMethod.js)

- Validate Fields
File : [ValidateFields.js](https://github.com/inaitech/inai-react-native-sample-integration/blob/de52e5918dad05e9b1cbdb4a6a66bbf26b071e94/Screens/HeadlessCheckout/ValidateFields/ValidateFields.js)

- Get Card Info
File : [GetCardInfo.js ](https://github.com/inaitech/inai-react-native-sample-integration/blob/de52e5918dad05e9b1cbdb4a6a66bbf26b071e94/Screens/HeadlessCheckout/GetCardInfo/GetCardInfo.js)

### Drop In Checkout
- Make a payment using Inai's Checkout Interface
File: [DropInCheckout.js](https://github.com/inaitech/inai-react-native-sample-integration/blob/de52e5918dad05e9b1cbdb4a6a66bbf26b071e94/Screens/DropIn/DropInCheckout.js)

## Prerequisites

- To begin, you will require the client username and client password values. Instructions to get this can be found [here](https://docs.inai.io/docs/getting-started)

- Make sure the following steps are completed in the merchant dashboard,

- [Adding a Provider](https://docs.inai.io/docs/adding-a-payment-processor)

- [Adding Payment Methods](https://docs.inai.io/docs/adding-a-payment-method)

- [Customizing Checkout](https://docs.inai.io/docs/customizing-your-checkout)


### Minimum Requirements

React: 16.13.1
React-Native: 0.63.4

## Setup
  
To start the backend NodeJS server:

1. Navigate to the ./server folder at the root level.

2. Run command `npm install` to install the dependency packages.

3. Add a new .env file the following variables:

1. client_username

2. client_password

4. Run command `npm start` to start the nodejs backend server


To setup the inai sample app for React Native, follow the steps below:

1.  `git clone https://github.com/inaitech/inai-react-native-sample-integration`

2. Navigate to ./Constants.js file and update the following values :

- Client Username

- Client Password

- Country

- Amount // for order creation

- Currency // for order creation

- Base URL // backend api server url eg: http://localhost:5009

3. Run command `pod install` in the ./ios folder of the project to install the CocoaPods dependencies.

4.    At the root level of the repo run command `npx react-native run-android` for android and for ios run `npx react-native run-ios`
Note: For Android have an Android emulator running (quickest way to get started), or a device connected.

## FAQs

<TBA>

## Support

If you found a bug or want to suggest a new [feature/use case/sample], please contact **[customer support](mailto:support@inai.io)**.