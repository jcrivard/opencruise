/* eslint-disable */
import { DBPARMS } from '../models/config';

var DatabaseService = function () {
    this.DB = null;
};
DatabaseService.prototype = {
    open: function () {
        var promise = new Promise((resolve, reject) => {
            var request = indexedDB.open(DBPARMS.name, DBPARMS.version);
            request.onerror = (event) => {
                reject('IndexedDB Error - could not open database.');
            };
            request.onsuccess = (event) => {
                this.DB = event.target.result;
                console.log('Database Opened: ' + DBPARMS.name + ', Version: ' + DBPARMS.version);
                resolve(event.target.result);
            };
            request.onupgradeneeded = (event) => { //event fired on initial creation of database and at upgrades
                this.createTables(event, DBPARMS);
            };
        });
        return promise;
    },
    insert: function (store, data) {
        var promise = new Promise((resolve, reject) => {
            var results = [];
            var stores = []; //list of object stores built from queryarray
            var transaction = this.DB.transaction([store], 'readwrite');
            transaction.onerror = (event) => {
                reject('Error write to indexedDB store: ' + store);
            };
            transaction.oncomplete = (event) => {
                resolve(results);
            };
            var objectStore = transaction.objectStore(store);
            data.map(function(item) {
                var request = objectStore.add(item);
                request.onerror = (event) => {
                    reject('Error write to indexedDB store: ' + store);
                };
                request.onsuccess = (event) => {
                    var resultSet = {insertId: event.target.result};
                    results.push(resultSet); //add results to return data array
                };
            });
        });
        return promise;
    },
    select: function (table, maxField, orderBy, keyVal) {
        var promise = new Promise((resolve, reject) => {
            var sortDesc = orderBy ? 'next' : 'prev';  //if anything 'true' in orderBy, change sort order
            var results = []; //return array of objects
            var transaction = this.DB.transaction(table, 'readonly');
            transaction.onerror = (event) => {
                reject('Error getting date for store: ' + table);
            };
            var objectStore = transaction.objectStore(table);
            var indexObj = null; //select all items in store
            if (keyVal) {  //have selection keyVal in object form
                indexObj = IDBKeyRange.only(keyVal);
            }
            objectStore.openCursor(indexObj, sortDesc).onsuccess = (event) => {
                var cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    if (maxField) {  //only need 1st record/row
                        resolve(results);
                    } else {
                        cursor['continue']();
                    }
                } else { //no records found
                    if (maxField) {
                            results[0] = {[maxField]: 0}; //return zero as max value
                    }
                    resolve(results);
                }
            };
        });
        return promise;
    },
    update: function (table, data, keyVal) {
        var promise = new Promise((resolve, reject) => {
            var transaction = this.DB.transaction(table, 'readwrite');
            var objectStore = transaction.objectStore(table);
            var request = objectStore.put(data);
            request.onerror = (event) => {
                reject('IndexedDB Error - error updating cruise parameters.');
            };
            request.onsuccess = (event) => {
                resolve(event);
            };
        });
        return promise;
    },
    deleteItem: function (store, keyVal) {
        var promise = new Promise((resolve, reject) => {
            var request = this.DB.transaction(store, 'readwrite').objectStore(store).delete(keyVal);
            request.onerror = (event) => {
                reject('IndexedDB Error - Unable to delete item from database');
            };
            request.onsuccess = (event) => {
                resolve(event);
            };
        });
        return promise;
    },
    createTables: function (event, dbparms) {
        this.DB = event.target.result;
        for (var i = 0; i < dbparms.stores.length; i++) {
            if (!this.DB.objectStoreNames.contains(dbparms.stores[i].storeName)) { //create if not exists
                var newStore = this.DB.createObjectStore(dbparms.stores[i].storeName, {keyPath: dbparms.stores[i].keyPath, autoIncrement: dbparms.stores[i].autoIncrement});
                for (var j = 0; j < dbparms.stores[i].indexes.length; j++) {
                    newStore.createIndex(dbparms.stores[i].indexes[j].name, dbparms.stores[i].indexes[j].fields, {unique: dbparms.stores[i].indexes[j].unique})
                }
            }
        }
        if (event.oldVersion === 2) { //clean up old stores
            this.DB.deleteObjectStore('plots');
            this.DB.deleteObjectStore('trees');
        }
    },
    deleteDatabase: function () {
        if (confirm('All data will be erased, are you sure?')) {
            window.indexedDB.deleteDatabase(DBPARMS.name);
            window.location.reload(false);
        }
    }
}
export { DatabaseService };
