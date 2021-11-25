import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryWords from "./Library/LibraryWords";
import LibraryGroups from "./Library/LibraryGroups";

const Lib = createNativeStackNavigator();

export default function Library() {
  return (
    <Lib.Navigator>
      <Lib.Screen name="LibraryGroups" component={LibraryGroups} options={{ headerShown: false }} />
      <Lib.Screen name="LibraryWords" component={LibraryWords} options={{ headerShown: false }} />
    </Lib.Navigator>
  );
}
