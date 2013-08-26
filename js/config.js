/*
Forest Inventory Data Collection - Jim Rivard, Michigan Technological University, 2012
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
			BAF: '10'
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
			name: ko.observable('Species'),
			dbName: 'species'
		};
		this.field2 = {
			name: ko.observable('DBH'),
			dbName: 'dbh',
			min: 5,
			max: 45,
			initValue: ''
		};
	    this.field3 = {
			name: ko.observable('Saw'),
			dbName: 'sawlogs',
			min: 0,
			max: 10,
			initValue: 0,
			field2Min: 11   //field2min - min value for field2 for field3 to be > 0; ie. min DBH of 11 for sawlogs
		}; 
		this.field4 = {
			name: ko.observable('Pulp'),
			dbName: 'pulpsticks',
			min: 0,
			max: 12,
			initValue: ''
		};
		this.grade = ["W","1","2","3","V"];  //Not used yet
		this.BAF = [10,20,40,80]; //Not currently used; edit index.html to change
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
			 this.cruiseParms.jobName = LS.cruiseParms.jobName;
			 this.cruiseParms.cruisers = LS.cruiseParms.cruisers;
			 this.cruiseParms.BAF = LS.cruiseParms.BAF;
			 this.defaultSpecies(LS.defaultSpecies);
			 this.field1.name(LS.field1.name);
			 this.field2.name(LS.field2.name);
			 this.field3.name(LS.field3.name);
			 this.field4.name(LS.field4.name);
			 this.field2.min = LS.field2.min;
			 this.field2.max = LS.field2.max;
			 this.field3.min = LS.field3.min;
			 this.field3.max = LS.field3.max;
			 this.field4.min = LS.field4.min;
			 this.field4.max = LS.field4.max;
			 //need to find a better way - loop through properties, but check for KO
		};

	};

    return oc;
}(OCRUISE || {}));