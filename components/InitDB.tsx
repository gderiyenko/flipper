import * as SQLite from "expo-sqlite";

function openDatabase() {
    const db = SQLite.openDatabase("db.db");
    return db;
}

const db = openDatabase();

export default function initDB() {
    db.transaction((tx) => {
        tx.executeSql(
            "create table if not exists words (id integer primary key not null, group_id integer, native_text text, translate_text text );"
        );
    });
    db.transaction((tx) => {
        tx.executeSql(
            "create table if not exists items (id integer primary key not null, value text);"
        );
    });
}