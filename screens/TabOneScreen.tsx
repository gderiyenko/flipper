import React, { useState } from 'react';
import { StyleSheet, Pressable, } from 'react-native';
import * as SQLite from "expo-sqlite";
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { RootTabScreenProps } from '../types';
import CardFlip from '../components/CardFlip';
import initDB from '../components/InitDB';
import { Profiles } from '../components/Tind';

function openDatabase() {
  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

const profiles: Profiles[] = [
  {
    id: "1",
    name: "Caroline",
    age: 24,
    profile: null,
  },
  {
    id: "2",
    name: "Jack",
    age: 30,
    profile: null,
  },
  {
    id: "3",
    name: "Anet",
    age: 21,
    profile: null,
  },
  {
    id: "4",
    name: "John",
    age: 28,
    profile: null,
  },
];

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>, groupParams?: any) {
  let [currentGroupName, setCurrentGroupName] = React.useState(groupParams.name ?? "All Groups");
  let [currentGroupWhere, setCurrentGroupWhere] = React.useState(groupParams.where ?? "1");
  const [current, setCurrent] = useState([]);

  const [reload, cardReload] = React.useState(false);
  const [cardRef, setRef] = React.useState();

  React.useEffect(() => {
    initDB();
    changeCurrentCard();
  }, []);

  /**
   * setCurrent (%new_value%)
   */
  function changeCurrentCard() {
    // Pick new value from the DB.
    db.transaction((tx) => {
      tx.executeSql(
        "select * from words where "
        + currentGroupWhere // filter by chosen groups
        + " ORDER BY random()  " // pick order
        + " Limit 1;", // 1 card is result
        [],
        (_, { rows: { _array } }) => setCurrent(_array[0])
      );
    },
      (err) => { console.log(err) },
      () => {
        // Dump next card words.
        console.log(current)
      },
    );
  }

  return (
    <View style={{ flex: 1, }}>

      {/* Header */}
      <>
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
      </>

      {/* CardStack */}
      <>
        <View style={[styles.card, styles.cardStack1,]} lightColor="#ffffff" darkColor="#08080a" />
        <View style={[styles.card, styles.cardStack2,]} lightColor="#fdfdfd" darkColor="#131418" />
        <View style={[styles.card, styles.cardStack3,]} lightColor="#fafafa" darkColor="#1e2026" />
      </>

      {/* Front Card */}
      {/* <Swipeable
        containerStyle={{ width: '100%', height: '100%' }}
        ref={(ref: any) => setRef(ref)}
        renderRightActions={() => {
          return (
            <View style={{
              height: '100%',
              width: "100%",
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }} />
          )
        }}
        onSwipeableRightOpen={
          () => {
            cardRef.close();
            cardReload(true);
            changeCurrentCard();
            setTimeout(() => cardReload(false), 200);
          }
        }
      >
        {
          reload || typeof current == 'undefined'
            ? <></>
            : <CardFlip native={current.native_text} translate={current.translate_text}></CardFlip>}
      </Swipeable> */}

<Profiles {...{ profiles }} />

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',

    // corners
    borderRadius: 4,

    alignItems: 'center',
    justifyContent: 'center',
    // 90 80
  },
  cardStack1: {
    top: '10%',
    right: '4%',
    // sizes
    height: '76%',
    width: '90%',
  },
  cardStack2: {
    top: '11%',
    right: '3%',
    // sizes
    height: '77%',
    width: '90%',
  },
  cardStack3: {
    top: '12%',
    right: '2%',
    // sizes
    height: '78%',
    width: '90%',
  },
});
