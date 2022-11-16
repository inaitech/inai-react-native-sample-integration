import React, { useState } from "react";

import {
  View, Alert, ActivityIndicator,Button, Image, Text,
} from 'react-native';

import Constants from "../../../Constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Base64 from "./Base64";
import { SafeAreaView } from "react-native-safe-area-context";
import InaiCheckout from "react-native-inai-sdk";

const Colors = {
  "button_bg" : Platform.OS === 'ios' ? "white" : "#7673dd",
  "button_container_bg" : Platform.OS === 'ios' ? "#7673dd": "white"
};

const customerIdStoreKey = `customerId-${Constants.token}`;
const storeCustomerId = async (customerId) => {
  if (customerId) {
    try {
      await AsyncStorage.setItem(customerIdStoreKey, customerId);
    } catch (error) {
      console.error(error);
    }
  }
}

const getStoredCustomerId = async () => {
  let storedCustomerId = null;
  try {
    storedCustomerId = await AsyncStorage.getItem(customerIdStoreKey);
  } catch (error) {
    console.error(error);
  }

  return storedCustomerId;
}

const preapreOrder =
  async () => {
    let postData = {
      "amount": Constants.amount,
      "currency": Constants.currency,
      "description": "Acme Shirt",
      "metadata": { "test_order_id": "5735" },
      "customer": {}
    };

    let storedCustomerId = await getStoredCustomerId();
    if (storedCustomerId) {
      postData.customer.id = storedCustomerId;
    } else {
      postData.customer = {
        "email": "testdev@test.com",
        "first_name": "Dev",
        "last_name": "Smith",
        "contact_number": "01010101010"
      };
    }

    const authStr = `Basic ${Base64.btoa(Constants.token + ":" + Constants.password, "base64")}`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authStr
      },
      body: JSON.stringify(postData)
    };

    const ordersUrl = `${Constants.base_url}/orders`;
    const response = await fetch(ordersUrl, requestOptions);
    const jsonData = await response.json();

    let id = jsonData.id || null;
    if (id != null) {
      //  Store the customer id
      storeCustomerId(jsonData.customer_id);
    }
    return id;
  }

const presentCheckout = (orderId, navigation) => {

  let styles = {
    container: { backgroundColor: "#fff" },
    cta: { backgroundColor: "#123456" },
    errorText: { color: "#000000" }
  };

  let inaiConfig = {
    token: Constants.token,
    orderId: orderId,
    countryCode: Constants.country,
    styles: styles
  };

  InaiCheckout.presentCheckout(inaiConfig).then((response) => {
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

const DropInCheckout = ({ navigation }) => {
  let [showActivityIndicator, setShowActivityIndicator] = useState(false);

  const initData = async () => {
    setShowActivityIndicator(true);
    //  Load order id
    let generatedOrderId = await preapreOrder();
    if (generatedOrderId != null) {
      setShowActivityIndicator(false);
      presentCheckout(generatedOrderId, navigation);
    } else {
      setShowActivityIndicator(false);
      Alert.alert(
        "Error",
        "Error while creating order",
        [
          {
            text: 'OK', onPress: () => {
              navigation.navigate("Home");
            }
          },
        ]
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {showActivityIndicator &&
        <View style={{
          position: "absolute",
          backgroundColor: "#F5FCFF88",
          top: 0, right: 0, bottom: 0, left: 0,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ActivityIndicator size='large' />
        </View>
      }
      <Text style={{ marginTop: 20, marginBottom: 20, fontSize: 20, fontWeight: "700", textAlign: "center" }}>Acme Shirt</Text>

      <View style={{ justifyContent: 'center', alignItems: 'center', }}>
        <Image source={require("../../../Assets/inai-white.png")}
          style={{ width: 80, height: 80, resizeMode: 'contain' }} />

        <Image source={require("../../../Assets/tshirt.jpeg")}
          style={{ width: 200, height: 220, resizeMode: 'contain' }} />
      </View>
      <Text style={{ textAlign: 'center', width: "100%", fontSize: 16, fontWeight: "500" }}>MANCHESTER UNITED 21/22 HOME JERSEY</Text>
      <Text style={{ textAlign: 'center' }}>{`
A FAN JERSEY INSPIRED BY A LEGENDARY HOME KIT.

`}</Text>
      <View
        style={{
          backgroundColor: Colors.button_container_bg,
          marginLeft: 15,
          borderRadius: 5,
          marginRight: 15,
          marginTop: 10,
          padding: 5
        }}
      >
        <Button
          onPress={() => {
            initData();
          }
          }
          color={Colors.button_bg}
          title="Buy Now"
        />
      </View>
    </SafeAreaView>
  );
};

export default DropInCheckout;