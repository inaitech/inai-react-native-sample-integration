/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from "react";

 import {useState} from "react";

 import CheckBox from  "@react-native-community/checkbox";
 import Constants from "./../../../Constants";
 import InaiCheckout  from  "ay-inai-react-native-sdk";
 import {
   SafeAreaView, FlatList, TextInput, NativeModules,ActivityIndicator, Text, View, Alert, Button
 } from 'react-native';
 
 const Colors = {
  "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
  "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
 };
 
 const ValidateFields_Fields = ({navigation, route}) => {

  let {paymentOption, orderId} = route.params;
  let [isLoading, setIsLoading] = useState(false);

  let paymentFields = paymentOption.form_fields.filter((f) => f.name !== "save_card");

  let initialPaymentDetails = {};
  for(let pf in paymentFields) {
    let paymentField = paymentFields[pf];
    initialPaymentDetails[paymentField.name] =  paymentField.field_type == "checkbox" ? true : "";
  }
  
  let [paymentDetails, setPaymentDetails] = useState(initialPaymentDetails);

  const validateFields = () => {
    let fields = [];
    for(let f in paymentDetails) {
        fields.push({"name": f, value: paymentDetails[f] });
    }

    setIsLoading(true);
    let paymentDetailsFields = {"fields": fields};
    let inaiConfig = {
      token: Constants.token,
      orderId: orderId,
      countryCode: Constants.country,
    };
    InaiCheckout.validateFields(
      inaiConfig,
      paymentOption.rail_code, 
      paymentDetailsFields).then((response) => {
        setIsLoading(false);
            Alert.alert(
              "Result",
              JSON.stringify(response),
              [
                {text: 'OK', onPress: () => {}},
              ]
            );
      }).catch((err) => {
        setIsLoading(false);
        Alert.alert(
          "Result",
          JSON.stringify(err),
          [
            {text: 'OK', onPress: () => {}},
          ]
        );
      });
  }

  const fieldChanged = (formField, val) => {
    let newPaymentDetails  = {...paymentDetails};
    newPaymentDetails[formField.name] = val;
    setPaymentDetails(newPaymentDetails);
  };

 const InputField = (formField)=> {
  if (formField.field_type == "checkbox") {
    return <CheckBox 
    value={paymentDetails[formField.name]}
    onValueChange={val => fieldChanged(formField, val)}
    style={{marginTop: 10, marginBottom: 10}} />;
  }

  return  <TextInput 
    style={{
      padding: 10,
      fontSize: 18,
      borderWidth: 1, 
      marginTop: 10,
      borderColor: "#ccc",
      borderRadius: 5,
      height: 44}}
      placeholder={formField.placeholder}
      autoCapitalize="none"
      autoCorrect={false}
      value={paymentDetails[formField.name]}
      onChangeText ={text => fieldChanged(formField, text)}
    ></TextInput>;
  };

   return (
       <SafeAreaView style={{flex: 1, backgroundColor: "#fff" }}>
        <FlatList
        style={{paddingTop: 10}}
          data={paymentFields}
          keyExtractor={(item, index) => item.name }
          renderItem={({item}) => 
          
          <View style={{width: "100%",
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 20}}>
          <Text style={{fontSize: 18}}>{item.label}</Text>
          {
            InputField(item)
          }
          </View>
        }
        />
          <View
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
                  validateFields();
                 }
               }
               color={Colors.button_bg}
               title= "Validate"
             />
           </View>
           {isLoading &&
          <View style={{  
                        position: "absolute", 
                        backgroundColor: "#F5FCFF88",
                        top: 0, right: 0, bottom: 0, left: 0, 
                        alignItems: 'center',
                        justifyContent: 'center'}}>
            <ActivityIndicator size='large' />
          </View>
          }
       </SafeAreaView>
   );
 };

 export default ValidateFields_Fields;
 