/*
Forest Inventory Data Collection - Jim Rivard, Michigan Technological University, 2012
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/
var OCRUISE = (function (oc) {

	oc.cruiseList = function(cruisePage){
		var parms = oc.defaultValues.cruiseParms;
		var self = this;
		this.editCruisePage = cruisePage;      //DOM page to open after cruise is selected for editing
		this.cruises = ko.observableArray([]); //arrray of active jobs
		this.selectedCruise = ko.observable(new oc.cruise(0, parms)); //cruise being edited; init for knockout
		this.deleteCruise =  function(cruise){
		    if (confirm("Delete cruise?")) {
		    	var callback = function() {self.logMessage('Cruise deleted.');};
		    	var whereObj = {cruiseid: cruise.cruiseID};
				var queryArray = [['cruise',whereObj],['plots',whereObj],['trees',whereObj]];
				oc.DB.deleteRows(queryArray,callback);
				self.cruises.remove(cruise);
		    }
		};
		this.editCruise = function(cruise){
			self.selectedCruise(cruise);
		    $.mobile.changePage(self.editCruisePage);
		}
	};
	oc.cruiseList.prototype = {
		getCruises: function() { 
		    var thisCL = this;
		    var callback = function(transaction, resultSet) {thisCL.updateListPageDOM(transaction, resultSet);};
		    oc.DB.select('cruise', '*','',callback);
		},
		newCruise: function(data,event){
			var parms = oc.defaultValues.cruiseParms;
			var thisCL = data;
			var transCallback  = function() {thisCL.logMessage('Cruise created.');};
			var callback = function(transaction, resultSet) {
				var newCruise = new oc.cruise(resultSet.insertId, parms);
				thisCL.cruises.push(newCruise);
				thisCL.editCruise(newCruise);
			};
			var queryArray = [['cruise',['cname','cpeople','cdate','cbaf','field2name','field3name','field4name'],[parms.jobName, parms.cruisers, parms.date, parms.BAF, parms.field2.name, parms.field3.name, parms.field4.name]]];
			oc.DB.insert(queryArray,callback,transCallback);	
		},
		deleteDatabase: function() { 
		    oc.DB.deleteDatabase();
		},
		updateListPageDOM: function(transaction, results) {
			var thisCL = this;
		    for (var i=0; i<results.rows.length; i++) {       
		        var row = results.rows.item(i);
		        var parms = {
		        		jobName: row.cname,
		        		date: row.cdate,
		        		cruisers: row.cpeople,
		        		BAF: row.cbaf,
		        		mpm: row.mpm,
		        		field2: {
		        	        name: row.field2name,
		        	        min: row.field2min,
		        	        max: row.field2max,
		        	        init: row.field2init
		                },
		                field3: {
		        	        name: row.field3name,
		        	        min: row.field3min,
		        	        max: row.field3max,
		        	        init: row.field3init,
		        	        field2Min: row.field3field2min
		                },
		                field4: {
		        	        name: row.field4name,
		        	        min: row.field4min,
		        	        max: row.field4max,
		        	        init: row.field4init
		                }
		        };
		        this.cruises.push(new oc.cruise(row.cruiseid, parms));
		    }
		},
		logMessage: function(message){
		    console.log(message);
		}

	}; //End of prototype defs
	

return oc;
}(OCRUISE || {}));
