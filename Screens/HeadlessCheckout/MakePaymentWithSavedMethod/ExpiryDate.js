import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { useState } from 'react';

function ExpiryDate(props) {

    const [cardExpiry, setCardExpiry] = useState('')
    let formattedExpiryDate = ''


    function cardExpiryHandler(expiryDate) {
        // Check necessary so that we format fresh inputs and not the same string.
        //  because once we set the  TextInput with formatted string onChangeText will be
        //  triggered again for the formatted string.
        if (expiryDate != cardExpiry) {
            //  Append a slash if length is 2 and slash is not yet added.
            if (expiryDate.length === 2 && !cardExpiry.endsWith('/')) {
                formattedExpiryDate = `${expiryDate}/`

            }
            //  This case handles a delete operation.
            //  For Ex. InputText = 12 and formattedExpiryDate = 12/ then a delete
            //  operation deletes the 2 along with the slash.
            else if (expiryDate.length === 2 && cardExpiry.endsWith('/')) {
                //  Valid month check
                if (parseInt(expiryDate) <= 12) {
                    formattedExpiryDate = expiryDate.substring(0, 1)
                } else {
                    formattedExpiryDate = ''
                }
            }
            //  If input is the first character and its above 1 (for ex: 5)
            //  then we assume its the 5th month and format it as 05
            else if (expiryDate.length === 1) {
                if (parseInt(expiryDate) > 1) {
                    formattedExpiryDate = `0${expiryDate}/`
                } else {
                    formattedExpiryDate = expiryDate
                }
            } else {
                formattedExpiryDate = expiryDate
            }
        }

        setCardExpiry(formattedExpiryDate);
        props.onCardExpiryValueChanged(props.formFieldObject, formattedExpiryDate);
    }

    return <View >
        <TextInput style={{
            padding: 10,
            fontSize: 18,
            borderWidth: 1,
            marginTop: 10,
            borderColor: "#ccc",
            borderRadius: 5,
            height: 44
        }} placeholder='Card Expiry' onChangeText={cardExpiryHandler} value={cardExpiry} maxLength={5} />
    </View>
}

export default ExpiryDate
