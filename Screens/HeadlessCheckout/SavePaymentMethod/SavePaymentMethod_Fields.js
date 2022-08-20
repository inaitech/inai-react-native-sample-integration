/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from "react";

 import {useEffect, useState} from "react";

 import CheckBox from  "@react-native-community/checkbox";
 import Constants from "./../../../Constants";
 
 import {
   SafeAreaView, FlatList, TextInput, NativeModules, Text, View, Alert, Button
 } from 'react-native';
 
 const Colors = {
  "button_bg" : "#7673dd"
 };
 
 const SavePaymentMethod_Fields = ({navigation, route}) => {
  const { InaiCheckoutModule } = NativeModules;
  const {paymentOption, orderId} = route.params;
  const paymentFields = paymentOption.form_fields.filter((f) => f.name !== "save_card");

  let [paymentDetails, setPaymentDetails] = useState({});

  const submitPayment = () => {
    let fields = [];
    for(let f in paymentDetails) {
        fields.push({"name": f, value: paymentDetails[f] });
    }

    fields.push({"name":"save_card", "value": true});
    let paymentDetailsFields = {"fields": fields};
    InaiCheckoutModule.makePayment(Constants.token, orderId, Constants.country, 
                      paymentOption.rail_code, paymentDetailsFields).then((response) => {
            Alert.alert(
              "Result",
              JSON.stringify(response),
              [
                {text: 'OK', onPress: () => { 
                  navigation.navigate("Home");
                }},
              ]
            );
      }).catch((err) => {
        Alert.alert(
          "Result",
          JSON.stringify(err),
          [
            {text: 'OK', onPress: () => { 
              navigation.navigate("Home");
            }},
          ]
        );
      });
  }

const fieldChanged = (formField, val) => {
  paymentDetails[formField.name] = val;
  setPaymentDetails(paymentDetails)
};

 const InputField = (formField)=> {
  if (formField.field_type == "checkbox") {
    return <CheckBox 
    onValueChange={val => fieldChanged(formField, val)}
    style={{marginTop: 10, marginBottom: 10}} />;
  }

  return  <TextInput 
    style={{
      padding: 10,
      fontSize: 18,
      borderBottomWidth: 0.2,
      height: 44}}
      placeholder={formField.placeholder}
      autoCapitalize="none"
      autoCorrect="false"
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
                  paddingTop: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#cfcfcf"}}>
          <Text style={{fontSize: 18}}>{item.label}</Text>
          {
            InputField(item)
          }
          </View>
        }
        />
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
                    submitPayment();
                 }
               }
               color="white"
               title= "Save"
             />
           </View>
       </SafeAreaView>
   );
 };

 export default SavePaymentMethod_Fields;
 