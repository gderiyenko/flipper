import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';

export default function CardFlip() {

  let [side, setSide] = useState(0); // Card's side [0, 1]

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPressIn={() => setSide((++side) % 2)}>
        <View style={styles.card} lightColor="#f7f7f7" darkColor="#292c34">

          {side
            ? (<Text lightColor="red" darkColor="white" style={{ fontSize: 35 }}>alalla</Text>)
            : (
              <View lightColor="#f7f7f7" darkColor="#292c34">
                <Ionicons size={35} name="language-outline" color="red"/>
                <Text lightColor="red" darkColor="white" style={{ fontSize: 35 }}>translate</Text>
              </View>
            )
          }

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
