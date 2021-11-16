import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';

export default function CardFlip(props) {

  let [side, setSide] = useState(0); // Card's side [0, 1]

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={() => setSide((++side) % 2)}>
        <View style={styles.card} lightColor="#f7f7f7" darkColor="#292c34">
          {side == 0 ? <Ionicons size={35} name="language-outline" color="red" /> : <></>}
          <View lightColor="#f7f7f7" darkColor="#292c34">
            <Text lightColor="black" darkColor="white" style={{ fontSize: 35 }}>
              {side == 0 ? props.translate : props.native}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    // sizes
    width: '90%',
    height: '90%',
    // corners
    borderRadius: 4,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
