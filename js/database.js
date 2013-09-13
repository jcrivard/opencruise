/*
Forest Inventory Data Collection - Jim Rivard, Michigan Technological University, 2013
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/
var OCRUISE = (function (oc) {
	oc.webSQL = function(dbParms, initCallback){
		this.name = dbParms.name;
		this.version = dbParms.version;
		this.tableNames = dbParms.tables;
		this.initDatabase(dbParms, initCallback);
	};
	oc.webSQL.prototype = {
		insert: function(queryArray, callback, transCallback) {
		    //queryArray[i] - [table,[field1,field2,etc...],[value1,value2,etc...]]
		    var thisOBJ = this;
		    var queries = [];
			for (var i=0; i<queryArray.length; i++) {
			    queries[i] = 'INSERT INTO ' + queryArray[i][0] + ' (';
			    var fields = '';
			    var placeholders = '';
				for (var j=0; j<queryArray[i][1].length; j++) {
					fields = fields + queryArray[i][1][j] + ', ';
					placeholders = placeholders + '?, ';
				}
				queries[i] = queries[i] + fields.substring(0, fields.length - 2) + ') VALUES(' + placeholders.substring(0, placeholders.length - 2) + ')';
			}
			this.DB.transaction(
		        function (transaction) {
		            for (i=0; i<queries.length; i++) {
			            transaction.executeSql(queries[i], queryArray[i][2], callback, function(transaction, error) {thisOBJ.errorHandler(transaction, error);});
		            }
		        },
		        function(transaction, error) {thisOBJ.errorHandler(transaction, error);},
		        transCallback
			);
		},
		select: function(table, fields, orderBy, callback, maxField, whereObj){
			var thisOBJ = this;
			var fieldPart = fields;
			if (maxField) {
				fieldPart = 'MAX(' + fields + ') AS ' + maxField; //i.e. MAX(plotnum) as MAXPLOT
			}
			var query = 'SELECT ' + fieldPart + ' FROM ' + table;
			if (whereObj) {
				query += ' WHERE ';
				for (var prop in whereObj){
					query += prop + '=' + whereObj[prop] + ' AND ';
				}
				query = query.substring(0,query.length - 5 ); //remove last ' AND '
			}
			if (orderBy != '') {
				query += ' ORDER BY ' + orderBy;
			}
			query += ';'
			this.DB.transaction(
		       function (transaction) {
	             transaction.executeSql(query, [], callback,
	        		   function(transaction, error) {thisOBJ.errorHandler(transaction, error);}
	             );
		       }
		    );
		},
		update: function(table, fieldObj, whereObj){
			var thisOBJ = this;
			var values = [];
			var query = 'UPDATE ' + table + ' SET';
			for (var prop in fieldObj) {
				query += ' ' + prop + '=?,';
				values.push(fieldObj[prop]);
			}
			query = query.substring(0,query.length -1 ); //remove last comma 
			if (whereObj) {
				query += ' WHERE ';
				for (var prop in whereObj){
					query += prop + '=' + whereObj[prop] + ' AND ';
				}
				query = query.substring(0,query.length - 5 ); //remove last ' AND '
			}
			query += ';'
			this.DB.transaction(
		       function (transaction) {
	             transaction.executeSql(query, values, thisOBJ.nullDataHandler(),
	        		   function(transaction, error) {thisOBJ.errorHandler(transaction, error);}
	             );
		       }
		    );
		},
		deleteRows: function(queryArray, callback) {
		    //queryArray[i] - [table,whereObj]
		    var thisOBJ = this;
		    var queries = [];
		    var whereObj = null;
			for (var i=0; i<queryArray.length; i++) {
			    queries[i] = 'DELETE FROM ' + queryArray[i][0];
			    queries[i] += ' WHERE ';
			    whereObj = queryArray[i][1];
				for (var prop in whereObj){
					queries[i] += prop + '=' + whereObj[prop] + ' AND ';
				}
				queries[i] = queries[i].substring(0,queries[i].length - 5 ) + ';'; //remove last ' AND ', finish with semicolon
			}
			this.DB.transaction(
		        function (transaction) {
		            for (i=0; i<queries.length; i++) {
			            transaction.executeSql(queries[i], [], callback,
			            	function(transaction, error) {thisOBJ.errorHandler(transaction, error);}	
			            );
		            }
		        }
			);
		},
		initDatabase: function(dbParms, initCallback) {
			this.DB = openDatabase(dbParms.name, "", dbParms.descript, dbParms.maxsize);
			if (this.DB) {
				console.log('Database Opened');
			    this.createTables(dbParms, initCallback);
			    this.checkVersion();
			}
			else {
				alert('Cannot open database, try installing and using a different web browser such as Chrome or Firefox.');
			}
		},
		checkVersion: function(){
			var thisOBJ = this;
			if (this.DB.version == '1.0'){
				//upgrade to version 2.0
				this.DB.changeVersion('1.0','2.0',
					function(t){
						t.executeSql('ALTER TABLE cruise ADD COLUMN field2name TEXT DEFAULT "DBH" ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field3name TEXT DEFAULT "Saw" ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field4name TEXT DEFAULT "Pulp" ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field2min TEXT ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field2max TEXT ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field2init TEXT ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field3min TEXT ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field3max TEXT ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field3init TEXT ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field3field2min TEXT ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field4min TEXT ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field4max TEXT ');
						t.executeSql('ALTER TABLE cruise ADD COLUMN field4init TEXT ');
				    },
				    function(transaction, error) {thisOBJ.errorHandler(transaction, error);},
				    function() {thisOBJ.nullDataHandler();}
				);
			}	
		},
		createTables: function(dbParms, initCallback){
			var thisOBJ = this;
			var query = '';
			this.DB.transaction(
		            function (transaction) {
		            	for (var tablenum in dbParms.tables) {
		    				query = '';
		    				query += 'CREATE TABLE IF NOT EXISTS ' + dbParms.tables[tablenum].tableName + '(';
		    				for (var fieldnum in dbParms.tables[tablenum].fields) {
		    					query += dbParms.tables[tablenum].fields[fieldnum].name + ' ' + dbParms.tables[tablenum].fields[fieldnum].type + ', ';
		    				}
		    				query = query.substring(0,query.length - 2 ) + ');';  //strip off last comma and space, append closing
		                    transaction.executeSql(query, [],
		                		function() {thisOBJ.nullDataHandler();},
		                		function(transaction, error) {thisOBJ.errorHandler(transaction, error);}
		                    );
		                    if (dbParms.tables[tablenum].index){
		                    	query = 'CREATE INDEX IF NOT EXISTS ' + dbParms.tables[tablenum].index.name + ' ON ' + dbParms.tables[tablenum].tableName + ' (' + dbParms.tables[tablenum].index.fields + ');';
		                    	transaction.executeSql(query, [],
				                		function() {thisOBJ.nullDataHandler();},
				                		function(transaction, error) {thisOBJ.errorHandler(transaction, error);}
				                );
		                    }
		            	}	                
		            },
		            function(transaction, error) {thisOBJ.errorHandler(transaction, error);},
			        initCallback
		    );
		},
		deleteDatabase: function(){
			var thisOBJ = this;
			var queries = [];
			if (confirm("All data will be erased, are you sure?")) {
				for (var i = 0; i < this.tableNames.length; i++) {
				  queries[i] = 'DROP TABLE IF EXISTS ' + this.tableNames[i].tableName + ';';
				}
				this.DB.transaction(
			        function (transaction) {
			            for (i=0; i<queries.length; i++) {
				            transaction.executeSql(queries[i], [], thisOBJ.nullDataHandler(), function(transaction, error) {thisOBJ.errorHandler(transaction, error);});
			            }
			        },
			        function(transaction, error) {thisOBJ.errorHandler(transaction, error);},
			        function() {window.location.reload(false);}
				);
			}
		},
		nullDataHandler: function(){
		    console.log("SQL Query Succeeded!!!");
		},
		errorHandler: function(transaction, error){
		    console.log('Database Error:  '+error.message+' (Code '+error.code+')');
		    alert('Database Error:  '+error.message+' (Code '+error.code+')' + ' - make sure private browsing is OFF.');
		    return false;
		}
	} //end of protype defs
	//*************************************
	//indexedDB Object
	//*************************************
	oc.indexedDB = function(dbParms, initCallback){
		this.name = dbParms.name;
		this.version = dbParms.version;
		this.initDatabase(dbParms, initCallback);
	};
	oc.indexedDB.prototype = {
		insert: function(queryArray, callback, transCallback) {
		    //queryArray[i] - [table,[field1,field2,etc...],[value1,value2,etc...]]
		    var stores = []; //list of object stores built from queryarray
		    var data = {};
		    for (var i=0; i<queryArray.length; i++) {
		    	stores[i] = queryArray[i][0];
		    }
		    var transaction = this.DB.transaction(this.DB.objectStoreNames, "readwrite");
		    transaction.oncomplete = function(event) {
		    	transCallback(); //will run when all inserts are done
		    };
		    for (var i=0; i<queryArray.length; i++) { //loop through data to insert and issue DB adds
			    var objectStore = transaction.objectStore(stores[i]);
			    for (var j=0; j<queryArray[i][1].length; j++) {
			      data[queryArray[i][1][j]] = queryArray[i][2][j]; //setup key value pairs
			    }
			    var request = objectStore.add(data);
			    data = {}; //reset for next add
			    request.onerror = function(event) {
					  alert("IndexedDB Error.");
					};
			    request.onsuccess = function(event) {
			    	var resultSet = {insertId: event.target.result};
			        callback(null,resultSet); //null is placeholder, resultset is similar to what webSQL returns
			    };
		    }
		},
		select: function(table, fields, orderBy, callback, maxField, whereObj){
			var sortDesc = 'next';  //return records in descending order (default)
			if (maxField) {
				sortDesc = 'prev';
		    }
			//resultset is "same" format as webSQL output; used by callback function in parms
			var resultset = {rows: {
				length:0,
				contents: [],
				item: function(i){
				   return this.contents[i];
				}
			}};  
			var transaction = this.DB.transaction(table, "readonly");
			var objectStore = transaction.objectStore(table);
			var indexObj = {indexName: objectStore.indexNames[0], indexRange: null}; //default index parms
			if (whereObj) {  //have selection criteria in object form
				indexObj = this.buildKeyRange(whereObj);
			}
			var index = objectStore.index(indexObj.indexName);
			index.openCursor(indexObj.indexRange, sortDesc).onsuccess = function(event) {
			//objectStore.openCursor(indexObj.indexRange, sortDesc).onsuccess = function(event) {
				  var cursor = event.target.result;
				  if (cursor) {
				    resultset.rows.length ++;
				    resultset.rows.contents.push(cursor.value);
				    if (maxField) {  //only need 1st record/row
				    	resultset.rows.contents[0][maxField] =  cursor.value[fields];
				    	callback('',resultset);				    
				    }
				    else {
				        cursor['continue']();
				    }
				  }
				  else {
					if (maxField){ //looking for max and there are no records in DB; i.e. 1st plot for a cruise
						resultset.rows.contents[0]={}; //make type object
						resultset.rows.contents[0][maxField] = 0;
						resultset.rows.length = 1;
					}
					callback('',resultset);
				  }
			};

		},
		update: function(table, fieldObj, whereObj){
			for (var prop in whereObj){  //append selection (WHERE) criteria to fields for PUT method of objectstore
				fieldObj[prop] = whereObj[prop];
			}
			var transaction = this.DB.transaction(table, "readwrite");
			var objectStore = transaction.objectStore(table);
			var request = objectStore.put(fieldObj);
			request.onerror = function(event) {
				  alert("IndexedDB Error - error updating cruise parameters.");
			};
			//request.onsuccess = function(event) {
				//$('#cruiseUpdatedPopup').popup( 'open');//assume it worked :-)
		    //};
		},
		deleteRows: function(queryArray, callback) {
		    //queryArray[i] - [table,whereObj]
		    var stores = []; //list of object stores built from queryarray
		    var keyRange = {}; //indicates which records to delete
		    for (var i=0; i<queryArray.length; i++) {
		    	stores[i] = queryArray[i][0];
		    }
		    var transaction = this.DB.transaction(stores, "readwrite");
		    transaction.oncomplete = function(event) {
		    	callback(); //will run when all inserts are done
		    };
		    for (var i=0; i<queryArray.length; i++) { //tried doing with objectstore.delete() without success
			    var objectStore = transaction.objectStore(stores[i]);
			    keyRange = this.buildKeyRange(queryArray[i][1]);
			    var index = objectStore.index(keyRange.indexName);
			    index.openCursor(keyRange.indexRange).onsuccess = function(event) {
					  var cursor = event.target.result;
					  if (cursor) {
						  cursor['delete']();
					      cursor['continue']();
					  }
			    };
		    }
		},
		initDatabase: function(dbParms, initCallback) {
			var thisOBJ = this;
			var request = indexedDB.open(dbParms.name, dbParms.version);
			request.onerror = function(event) {
			  alert("IndexedDB Error - could not open database.");
			};
			request.onsuccess = function(event) {
			  thisOBJ.DB = event.target.result;
			  initCallback();
			  thisOBJ.DB.onerror = function(event) { //generic error handler for all database methods
				  thisOBJ.errorHandler(event); 
			  };
			};
			request.onupgradeneeded = function(event) { //event fired on initial creation of database and at upgrades
				thisOBJ.createTables(event, dbParms);
			};
		},
		createTables: function(event, dbParms){
			this.DB = event.target.result;
			for (var i=0; i < dbParms.stores.length; i++){
				var newStore = this.DB.createObjectStore(dbParms.stores[i].storeName, {keyPath: dbParms.stores[i].keyPath, autoIncrement: dbParms.stores[i].autoIncrement});
				for (var j=0; j < dbParms.stores[i].indexes.length; j++){
					newStore.createIndex(dbParms.stores[i].indexes[j].name, dbParms.stores[i].indexes[j].fields, {unique: dbParms.stores[i].indexes[j].unique});
				}
			}	    
		},
		deleteDatabase: function(){
			if (confirm("All data will be erased, are you sure?")) {
				window.indexedDB.deleteDatabase(this.name);
				window.location.reload(false);
			}
		},
		buildKeyRange: function(whereObj){
			var indexArray = []; //used for compound index; ie. cruiseidplotnum
			var returnObj = {indexName: '', indexRange: null};  
			for (var prop in whereObj) {
				returnObj.indexName += prop;  //build concatenated index; ie. cruiseidplotnum
				indexArray.push(parseInt(whereObj[prop])); //build array of selection criteria; ie. 1,2 = cruiseid 1, plotnum 2
			}
			if(indexArray.length == 1) { //only one index/array entry, convert from array to typeof array element; single key index won't work otherwise
				returnObj.indexRange = IDBKeyRange.only(indexArray[0]);
			}
			else {
			    returnObj.indexRange = IDBKeyRange.only(indexArray);
			}
			return returnObj;
			
		},
		nullDataHandler: function(){
		    console.log("IndexedDB Query Succeeded!!!");
		},
		errorHandler: function(event){
		    console.log('IndexedDB Database Error: '   + event.target.errorCode);
		    return false;
		}
	} //end of protype defs
return oc;
}(OCRUISE || {}));
