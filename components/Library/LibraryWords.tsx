import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { Button } from 'react-native-elements';

function openDatabase() {
  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

function Items(group_id: number) {
  const [items, setItems] = React.useState(null);
  let colorScheme = useColorScheme();

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from words where group_id = ?;`,
        [group_id],
        (_, { rows: { _array } }) => setItems(_array)
      );
    });
  }, []);

  if (items === null || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>Groups:</Text>
      {items.map(({ id, value }) => (
        <TouchableOpacity
          key={id}
          onPress={() => onPressItem && onPressItem(id, value)}
          style={{
            marginTop: 10,
            borderColor: "#000",
            borderWidth: 1,
            padding: 8,
          }}
        >
          <Text style={colorScheme == 'dark' ? { color: "white", } : { color: "black", }}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}


export default function LibraryWords(all: any) {
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [groupId, setGroupId] = useState(all.route.params.group_id);
  const [groupName, setGroupName] = useState(all.route.params.group_name);


  const [nativeText, setNative] = React.useState(null);
  const [translateText, setTranslate] = React.useState(null);

  let colorScheme = useColorScheme();

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists words (id integer primary key not null, group_id integer, value text);"
      );
    });
  }, []);

  const add = (group_id: number, text: string) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql("insert into words (group_id, value) values (?, ?)", [group_id, text]);
        tx.executeSql("select * from words", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      forceUpdate
    );
  };

  const remove = (id: number) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from words where id = ?;`, [id]);
      },
      null,
      forceUpdate
    );
  };

  let equal =
    (
      (translateText ?? '').split(/\r\n|\r|\n/).length == (nativeText ?? '').split(/\r\n|\r|\n/).length
    ) && (
      (nativeText ?? '').split(/\r\n|\r|\n/).length > 1
    );

  return (
    <View style={[
      styles.container,
      colorScheme == 'dark' ? { backgroundColor: "black", } : { backgroundColor: "white", }
    ]}>

      {/* Header */}
      <View style={styles.flexRow}>
        <View
          style={[
            styles.input,
            { justifyContent: 'center', alignItems: 'center' },
            colorScheme == 'dark' ? { borderColor: "white", } : { borderColor: "black", }
          ]}
        >
          <Text style={[colorScheme == 'dark' ? { color: "white", } : { color: "black", }]}>{groupName}</Text>
        </View>
      </View>
      {/* END: Header */}



      <ScrollView style={[styles.listArea, colorScheme == 'dark' ? { backgroundColor: "#292c34", } : { backgroundColor: "#f0f0f0", }]}>
        <Text style={{ color: 'red' }}>Add words</Text>
        <View style={styles.addWords}>
          {/* Native */}
          <TextInput
            style={[styles.multiInput, ]}
            onChangeText={(text) => setNative(text)}
            onSubmitEditing={() => {
              add(groupId, nativeText ?? '');
              setTranslate(null);
            }}
            placeholder="Native"
            placeholderTextColor={colorScheme == 'dark' ? "white" : "black"}
            value={nativeText}
            multiline={true}
          />
          {/* END: Native */}

          <View style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            margin: 5,
            padding: 5,
          }}>
            <View style={{
              backgroundColor: equal ? "red" : "#F08080",
              padding: 5,
              borderRadius: 4,
            }}>
              <Text style={{ color: 'white' }}>
                {(nativeText ?? '').split(/\r\n|\r|\n/).length - 1} lines
              </Text>
            </View>
          </View>

          <View style={{ width: '100%', backgroundColor: 'red', borderRadius: 1, height: 1, }}></View>

          <View style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            margin: 5,
            padding: 5,
          }}>
            <View style={{
              backgroundColor: equal ? "red" : "#F08080",
              padding: 5,
              borderRadius: 4,
            }}>
              <Text style={{ color: 'white' }}>
                {(translateText ?? '').split(/\r\n|\r|\n/).length - 1} lines
              </Text>
            </View>
          </View>

          {/* Translate */}
          <TextInput
            style={styles.multiInput}
            onChangeText={(text) => setTranslate(text)}
            onSubmitEditing={() => {
              add(groupId, translateText ?? '');
              setTranslate(null);
            }}
            placeholder="Translate"
            placeholderTextColor={colorScheme == 'dark' ? "white" : "black"}
            value={translateText}
            multiline={true}
          />
          {/* END: Translate */}
        </View>

        <View style={{ alignItems: 'flex-end', marginRight: 15 }}>
          <Button
            onPress={() => { console.log(1) }}
            title="Add to Library"
            buttonStyle={{ backgroundColor: "red", }}
            disabled={!equal}
            disabledStyle={{ backgroundColor: "#F08080", }}
            disabledTitleStyle={{ color: 'white' }}

            type='solid'
            accessibilityLabel="Learn more about this purple button"
          />
        </View>

        <Items
          key={`forceupdate-todo-${forceUpdateId}`}
          group_id={groupId}
        />
      </ScrollView>
      {/* END: List */}

    </View>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
  },
  listArea: {
    flex: 1,
    paddingTop: 16,
  },
  input: {
    paddingTop: 10,
    marginBottom: 10,
    borderColor: "red",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  addWords: {
    paddingTop: 10,
    marginBottom: 10,
    borderColor: "red",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    margin: 16,
    padding: 8,
  },
  multiInput: {
    paddingVertical: 10,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    color: "red",
    marginBottom: 8,
  },
});