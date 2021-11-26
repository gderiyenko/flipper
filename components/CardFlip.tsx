import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from './Themed';

export default function CardFlip(props) {

  let [side, setSide] = useState(0); // Card's side [0, 1]

  return (
    <View style={styles.container}>
      <View style={[styles.card, { position: 'absolute', zIndex: 1 }]} >

      </View>
      <TouchableWithoutFeedback onPress={() => setSide((++side) % 2)} >
        <View style={[styles.card, { zIndex: 20 }]} lightColor="#f7f7f7" darkColor="#292c34">
          {side == 0 ? <Ionicons size={35} name="language-outline" color="red" /> : <></>}
          <Text style={{ fontSize: 35 }}>
            {side == 0 ? props.translate : props.native}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  card: {
    right: '1%',
    // sizes
    height: '92%',
    width: '90%',

    // corners
    borderRadius: 4,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
