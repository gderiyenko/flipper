import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
} from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SQLite from "expo-sqlite";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => { },
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

function Items({ onPressItem }) {
  const [items, setItems] = React.useState(null);

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from items;`,
        [],
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
            borderColor: "#000",
            borderWidth: 1,
            padding: 8,
          }}
        >
          <Text style={{ color: "#000" }}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const Lib = createNativeStackNavigator();

export default function Library({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <Lib.Navigator>
      <Lib.Screen name="LibraryGroups" component={LibraryGroups} options={{ headerShown: false }} />
      <Lib.Screen name="LibraryWords" component={LibraryWords} options={{ headerShown: false }} />
    </Lib.Navigator>
  );
}

function LibraryGroups({ navigation }: any) {
  const [text, setText] = React.useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  let colorScheme = useColorScheme();

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, value text);"
      );
    });
  }, []);

  const add = (text) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql("insert into items (value) values (?)", [text]);
        tx.executeSql("select * from items", [], (_, { rows }) =>
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
        tx.executeSql(`delete from items where id = ?;`, [id]);
      },
      null,
      forceUpdate
    );
  };

  return (
    <View style={[
      styles.container,
      colorScheme == 'dark' ? { backgroundColor: "black", } : { backgroundColor: "white", }
    ]}>

      <View style={styles.flexRow}>
        <TextInput
          onChangeText={(text) => setText(text)}
          onSubmitEditing={() => {
            add(text);
            setText(null);
          }}
          placeholder="+ Group name"
          placeholderTextColor={colorScheme == 'dark' ? "white" : "black"}
          style={[
            styles.input,
            colorScheme == 'dark' ? { borderColor: "white", } : { borderColor: "black", }
          ]}
          value={text}
        />
      </View>

      {/* List */}
      <ScrollView style={[styles.listArea, colorScheme == 'dark' ? { backgroundColor: "#f0f0f0", } : { backgroundColor: "#f0f0f0", }]}>
        <Items
          key={`forceupdate-todo-${forceUpdateId}`}
          onPressItem={
            (id: number, name: string) => {
              navigation.navigate('LibraryWords', { group_id: id, group_name: name })
              Alert.alert('Group Remove', 'Are you sure to delete the group?', [
                {
                  text: 'Cancel',
                  onPress: () => { },
                  style: 'cancel',
                },
                { text: 'Remove', onPress: () => { remove(id); } },
              ]);
            }
          }
        />
      </ScrollView>
      {/* END: List */}

    </View>
  );
}

function LibraryWords(all: any) {
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [groupId, setGroupId] = useState(all.route.params.group_id);
  const [groupName, setGroupName] = useState(all.route.params.group_name);

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

  return (
    <View style={[
      styles.container,
      colorScheme == 'dark' ? { backgroundColor: "black", } : { backgroundColor: "white", }
    ]}>

      <Text style={{ color: 'red' }}>{groupId}{groupName}</Text>

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
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  input: {
    borderColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
});