/*
OpenCruise - Copyright (C) 2013 James C. Rivard
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/

var OCRUISE = (function (oc) {

    oc.config = function() { 
        //**************************************************************/
        //** Change this to load/save to multiple localstorage vars ***/
        //**  - only save property values and when loading, only load property values, don't overwrite methods **/
        //*************************************************/
        this.cruiseParms = {
            jobName: 'New Cruise',
            cruisers: 'Michigan Tech FERM',
            date: oc.currentDate(),
            BAF: '10',
            mpm: false,
            field2: {
                name: 'DBH',
                min: '5',
                max: '62',
                init: ''
            },
            field3: {
                name: 'Saw',
                min: '0',
                max: '10',
                init: '',
                field2Min: 11   //field2min - min value for field2 for field3 to be > 0; ie. min DBH of 11 for sawlogs
            },
            field4: {
                name: 'Pulp',
                min: '0',
                max: '12',
                init: ''
            }
        };
        this.speciesKey = {
            species: ko.observableArray([
             {key: 'HM', names: ['hardmaple', 'sugarmaple']},
             {key: 'RM', names: ['redmaple', 'softmaple']},
             {key: 'AS', names: ['aspen']},
             {key: 'RO', names: ['redoak', 'oak','ok']},
             {key: 'BF', names: ['balsamfir']},
             {key: 'YB', names: ['yellowbirch']},
             {key: 'PB', names: ['paperbirch', 'whitebirch']},
             {key: 'BW', names: ['basswood']},
             {key: 'WA', names: ['whiteash']},
             {key: 'BA', names: ['blackash']},
             {key: 'BC', names: ['blackcherry']},
             {key: 'BP', names: ['balsampoplar']},
             {key: 'WP', names: ['whitepine']},
             {key: 'RP', names: ['redpine']},
             {key: 'JP', names: ['jackpine']},
             {key: 'WS', names: ['whitespruce']},
             {key: 'BS', names: ['blackspruce']},
             {key: 'TM', names: ['tamarack']},
             {key: 'WC', names: ['whitecedar', 'cedar']},
             {key: 'EH', names: ['hemlock']},
             {key: 'AE', names: ['elm']},
             {key: 'IW', names: ['ironwood']},
             {key: 'MA', names: ['mountainash']},
             {key: 'SNAG', names: ['snag']}
            ])
        };
        this.defaultSpecies = ko.observable("HM");
        this.field1 =  {
            name: 'Species',
            dbName: 'species'
        };
        this.field2 = {
            dbName: 'dbh'
        };
        this.field3 = {
            dbName: 'sawlogs'
        }; 
        this.field4 = {
            dbName: 'pulpsticks'
        };
        this.gradeKey = {
            grades: ko.observableArray([
             {key: '1'},
             {key: '2'},
             {key: '3'},
             {key: 'Bolt'},
             {key: 'V'},
             {key: 'C'},
             {key: 'Pulp'}
            ])
        };
        this.BAF = [10,20,40,80]; //Not currently used; edit ocruise.html to change
        this.pages = {
             cruiseListPage: '#cruiseListPage',
             cruisePage: '#cruisePage',
             plotPage: '#plotPage'
        };
        //methods
        this.speciesKey.deleteSpecies = function(spcObj, event){
              var removed = this.species.remove(spcObj);
        };
        this.speciesKey.addSpecies = function(spcObj, event) {
              this.species.unshift({key: 'new', names:[]});
              //$('#configPage ul').listview().listview('refresh');
              $('#configPage').trigger("create");
        };
        this.speciesKey.getKey = function(value){
              for(var i=0; i < this.species().length; i++){
                  for (var j=0;j < this.species()[i].names.length; j++) {
                    if(this.species()[i].names[j] == value){
                      return this.species()[i].key;
                    }
                  }
              }
              return null;
        };
        this.speciesKey.toArray = function() {
              var speciesArray = [];
              for (var i=0; i < this.species().length; i++) {
                speciesArray.push(this.species()[i].key);
              }
              return speciesArray;
        };
        this.gradeKey.toArray = function() {
              var gradeArray = [];
              for (var i=0; i < this.grades().length; i++) {
                gradeArray.push(this.grades()[i].key);
              }
              return gradeArray;
        };
        this.gradeKey.deleteGrade = function(grdObj, event){
              var removed = this.grades.remove(grdObj);
        };
        this.gradeKey.addGrade = function(grdObj, event) {
              this.grades.unshift({key: 'new'});
              //$('#configPage ul').listview().listview('refresh');
              $('#configPage').trigger("create");
        };
        this.save = function (data,event) {
             if (data) {              //knockout.js converting number input to string; change back to integer
                 if (data.max) {
                     data.max = parseInt(data.max,10);
                 }  
                 if (data.min) {
                     data.min = parseInt(data.min,10);
                 }
             }
             localStorage['defaults'] = ko.toJSON(this);
        };
        // update this method when adding new configuration properties that need to persist (loaded from localstorage) 
        this.load = function() {
             var LS = JSON.parse(localStorage['defaults']);
             this.speciesKey.species(LS.speciesKey.species);
             if (LS.cruiseParms.hasOwnProperty('mpm')) {  //only load from localstorage if latest properties are present
                 this.cruiseParms = LS.cruiseParms;  
             }
             if (LS.gradeKey) {
                 this.gradeKey.grades(LS.gradeKey.grades); //for migration
             }
             this.defaultSpecies(LS.defaultSpecies);
             //need to find a better way - loop through properties, but check for KO
        };
    };
    oc.webSQLConfig = function(){
        //change to generic database definition so that it can be used elsewhere
        //ie. pull fieldnames from defaultvalues above like with field1-field4
        var dv = oc.defaultValues;
        var webSQLInfo = {
                name: 'CRUISEDB',
                version: '5.0',
                descript: 'CRUISE DB',
                maxsize: 200000,
                tables: [{tableName: 'cruise',
                          fields: [{name: 'cruiseid', type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'},
                                   {name: 'cname', type: 'TEXT NOT NULL'},
                                   {name: 'cpeople', type: 'TEXT NOT NULL'},
                                   {name: 'cdate', type: 'TEXT'},
                                   {name: 'cbaf', type: 'TEXT'},
                                   {name: 'mpm', type: 'INTEGER'},
                                   {name: 'field2name', type: 'TEXT DEFAULT "DBH"'},
                                   {name: 'field3name', type: 'TEXT DEFAULT "Saw"'},
                                   {name: 'field4name', type: 'TEXT DEFAULT "Pulp"'},
                                   {name: 'field2min', type: 'TEXT'},
                                   {name: 'field2max', type: 'TEXT'},
                                   {name: 'field2init', type: 'TEXT'},
                                   {name: 'field3min', type: 'TEXT'},
                                   {name: 'field3max', type: 'TEXT'},
                                   {name: 'field3init', type: 'TEXT'},
                                   {name: 'field3field2min', type: 'TEXT'},
                                   {name: 'field4min', type: 'TEXT'},
                                   {name: 'field4max', type: 'TEXT'},
                                   {name: 'field4init', type: 'TEXT'}
                                  ]
                         },
                         {tableName: 'plots',
                          index: {name: 'cruiseid_idx', fields: 'cruiseid'},
                          fields: [{name: 'id', type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'},
                                   {name: 'cruiseid', type: 'INTEGER NOT NULL'},
                                   {name: 'plotnum', type: 'INTEGER NOT NULL'},
                                   {name: 'plotid', type: 'TEXT NOT NULL'},
                                   {name: 'comments', type: 'TEXT'},
                                   {name: 'covertype', type: 'TEXT'},
                                   {name: 'accuracy', type: 'INTEGER'},
                                   {name: 'latitude', type: 'REAL'},
                                   {name: 'longitude', type: 'REAL'},
                                   {name: 'deleted', type: 'INTEGER'}
                                  ]
                         },
                         {tableName: 'trees',
                          index: {name: 'cruiseid_plotnum_idx', fields: 'cruiseid, plotnum'},
                          fields: [{name: 'treeid', type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'},
                                   {name: 'cruiseid', type: 'INTEGER NOT NULL'},
                                   {name: 'plotnum', type: 'INTEGER NOT NULL'},
                                   {name: 'plotid', type: 'TEXT NOT NULL'},
                                   {name: 'treenum', type: 'INTEGER'},
                                   {name: dv.field1.dbName, type: 'TEXT NOT NULL'},
                                   {name: dv.field2.dbName, type: 'INTEGER NOT NULL'},
                                   {name: dv.field3.dbName, type: 'INTEGER'},
                                   {name: dv.field4.dbName, type: 'INTEGER'},
                                   {name: 'deleted', type: 'INTEGER'},
                                   {name: 'seg0prod', type: 'TEXT'},
                                   {name: 'seg0len', type: 'INTEGER'},
                                   {name: 'seg1prod', type: 'TEXT'},
                                   {name: 'seg1len', type: 'INTEGER'},
                                   {name: 'seg2prod', type: 'TEXT'},
                                   {name: 'seg2len', type: 'INTEGER'},
                                   {name: 'seg3prod', type: 'TEXT'},
                                   {name: 'seg3len', type: 'INTEGER'},
                                   {name: 'seg4prod', type: 'TEXT'},
                                   {name: 'seg4len', type: 'INTEGER'},
                                   {name: 'seg5prod', type: 'TEXT'},
                                   {name: 'seg5len', type: 'INTEGER'}
                                  ]
                         }
                            
                ]
                   
        };
        return webSQLInfo;
    };
    oc.indexedDBConfig = function(){
        var indexedDBInfo = {
                name: 'CRUISEDB',
                version: 2,
                stores: [{storeName: 'cruise',
                          keyPath: 'cruiseid',
                          autoIncrement: true,
                          indexes: [
                             {name: 'cruiseid', fields: 'cruiseid', unique: true}
                          ]
                         },
                         {storeName: 'plots',
                          keyPath: ["cruiseid", "plotnum"],
                          autoIncrement: false,
                          indexes: [
                             {name: 'cruiseid', fields: 'cruiseid', unique: false},
                             {name: 'cruiseidplotnum', fields: ['cruiseid', 'plotnum'], unique: true}
                          ]
                         },
                         {storeName: 'trees',
                          keyPath: ["cruiseid", "plotnum", "treenum"],
                          autoIncrement: false,
                          indexes: [
                             {name: 'cruiseid', fields: 'cruiseid', unique: false},
                             {name: 'cruiseidplotnum', fields: ['cruiseid', 'plotnum'], unique: false}
                          ]
                         }
                ]
        };
        return indexedDBInfo;
    };
    return oc;
}(OCRUISE || {}));