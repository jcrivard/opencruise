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
             cruisePage: '#cruisePage'
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
        this.load = function() {
             var LS = JSON.parse(localStorage['defaults']);
             this.speciesKey.species(LS.speciesKey.species);
             if (LS.cruiseParms.mpm) {
                 this.cruiseParms = LS.cruiseParms;  //for migration to field config by cruise
             }
             if (LS.gradeKey) {
                 this.gradeKey.grades(LS.gradeKey.grades); //for migration
             }
             this.defaultSpecies(LS.defaultSpecies);
             //need to find a better way - loop through properties, but check for KO
        };
    };
    return oc;
}(OCRUISE || {}));