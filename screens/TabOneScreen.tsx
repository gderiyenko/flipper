import * as React from 'react';
import { Pressable } from 'react-native';
import * as SQLite from "expo-sqlite";
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { RootTabScreenProps } from '../types';
import CardFlip from '../components/CardFlip';

function openDatabase() {
  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>, groupParams?: any) {
  let [currentGroupName, setCurrentGroupName] = React.useState(groupParams.name ?? "All Groups");
  let [currentGroupWhere, setCurrentGroupWhere] = React.useState(groupParams.where ?? "1");

  const [reload, cardReload] = React.useState(false);
  const [cardRef, setRef] = React.useState();

  return (
    <View style={{ flex: 1, }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
        {/* Left */}
        <View style={{ width: '33%' }}>
          <Text style={{}}> </Text>
        </View>

        {/* Center */}
        <View style={{ width: '33%', flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{}}>{currentGroupName}</Text>
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
      <Swipeable
        containerStyle={{ width: '100%', height: '100%' }}
        ref={(ref: any) => setRef(ref)}
        renderRightActions={() => {
          return (
            <View style={[{ height: '100%', width: "100%" },]}>
            </View>
          )
        }}
        onSwipeableRightWillOpen={
          () => {
            cardRef.close()
            cardReload(true)
            setTimeout(() => cardReload(false), 200);
          }
        }>
        <View style={{ width: '100%', height: '100%', }}>
          {reload? <></> : <CardFlip native={"a"} translate={"b"}></CardFlip>}
        </View>

      </Swipeable>

    </View>
  );
}