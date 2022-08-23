/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";

import { useEffect, useState } from "react";

import CheckBox from "@react-native-community/checkbox";
import Constants from "./../../../Constants";
import ExpiryDate from "./ExpiryDate";

import {
  SafeAreaView, FlatList, TextInput, NativeModules, Text, View, Alert, Button
} from 'react-native';

const Colors = {
  "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
  "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
};

const MakePaymentWithSavedMethod_Fields = ({ navigation, route }) => {
  const { InaiCheckoutModule } = NativeModules;
  const { paymentOption, orderId } = route.params;
  const paymentFields = paymentOption.form_fields || [];

  let initialPaymentDetails = {};
  for (let pf in paymentFields) {
    let paymentField = paymentFields[pf];
    initialPaymentDetails[paymentField.name] = paymentField.field_type == "checkbox" ? true : "";
  }

  let [paymentDetails, setPaymentDetails] = useState(initialPaymentDetails);

  let initialInputValidations = {};
  for (let pf in paymentFields) {
    let paymentField = paymentFields[pf];
    if (paymentField.field_type !== "checkbox" && paymentField.validations.required) {
      initialInputValidations[paymentField.name] = { borderColor: "#ccc", isNonEmpty: false, isValid: false };
    }
  }
  let [inputValidations, setInputValidations] = useState(initialInputValidations);

  const validateForm = () => {
    let areFormInputsValid = true;
    let areRequiredInputsFilled = true;

    for (let f in inputValidations) {
      let formField = inputValidations[f];
      if (!formField.isNonEmpty) areRequiredInputsFilled = false;
      if (!formField.isValid) areFormInputsValid = false;
    }

    if (areFormInputsValid && areRequiredInputsFilled) {
      submitPayment();
    } else {
      Alert.alert("Please enter valid details");
    }
  }

  const submitPayment = () => {
    let fields = [];
    for (let f in paymentDetails) {
      fields.push({ "name": f, value: paymentDetails[f] });
    }

    let paymentDetailsFields = { "fields": fields };
    paymentDetailsFields["paymentMethodId"] = paymentOption.paymentMethodId;

    InaiCheckoutModule.makePayment(Constants.token, orderId, Constants.country,
      paymentOption.rail_code, paymentDetailsFields).then((response) => {
        Alert.alert(
          "Result",
          JSON.stringify(response),
          [
            {
              text: 'OK', onPress: () => {
                navigation.navigate("Home");
              }
            },
          ]
        );
      }).catch((err) => {
        Alert.alert(
          "Result",
          JSON.stringify(err),
          [
            {
              text: 'OK', onPress: () => {
                navigation.navigate("Home");
              }
            },
          ]
        );
      });
  }

  const fieldChanged = (formField, val) => {
    let newPaymentDetails = { ...paymentDetails };
    newPaymentDetails[formField.name] = val;
    setPaymentDetails(newPaymentDetails);
    if (formField.required) {
      verifyInputs(formField, val)
    }
  };

  const verifyInputs = (formField, inputText) => {
    let maxLength = formField.validations.max_length ? formField.validations.max_length : 10;
    let minLength = formField.validations.min_length ? formField.validations.min_length : 0;
    let pattern = formField.validations.input_mask_regex ? formField.validations.input_mask_regex : "\.*";
    let inputRegex = new RegExp(pattern);
    let newValidations = { ...inputValidations }

    const validInput = () => {
      newValidations[formField.name].borderColor = "green";
      newValidations[formField.name].isNonEmpty = true;
      newValidations[formField.name].isValid = true;
    }

    const invalidInput = () => {
      newValidations[formField.name].borderColor = "red";
      newValidations[formField.name].isValid = false;
    }

    const isEmpty = () => {
      newValidations[formField.name].borderColor = "red";
      newValidations[formField.name].isNonEmpty = false;
    }

    if (inputText.length == 0) {
      isEmpty();
    } else if (inputText.length < minLength || inputText.length > maxLength) {
      invalidInput();
    } else if (!inputRegex.test(inputText)) {
      invalidInput();
    } else {
      validInput();
    }
    setInputValidations(newValidations);

  }

  const InputField = (formField) => {
    if (formField.field_type == "checkbox") {
      return <CheckBox
        value={paymentDetails[formField.name]}
        onValueChange={val => fieldChanged(formField, val)}
        style={{ marginTop: 10, marginBottom: 10 }} />;
    } else if (formField.name == "expiry") {
      return <ExpiryDate onCardExpiryValueChanged={fieldChanged} formFieldObject={formField} />
    }


    return <TextInput
      style={{
        padding: 10,
        fontSize: 18,
        borderWidth: 1,
        marginTop: 10,
        borderColor: formField.required ? inputValidations[formField.name].borderColor : "#ccc",
        borderRadius: 5,
        height: 44
      }}
      placeholder={formField.placeholder}
      autoCapitalize="none"
      autoCorrect={false}
      value={paymentDetails[formField.name]}
      onChangeText={text => fieldChanged(formField, text)}
    ></TextInput>;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        style={{ paddingTop: 10 }}
        data={paymentFields}
        keyExtractor={(item, index) => item.name}
        renderItem={({ item }) =>

          <View style={{
            width: "100%",
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 20
          }}>
            <Text style={{ fontSize: 18 }}>{item.label}</Text>
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
          padding: 5
        }}
      >
        <Button
          onPress={() => {
            validateForm();
          }
          }
          color="white"
          title="Pay with Saved Payment Method"
        />
      </View>
    </SafeAreaView>
  );
};

export default MakePaymentWithSavedMethod_Fields;
