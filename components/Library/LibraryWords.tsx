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

export default function LibraryWords(all: any) {
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [groupId, setGroupId] = useState(all.route.params.group_id);
  const [groupName, setGroupName] = useState(all.route.params.group_name);
  const [items, setItems] = useState([]);


  const [nativeText, setNative] = React.useState(null);
  const [translateText, setTranslate] = React.useState(null);

  let colorScheme = useColorScheme();

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists words (id integer primary key not null, group_id integer, native_text text, translate_text text );"
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        "select * from words where group_id = ?;",
        [groupId],
        (_, { rows: { _array } }) => setItems(_array.reverse())
      );
    },
      (err) => { console.log(err) },
      () => { console.log(items) },
    );
  }, []);

  const add = (group_id: number, native_text: string, translate_text: string) => {

    // TODO: is text empty?
    if (native_text === null || translate_text === null) { return false; }
    console.log(group_id, native_text, translate_text);
    db.transaction(
      (tx) => {
        tx.executeSql("insert into words (group_id, native_text, translate_text) values (?, ?, ?)", [group_id, native_text, translate_text]);
        tx.executeSql(
          "select * from words where group_id = ?;",
          [groupId],
          (_, { rows: { _array } }) => setItems(_array.reverse())
        );
      },
      (err) => { console.log(err) },
      () => { forceUpdate; }
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

        {/* Add Words Form */}
        <>
          <Text style={[styles.sectionHeading, { color: "red", }]}>Add words:</Text>
          <View style={styles.addWords}>
            {/* Native */}
            <TextInput
              style={[styles.multiInput, { color: colorScheme == 'dark' ? "white" : "black" }]}
              onChangeText={(text) => setNative(text)}
              placeholder="Native"
              placeholderTextColor={colorScheme == 'dark' ? "white" : "black"}
              value={nativeText}
              multiline={true}
            />

            {/* Separator + Lines Counter */}
            <View style={styles.addWordsLines}>
              <View style={[styles.addWordsLinesCounter, { backgroundColor: equal ? "red" : "#F08080", }]}>
                <Text style={{ color: 'white' }}>
                  {(nativeText ?? '').split(/\r\n|\r|\n/).length - 1} lines
                </Text>
              </View>
            </View>
            <View style={{ width: '100%', backgroundColor: 'red', borderRadius: 1, height: 1, }}></View>
            <View style={styles.addWordsLines}>
              <View style={[styles.addWordsLinesCounter, { backgroundColor: equal ? "red" : "#F08080", }]}>
                <Text style={{ color: 'white' }}>
                  {(translateText ?? '').split(/\r\n|\r|\n/).length - 1} lines
                </Text>
              </View>
            </View>

            {/* Translate */}
            <TextInput
              style={[styles.multiInput, { color: colorScheme == 'dark' ? "white" : "black" }]}
              onChangeText={(text) => setTranslate(text)}
              placeholder="Translate"
              placeholderTextColor={colorScheme == 'dark' ? "white" : "black"}
              value={translateText}
              multiline={true}
            />
          </View>

          {/* Submit */}
          <View style={{ alignItems: 'flex-end', marginRight: 15 }}>
            <Button
              onPress={() => { add(groupId, nativeText ?? "", translateText ?? ""); }}
              title="Add to Library"
              buttonStyle={{ backgroundColor: "red", }}
              disabled={!equal}
              disabledStyle={{ backgroundColor: "#F08080", }}
              disabledTitleStyle={{ color: 'white' }}
              type='solid'
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </>
        {/* End: Add Words Form */}

        {/* List Existing Words */}
        {items.length > 0 ? <Text style={[styles.sectionHeading, { color: colorScheme == 'dark' ? "white" : "black", }]}>List:</Text> : <></>}
        {items.map(({ id, native_text, translate_text }) => (
          <TouchableOpacity
            key={id}
            onPress={() => { }}
            style={[styles.wordItem, { borderColor: colorScheme == 'dark' ? "white" : "black", }]}
          >
            <Text style={{ color: colorScheme == 'dark' ? "white" : "black", }}>{native_text}</Text>
            <View style={{ width: '100%', backgroundColor: 'red', borderRadius: 1, height: 1, }}></View>
            <Text style={{ color: colorScheme == 'dark' ? "white" : "black", }}>{translate_text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* END: List */}

    </View >
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
  addWordsLines: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 5,
    padding: 5,
  },
  addWordsLinesCounter: {
    padding: 5,
    borderRadius: 4,
  },

  multiInput: {
    paddingVertical: 10,
  },

  // Word List
  sectionHeading: {
    marginHorizontal: 16,
    fontSize: 18,
    marginBottom: 8,
  },
  wordItem: {
    paddingTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    margin: 16,
    padding: 8,
  },
});