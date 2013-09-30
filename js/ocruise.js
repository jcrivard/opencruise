/*
Forest Inventory Data Collection - Jim Rivard, Michigan Technological University, 2012
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/

var OCRUISE = (function (oc) {
	oc.currentDate = function() {
	    var cdate = new Date();
	    return cdate.getMonth()+1 + "/" + cdate.getDate() + "/" + cdate.getFullYear();
	};
	oc.init = function() {
		$(document).ready(function() {
			//setup indexedDB
			window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
			window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	
		    if (!window.openDatabase && !window.indexedDB) {
	            alert('Local Databases are not supported by your browser.');
	        } else{
	        	//generate prompt to ALLOW or DENY geolocation before adding plots - enables it to work later without page refresh
	            if (navigator.geolocation){
	               navigator.geolocation.getCurrentPosition(function(position) {var positionTrue = true;}, function(error){ var temp=error;}, {timeout:50000, maximumAge: 0, enableHighAccuracy: true}); 
	            }
	        	new FastClick(document.body); //to avoid 300ms delay on mobile
	        	oc.defaultValues = new oc.config();
	        	if (localStorage['defaults']) {
	        		oc.defaultValues.load();
	        	}
	        	else {
	        		oc.defaultValues.save();  //save to localstorage
	        	}
	        	var dv = oc.defaultValues;
	        	
	        	var initDBCallback = function () {
	        		oc.activeList = new oc.cruiseList(dv.pages.cruisePage);
	    	        oc.activeList.getCruises();
	    	        //need to bind selectedcruise, selectedplot to pages
	    	        ko.applyBindings(oc.activeList,$('#cruiseListPage')[0]);
	    	        ko.applyBindings(oc.activeList,$('#cruisePage')[0]);
	    	        ko.applyBindings(oc.activeList,$('#emailPage')[0]);
	    	        ko.applyBindings(oc.activeList,$('#fieldsPage')[0]);
	    	        ko.applyBindings(oc.activeList,$('#plotPage')[0]);
	    	        ko.applyBindings(oc.activeList,$('#multiProductPage')[0]);
	    	        ko.applyBindings(oc.defaultValues,$('#configPage')[0]);
	        	}
	        	
	        	if (window.openDatabase) { //use webSQL if available; need to reverse this at some point.
	        		oc.DB = new oc.webSQL(oc.webSQLConfig(), initDBCallback);
	        	}
	        	else {
	        	    oc.DB = new oc.indexedDB(oc.indexedDBConfig(), initDBCallback);
	        	}
			    $(".OCLoading").hide();
			    $.mobile.initializePage();
			    $.mobile.changePage(dv.pages.cruiseListPage); //in case of page refresh, go home
			    //Event Handlers - most events are handled via knockout.js (data-bind attr in index.html)
			    $('#cruisePage').bind( "pagebeforeshow", function(){
			    	$('#selectPlotPopup ul').listview().listview('refresh');
			    	$('#cruisePage').trigger("create");
			    });
			    $('#selectPlotPopup').on( "click", "li a", function () {oc.activeList.selectedCruise().editPlot($(this).data('plotnum')); });
			    //plot page events
			    $('#plotPage').bind( "pagebeforeshow", function(){
			    	$('#plotPage').trigger("create");
			    });
			    //reapply jquery mobile styling which is lost at times
			    $('#fieldsPage').bind( "pagebeforeshow", function(){
			    	$('#fieldsPage').trigger("create");
			    });
			    $('#multiProductPage').bind( "pagebeforeshow", function(){
			    	$('#multiProductPage').trigger("create");
			    	//$("input[type='radio']").checkboxradio("refresh");
			    });
			    $('#emailPage').bind( "pagebeforeshow", function(){
			    	oc.activeList.selectedCruise().exporttoCSV();
			    	$('#emailPage').trigger("create");
			    });
	        }
		
		});
	},
    //need to move to config.js
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
	},
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
		
	}
return oc;
}(OCRUISE || {}));