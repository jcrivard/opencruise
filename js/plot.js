/*
Forest Inventory Data Collection - Jim Rivard, Michigan Technological University, 2012
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/

var OCRUISE = (function (oc) {

	oc.plot = function(plotType, cruiseid, plotnum, defaultSpecies, field2Name, field3Name, field4Name) { //newplot indicates new plot, otherwise editing plot
		var dv = oc.defaultValues;
		this.field1Name = dv.field1.name;
		this.field2Name = field2Name;
		this.field3Name = field3Name;
		this.field4Name = field4Name;
		this.plotnum = plotnum;  //plot number being worked on
		this.trees = ko.observableArray([]);
		this.plotID = ko.observable(plotnum.toString());
		this.cruiseid = cruiseid;
		this.defaultSpecies = defaultSpecies;
		this.lastEditedTree = -1; //indicates the array element in trees for speech input
		this.selectedTree = ko.observable(); //tree being edited when in multiproduct mode
		this.showSaveButton = ko.observable(true);
		this.showUpdateButton = ko.observable(false);
		this.showSpeechButton = ko.observable(false);
		//geolocation object - initialize used struture in case of nonavailability
		this.position = {
				coords: {
					accuracy: null,
					latitude: null,
					longitude: null
				}
		};
		//speech recognition object - only in Chrome right now
		if (('webkitSpeechRecognition' in window)) {
			var thisPlot = this;
 			this.recognition = new webkitSpeechRecognition();
 			this.recognition.onresult = function(event) {thisPlot.speechInputResult(event);};
 			this.showSpeechButton(true);
 		}
	    if (plotType == 'new'){
	    	this.initPlot();  //new plot
	    } else {
	    	this.loadPlot();  //existing plot
	    }
    	
	};
	
	oc.plot.prototype = {
		   initPlot: function(){
		        for (var i=0; i < 10; i++) {
		        	this.trees.push(new oc.tree(this.defaultSpecies,null,null,null,[]));
		        }
				this.updatePosition(); //get current geolocation information
				this.showSaveButton(true);
				this.showUpdateButton(false);
	       },
		   addTree: function () {
	    	    this.trees.push(new oc.tree(this.defaultSpecies,null,null,null,[]));
	    	    $('#plotDetail').trigger('create'); //need to get this moved
		   },
	       loadPlot: function() {
	    	   var thisPlot = this;
	    	   var dv = oc.defaultValues;
		       this.showSaveButton(false);
			   this.showUpdateButton(true);
		       var whereObj = {cruiseid: this.cruiseid, plotnum: this.plotnum}; //for indexedDB
			   var orderbyClause = '';
			   var callbackTrees = function (transaction, results){
                   for (var i=0; i<results.rows.length; i++) { //populate input fields from DB       
                       var row = results.rows.item(i);
                       var segments = [];
                       for (var j=0; j < 6; j++){
                    	   segments.push({product: row['seg' + j + 'prod'], length: row['seg' + j + 'len']});
                       }
                       thisPlot.trees.push(new oc.tree(row[dv.field1.dbName], row[dv.field2.dbName], row[dv.field3.dbName], row[dv.field4.dbName], segments));
                       thisPlot.lastEditedTree ++; //for speech input
                   }
                   if (row) {thisPlot.plotID(row.plotid);}  //in case no plot record, use last one from last tree record
                   $.mobile.changePage('#plotPage',{role: 'dialog'});
               };
               var callbackPlots = function (transaction, results){
	               	thisPlot.position = {coords:{accuracy: null, latitude: null, longitude: null}}; //in case no plot record, do not use stale data
	               	if (results.rows.length > 0) {  //just in case no plot record
	               		var row = results.rows.item(0); //should only be one record
	               		thisPlot.plotID(row.plotid);
	               		thisPlot.position =  {coords:{accuracy: row.accuracy, latitude: row.latitude, longitude: row.longitude}};
	               	}
	               	oc.DB.select('trees', '*', orderbyClause, callbackTrees,'', whereObj); //now get the tree data
               };
               oc.DB.select('plots', '*', orderbyClause, callbackPlots,'', whereObj); //get plot level data
	       },
	       updatePosition: function() {
	    	   var thisCruise = this;
	    	   if (navigator.geolocation){
	    		   navigator.geolocation.getCurrentPosition(
	    				   function(position) {
	    					   thisCruise.position = position;
	    				   },
	    				   function(error){
	    					   var temp=error;//placeholder - no need for error message at this time
	    				   },
	    				   {timeout:50000, maximumAge: 0, enableHighAccuracy: true}
	    		   ); 
	    	   }
	       },
	       speechInputStart: function() {
	    	   $.mobile.loading( 'show', {text: 'Begin Speaking Now', textVisible: true, theme: 'b', html: ""	});
	    	    this.recognition.start();  //start speech input
	       },
	       speechInputResult: function(event) {
				var dv = oc.defaultValues; //shorthand
				var treeRecord, field1Val, field2Val, field3Val, field4Val, transcript;
				var treeArray = this.trees();
				$.mobile.loading( 'hide');
				//transcript should have: field1 field2 - field3 - field4; ie. Hard Maple 12 - 2 - 4
				transcript = event.results[0][0].transcript.replace('Dash','-');
				transcript = transcript.replace('dash','-');
				treeRecord = transcript.split('-');
				if (treeArray[this.lastEditedTree + 1]){ //have an empty tree to work with
					this.lastEditedTree ++; //point to next empty tree slot in DOM
					if (treeRecord[0]) { //field1, field2 have content
						field1Val = treeRecord[0].replace(/[0-9]+/g,''); //remove numbers 
						field1Val = field1Val.replace(/\s+/g,''); //remove spaces; should now have field1 without spaces
						field2Val = treeRecord[0].replace(/[a-zA-Z]+/g,''); //remove alpha
						field2Val = field2Val.replace(/\s+/g,''); //remove spaces; should now have field2
						field1Val = dv.speciesKey.getKey(field1Val.toLowerCase());
				    	if (field1Val) {  //lookup succeeded
				    		treeArray[this.lastEditedTree].field1(field1Val);
				    	}
				    	treeArray[this.lastEditedTree].field2(field2Val);
					}
					if (treeRecord[1]) { //field3 has content
						field3Val = treeRecord[1].replace(/\s+/g,''); //remove spaces
						treeArray[this.lastEditedTree].field3(field3Val);
					}
					if (treeRecord[2]) { //field4 has content
						field4Val = treeRecord[2].replace(/\s+/g,''); //remove spaces
						treeArray[this.lastEditedTree].field4(field4Val);
					}
					//$('#plotDetail select').selectmenu('refresh'); //need to get this moved
				}
		   },
		   //insert new plot record and associated tree records into database
		   insertPlot: function(parent){
				var dv = oc.defaultValues; //shorthand
		        var thisPlot = this;
		        var treeArray = this.trees();
		        var queryArray = [];
		        var position = this.position; //geolocation info
		        var callback = function() {return true;}; 
		        var transCallback = function () {
		        	if (parent) {
		        		parent.plots.push({plotNum: thisPlot.plotnum, plotID: thisPlot.plotID()}); //update plot array for selectedCruise
		        		thisPlot.logMessage('Plot added.');
		        	}
		        	$.mobile.changePage('#cruisePage')
		        ;};
		        var tableName = 'plots';
		        var fieldNames = ['cruiseid', 'plotid', 'plotnum', 'comments', 'covertype', 'accuracy', 'latitude', 'longitude', 'deleted'];
		        queryArray.push([tableName,fieldNames,[this.cruiseid, this.plotID(), this.plotnum,'','', position.coords.accuracy, position.coords.latitude, position.coords.longitude,0]]);
		        tableName = 'trees';
		        fieldNames = ['cruiseid', 'plotid', 'plotnum', 'treenum',
		                      dv.field1.dbName, dv.field2.dbName, dv.field3.dbName, dv.field4.dbName, 'deleted',
		                      'seg0prod', 'seg0len', 'seg1prod', 'seg1len', 'seg2prod', 'seg2len', 'seg3prod', 'seg3len',
		                      'seg4prod', 'seg4len', 'seg5prod', 'seg5len'];
		        for (var tree in treeArray) {
		          if (treeArray[tree].field2() > 0) { //only insert records with field2 (DBH) > 0
		              queryArray.push([tableName,fieldNames,
		                               [this.cruiseid, this.plotID(), this.plotnum, tree,
		                                treeArray[tree].field1(), treeArray[tree].field2(),
		                                treeArray[tree].field3(), treeArray[tree].field4(),0,
		                                treeArray[tree].segments[0].product(), treeArray[tree].segments[0].length(),
		                                treeArray[tree].segments[1].product(), treeArray[tree].segments[1].length(),
		                                treeArray[tree].segments[2].product(), treeArray[tree].segments[2].length(),
		                                treeArray[tree].segments[3].product(), treeArray[tree].segments[3].length(),
		                                treeArray[tree].segments[4].product(), treeArray[tree].segments[4].length(),
		                                treeArray[tree].segments[5].product(), treeArray[tree].segments[5].length()
		                                ]]);
                  }
		        }
		        oc.DB.insert(queryArray,callback,transCallback); //uncomment when done testing
		        /**** Next few lines for STRESS TESTING ***/
		        /*if (confirm("Stress Test?")){
		        	console.log("Running stress test...");
			        for (var i=0; i < 1000; i++) {
			        	oc.DB.insert(queryArray,callback,transCallback);
			        }
			        alert("Stress test done.");
		        }
		        /**** end of STRESS TEST routine  ****/
			},
			//User clicks UPDATE from plot entry screen, delete old plot data, reinsert new plot data
			//This is not the best way to do it - transaction including deletes AND inserts would be better.
			updatePlot: function(parent){
				var thisPlot = this;
				var callback = function() {
					var removedPlot = parent.plots.remove(function(item){
						return item.plotNum == thisPlot.plotnum;
					}); //update plot array for selectedCruise
				};
				var whereObj = {cruiseid: this.cruiseid, plotnum: this.plotnum};
				var queryArray = [['plots',whereObj],['trees',whereObj]];
				oc.DB.deleteRows(queryArray,callback);
                this.insertPlot(parent);
			},
			//User clicks button to enter multiple segments.  Set selectedTree to current object and load segment entry page.
			multiProductEntry: function(thisTree,thisPlot){
				//$.mobile.loading( 'show', {text: 'Loading',	textVisible: true, theme: 'e', html: ""	});
                this.selectedTree(thisTree);
                $.mobile.changePage('#multiProductPage',{role: 'dialog'});
                //setTimeout(function () {$.mobile.changePage('#multiProductPage',{role: 'dialog'});}, 100); //need async timeout to get loading message
			},
			logMessage: function(message){
			    console.log(message);
			}
			
	};

return oc;
}(OCRUISE || {}));