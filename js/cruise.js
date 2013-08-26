/*
Forest Inventory Data Collection - Jim Rivard, Michigan Technological University, 2012
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/

var OCRUISE = (function (oc) {

	oc.cruise = function(id, cname, cdate, cpeople, cbaf) {
		var dv = oc.defaultValues;
		this.self = this;
		this.cruiseName = ko.observable(cname);
		this.people = ko.observable(cpeople);
		this.BAF = ko.observable(cbaf);
		this.date = ko.observable(cdate);
		this.selectedPlot = ko.observable(); //plot being edited; init for knockout 
		this.plots = ko.observableArray([]);
		this.cruiseID = id;
		this.defaultSpecies = dv.defaultSpecies;
		this.loadPlots(); //load current plotlist into plots array
		this.field1Values = ko.observableArray(dv.speciesKey.toArray()); //need to fix to update with changes
	};
	
	oc.cruise.prototype = {		
			//build new plot page - need next plot id and prepopulate page with tree records
			newPlot: function(data,event) {
				$.mobile.loading( 'show', {text: 'Loading',	textVisible: true, theme: 'e', html: ""	});
				var thisCruise = this;
			    var whereObj = {cruiseid: thisCruise.cruiseID}; 
			    var callback = function (transaction, results) {
			    	var newPlotNum = 1; //in case no plots in database
                    for (var i=0; i<results.rows.length; i++) {       
                        var row = results.rows.item(i);
                        newPlotNum = row.MAXPLOT + 1;
                        thisCruise.selectedPlot(new oc.plot('new', thisCruise.cruiseID, newPlotNum, thisCruise.defaultSpecies()));
                        $.mobile.changePage('#plotPage',{role: 'dialog'});
                    }
                };
                //need to eventually use plots table; trees is used since plots table was added later in development; may result in error if plot with no trees is saved
                //oc.DB.select('trees', 'MAX(plotnum) AS MAXPLOT', whereClause, '', callback);
                oc.DB.select('trees', 'plotnum', '', callback, 'MAXPLOT', whereObj);
			},
			//update cruise table when user clicks SAVE in upper right of cruise page
			updateCruise: function(data,event){
				//var thisCruise = data.selectedCruise();
				var thisCruise = this;
				var fieldObj = {cname: thisCruise.cruiseName(), cpeople: thisCruise.people(), cdate: thisCruise.date(), cbaf: thisCruise.BAF()};
				var whereObj = {cruiseid: thisCruise.cruiseID}; 
			    oc.DB.update('cruise', fieldObj, whereObj);
			    //$('#cruiseUpdatedPopup').popup( 'open');//assume it worked :-)
			},
			loadPlots: function(){
				var thisCruise = this;
				var whereObj = {cruiseid: thisCruise.cruiseID}; 
				var orderbyClause = 'plotnum';
				var callback = function(transaction, results){
		           for (var i=0; i<results.rows.length; i++) {       
		               var row = results.rows.item(i);
		               thisCruise.plots.push({plotNum: row.plotnum, plotID: row.plotid});
		           }
		        };
				oc.DB.select('plots', '*', orderbyClause, callback, '', whereObj);
			},
			//User clicks a plot in the plot list popup; build plot page and show
		    //A series of two chained callbacks is used to 1st get plot level data, and 2nd to get tree data for that plot
			editPlot: function(plotnum){
				$.mobile.loading( 'show', {text: 'Loading',	textVisible: true, theme: 'e', html: ""	});
				this.selectedPlot(new oc.plot('edit', this.cruiseID, plotnum, this.defaultSpecies()));	
			},
			//EXPORTTOCSV - runs 3 chained, async DB calls (trees,plots,cruise), invokes method to build CSV for each DB Call,
			//              When all 3 calls are done, the method to send email is invoked
			exporttoCSV: function(data,event) {
				var csv = {
		           plots: '',
		           trees: '',
		           cruise: ''
			    };
				$.mobile.loading( 'show', {	text: 'Connecting to server....', textVisible: true, theme: 'b', html: '' });
			    function validateEmail(email) {
				    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				    return emailReg.test( email );
				}
				var thisCruise = data.selectedCruise();
				var whereObj = {cruiseid: thisCruise.cruiseID}; 
			    var orderbyClause = 'plotnum';
			    var callbackTrees = function(transaction, results){
			    	  csv.trees = thisCruise.buildCSV(transaction,results);
			    	  oc.DB.select('plots', '*', orderbyClause, callbackPlots, '', whereObj);
				};
				var callbackPlots = function(transaction, results){
			    	  csv.plots = thisCruise.buildCSV(transaction,results);
			    	  oc.DB.select('cruise', '*', '', callbackCruise, '', whereObj);
                };
                var callbackCruise = function(transaction, results){
			    	  csv.cruise = thisCruise.buildCSV(transaction,results);
			    	  thisCruise.sendEmail(csv); //done with all 3 DB calls, send the email
                };
			    if (validateEmail($('#emailTo').val())) {
			      oc.DB.select('trees', '*', orderbyClause, callbackTrees, '', whereObj); //start the 1st database call
			    }
			    else {
			        alert('Invalid email address');
			        $.mobile.loading( 'hide');
			    }
			},
			buildCSV: function(transaction, results) {
				var data = '';
				var row;
				//build headings from 1st record
				if (results.rows.length > 0) {
					row = results.rows.item(0);
				    for (var label in row) {
				    	data += label + ',';
				    }
				    data = data.substring(0,data.length -1 ); //remove last comma
				    data += '\r\n';
				}
			    for (var i=0; i<results.rows.length; i++) {
			        row = results.rows.item(i);
			        for (var column in row) {
			        	  data += row[column] + ',';
			        }
			        data = data.substring(0,data.length -1 ); //remove last comma
			    	data += '\r\n';
			    }
			    return data;
			},
			sendEmail: function(csvObj) {
				var dv = oc.defaultValues;
				//update user modifiable field names, currently global parms
				var oldFieldNames = dv.field1.dbName + ',' + dv.field2.dbName + ',' + dv.field3.dbName + ',' + dv.field4.dbName;
				var newFieldNames = dv.field1.name() + ',' + dv.field2.name() + ',' + dv.field3.name() + ',' + dv.field4.name();
				csvObj.trees = csvObj.trees.replace(oldFieldNames, newFieldNames);
				var data = 'sep=,\r\n' + csvObj.cruise + csvObj.plots + csvObj.trees; //send as one attachment for now
		        $.ajax({
		              type: 'POST',
		              url: 'gmail.php',
		              data: { data: data, emailTo: $('#emailTo').val(), emailPW: $('#emailPW').val(), cruiseName: this.cruiseName },
		              success: function(results) {
		            	      $.mobile.loading( 'hide');
		            	      $( "#emailSentPopup p" ).html( "Results: " + results);
		            	      $( "#emailSentPopup" ).popup( "open");
		            	  },
		              error: function(jqXHR, textStatus, errorThrown) {
		            		  $.mobile.loading( 'hide');
		                      $( "#emailSentPopup p" ).html( "Error: " + textStatus + " - Make sure you have a network connection.");
			            	  $( "#emailSentPopup" ).popup( "open");
		            	  },
		              dataType: 'text'
		         });
			    
			}
			
	};

return oc;
}(OCRUISE || {}));