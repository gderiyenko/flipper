import * as React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { RootTabScreenProps } from '../types';
import CardFlip from '../components/CardFlip';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={{ flex: 1, }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
        {/* Left */}
        <View style={{ width: '33%' }}>
        <Text style={{ }}> </Text>
        </View>

        {/* Center */}
        <View style={{ width: '33%', flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ }}>GroupName</Text>
        </View>

        {/* Right */}
        <Pressable
          onPress={() => navigation.navigate('Modal')}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            width: '33%',
            flexDirection: 'row', 
            justifyContent: 'flex-end'
          })}>
          <Ionicons
            name="list-outline"
            size={25}
            color="gray"
            style={{ marginRight: 15 }}
          />
        </Pressable>
      </View>
      {/* END: Header */}

      <CardFlip />

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
  },
});
