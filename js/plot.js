/*
OpenCruise - Copyright (C) 2016 James C. Rivard
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/
/*
plot.js - handles plot level function.
*/
var OCRUISE = (function (oc) {

    oc.plot = function (plotType, cruiseid, plotnum, defaultSpecies, field2Name, field3Name, field4Name) { //newplot indicates new plot, otherwise editing plot
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
        this.lastEditedTree = 0; //indicates the array element in trees for speech input
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
        //speech recognition supported - setup recognition object/handlers and activate speech button        
        if (window.SpeechRecognition) {
            var thisPlot = this;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.ocRunning = false;  //user defined property to indicate if speech input is active
            this.recognition.ocSpeciesGrammar = this.buildSpeciesGrammar(oc.defaultValues.speciesKey.species());
            this.recognition.onresult = function (event) {thisPlot.speechInputResult(event); };
            this.recognition.onstart = function () {
                thisPlot.trees()[thisPlot.lastEditedTree].field1Focus(true);
            };
            this.recognition.onend = function () {  //restart if error - ie long pause between entering trees
                if (thisPlot.recognition.ocRunning) {
                    thisPlot.recognition.start();
                }
            };
            this.showSpeechButton(true);
        }
        if (plotType == 'new') {
            this.initPlot();  //new plot
        } else {
            this.loadPlot();  //existing plot
        }
    };
    oc.plot.prototype = {
        initPlot: function () {
            var i;
            for (i = 0; i < 10; i++) {
                this.trees.push(new oc.tree(this.defaultSpecies, null, null, null, []));
            }
            this.updatePosition(); //get current geolocation information
            this.showSaveButton(true);
            this.showUpdateButton(false);
        },
        addTree: function () {
            this.trees.push(new oc.tree(this.defaultSpecies, null, null, null, []));
            $('#plotDetail').trigger('create'); //need to get this moved
        },
        loadPlot: function () {
            var thisPlot = this;
            var dv = oc.defaultValues;
            this.showSaveButton(false);
            this.showUpdateButton(true);
            var whereObj = {cruiseid: this.cruiseid, plotnum: this.plotnum}; //for indexedDB
            var orderbyClause = '';
            var callbackTrees = function (transaction, results) {
                var i, j, row, segments;
                for (i = 0; i < results.rows.length; i++) { //populate input fields from DB       
                    row = results.rows.item(i);
                    segments = [];
                    for (j = 0; j < 6; j++) {
                        segments.push({product: row['seg' + j + 'prod'], length: row['seg' + j + 'len']});
                    }
                    thisPlot.trees.push(new oc.tree(row[dv.field1.dbName], row[dv.field2.dbName], row[dv.field3.dbName], row[dv.field4.dbName], segments));
                    thisPlot.lastEditedTree++; //for speech input
                }
                if (row) { thisPlot.plotID(row.plotid); }  //in case no plot record, use last one from last tree record
                $.mobile.pageContainer.pagecontainer('change', dv.pages.plotPage, {});
            };
            var callbackPlots = function (transaction, results) {
                thisPlot.position = {coords: {accuracy: null, latitude: null, longitude: null}}; //in case no plot record, do not use stale data
                if (results.rows.length > 0) {  //just in case no plot record
                    var row = results.rows.item(0); //should only be one record
                    thisPlot.plotID(row.plotid);
                    thisPlot.position =  {coords: {accuracy: row.accuracy, latitude: row.latitude, longitude: row.longitude} };
                }
                oc.DB.select('trees', '*', orderbyClause, callbackTrees, '', whereObj); //now get the tree data
            };
            oc.DB.select('plots', '*', orderbyClause, callbackPlots, '', whereObj); //get plot level data
        },
        updatePosition: function () {
            var thisCruise = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        thisCruise.position = position;
                    },
                    function (error) {
                        console.log('plot.updatePosition - unable to get current position.');
                    },
                    {timeout: 50000, maximumAge: 0, enableHighAccuracy: true}
                );
            }
        },
        speechInputToggle: function (thisObj, event) {
            var thisBtn = event.target;
            if (this.recognition.ocRunning) {
                this.recognition.ocRunning = false;
                $(thisBtn).css('background-color', '#088A08');
                this.recognition.stop(thisBtn);
            } else {
                this.recognition.ocRunning = true;
                this.recognition.start(thisBtn);  //start speech input
                $(thisBtn).css('background-color', '#FF0000');
            }
        },
        speechInputResult: function (event) {
            if (this.recognition.ocRunning) {   //speech api on android chrome fires result event with cumulative values after input stops.  This ignores that last result
                var dv = oc.defaultValues; //shorthand
                var treeArray = this.trees();
                var currentElemID = $(':focus').attr('id');
                var currentTree = parseInt(currentElemID.substr(4, currentElemID.indexOf('field') - 4), 10);  //need to get tree the user is working with
                var currentField = currentElemID.substr(currentElemID.indexOf('field')); //need to get field the user is working with
                var transcript = event.results[event.resultIndex][0].transcript.replace(/porn/gi, '4').replace(/for/gi, '4').replace(/to/gi, '2').replace(/att/gi, '8').replace(/ate/gi, '8').replace(/sex/gi, '6');  //replace dash with "-" and common misinterpretations
                if (transcript && currentField) { //have content and a field to work in
                    //transcript = transcript.replace(/\s+/g, ''); //remove spaces; should now have field1 without spaces
                    switch (currentField) {
                    case 'field1':
                        var bestMatch = this.getDistanceFromArray(transcript.toLowerCase(), this.recognition.ocSpeciesGrammar, 10);
                        var speciesCode = dv.speciesKey.getKey(bestMatch);
                        if (speciesCode) {  //lookup succeeded set species code
                            treeArray[currentTree].field1(speciesCode);
                            treeArray[currentTree].field2Focus(true);
                        }
                        break;
                    case 'field2':
                        treeArray[currentTree].field2(transcript.replace(/\s+/g, '')); //remove spaces and update observable
                        treeArray[currentTree].field3Focus(true);
                        break;
                    case 'field3':
                        treeArray[currentTree].field3(transcript.replace(/\s+/g, '')); //remove spaces and update observable
                        treeArray[currentTree].field4Focus(true);
                        break;
                    case 'field4':
                        treeArray[currentTree].field4(transcript.replace(/\s+/g, '')); //remove spaces and update observable
                        this.lastEditedTree++; //done with this tree, point to next empty tree slot in DOM
                        treeArray[currentTree + 1].field1Focus(true);
                        break;
                    }
                }
                $('#plotDetail select').selectmenu('refresh'); //need to get this moved
            }
        },
        buildSpeciesGrammar: function(speciesArray) {
            var i, j, grammar = [];
            for (i = 0; i < speciesArray.length; i++) {
                for (j = 0; j < speciesArray[i].names.length; j++) {
                    grammar.push(speciesArray[i].names[j]);
                }
            }
            return grammar;
        },
        //for speech recognition.  Credit to Guy Levy and his code at: flippinawesome.org/2014/03/10/improving-speech-recognition-in-the-browser
        getDistanceFromArray: function (input, grammar, validDistance) {
            var confidenceArray = [],
                len = grammar.length;
            while (len--) {
                confidenceArray[len] = this.levenshteinDistance(grammar[len], input);
            }
            var minDistance = Math.min.apply(Math, confidenceArray);
            if (minDistance <= validDistance)
                return grammar[confidenceArray.indexOf(minDistance)];
            else
                return null;
        },
         // see http://stackoverflow.com/a/11958496
        levenshteinDistance: function (s, t){
            var d = []; //2d matrix
            // Step 1
            var n = s.length;
            var m = t.length;
            if (n === 0) {
                return m;
            }
            if (m === 0) {
                return n;
            }
            var i = n;
            //Create an array of arrays in javascript (a descending loop is quicker)
            for (; i >= 0; i--) {
                d[i] = [];
            }
            // Step 2
            for (i = n; i >= 0; i--) {
                d[i][0] = i;
            }
            var j = m;
            for (; j >= 0; j--) {
                d[0][j] = j;
            }
            // Step 3
            for (i = 1; i <= n; i++) {
                var s_i = s.charAt(i - 1);
                // Step 4
                for (j = 1; j <= m; j++) {
                    //Check the jagged ld total so far
                    if (i === j && d[i][j] > 4) {
                        return n;
                    }
                    var t_j = t.charAt(j - 1);
                    var cost = (s_i === t_j) ? 0 : 1; // Step 5
                    //Calculate the minimum
                    var mi = d[i - 1][j] + 1;
                    var b = d[i][j - 1] + 1;
                    var c = d[i - 1][j - 1] + cost;
                    if (b < mi) {
                        mi = b;
                    }
                    if (c < mi) {
                        mi = c;
                    }
                    d[i][j] = mi; // Step 6
                    //Damerau transposition
                    if (i > 1 && j > 1 && s_i === t.charAt(j - 2) && s.charAt(i - 2) === t_j) {
                        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
                    }
                }
            }
            // Step 7
            return d[n][m];
        },
        //insert new plot record and associated tree records into database
        insertPlot: function (parent) {
            if (this.recognition) {  // check if we are actually using recognition
                this.recognition.ocRunning = false;  //turn off speech input running flag to prevent auto restart
            }
            var dv = oc.defaultValues; //shorthand
            var thisPlot = this;
            var treeArray = this.trees();
            var queryArray = [];
            var position = this.position; //geolocation info
            var callback = function () {return true; };
            var transCallback = function () {
                if (parent) {
                    parent.plots.push({plotNum: thisPlot.plotnum, plotID: thisPlot.plotID()}); //update plot array for selectedCruise
                    thisPlot.logMessage('Plot added.');
                }
                $.mobile.pageContainer.pagecontainer('change', '#cruisePage', {});
            };
            var tableName = 'plots';
            var fieldNames = ['cruiseid', 'plotid', 'plotnum', 'comments', 'covertype', 'accuracy', 'latitude', 'longitude', 'deleted'];
            queryArray.push([tableName, fieldNames, [this.cruiseid, this.plotID(), this.plotnum, '', '', position.coords.accuracy, position.coords.latitude, position.coords.longitude, 0]]);
            tableName = 'trees';
            fieldNames = ['cruiseid', 'plotid', 'plotnum', 'treenum',
                          dv.field1.dbName, dv.field2.dbName, dv.field3.dbName, dv.field4.dbName, 'deleted',
                          'seg0prod', 'seg0len', 'seg1prod', 'seg1len', 'seg2prod', 'seg2len', 'seg3prod', 'seg3len',
                          'seg4prod', 'seg4len', 'seg5prod', 'seg5len'];
            var tree;
            for (tree = 0; tree < treeArray.length; tree++) {
                if (treeArray[tree].field2() > 0) { //only insert records with field2 (DBH) > 0
                    queryArray.push([tableName, fieldNames,
                                   [this.cruiseid, this.plotID(), this.plotnum, tree,
                                    treeArray[tree].field1(), treeArray[tree].field2(),
                                    treeArray[tree].field3(), treeArray[tree].field4(), 0,
                                    treeArray[tree].segments[0].product(), treeArray[tree].segments[0].length(),
                                    treeArray[tree].segments[1].product(), treeArray[tree].segments[1].length(),
                                    treeArray[tree].segments[2].product(), treeArray[tree].segments[2].length(),
                                    treeArray[tree].segments[3].product(), treeArray[tree].segments[3].length(),
                                    treeArray[tree].segments[4].product(), treeArray[tree].segments[4].length(),
                                    treeArray[tree].segments[5].product(), treeArray[tree].segments[5].length()
                                    ]]);
                }
            }
            oc.DB.insert(queryArray, callback, transCallback); //uncomment when done testing
            /**** Next few lines for STRESS TESTING ***/
            /*if (confirm("Stress Test?")){
                console.log("Running stress test...");
                for (var i=0; i < 1000; i++) {
                    oc.DB.insert(queryArray,callback,transCallback);
                }
                alert("Stress test done.");
            }
            **** end of STRESS TEST routine  ****/
        },
        //User clicks UPDATE from plot entry screen, delete old plot data, reinsert new plot data
        //This is not the best way to do it - transaction including deletes AND inserts would be better.
        updatePlot: function (parent) {
            var thisPlot = this;
            var callback = function () {
                var removedPlot = parent.plots.remove(function (item) {
                    return item.plotNum == thisPlot.plotnum;
                }); //update plot array for selectedCruise
            };
            var whereObj = {cruiseid: this.cruiseid, plotnum: this.plotnum};
            var queryArray = [['plots', whereObj], ['trees', whereObj]];
            oc.DB.deleteRows(queryArray, callback);
            this.insertPlot(parent);
        },
        //User clicks button to enter multiple segments.  Set selectedTree to current object and load segment entry page.
        multiProductEntry: function (thisTree, thisPlot) {
            this.selectedTree(thisTree);
            $.mobile.pageContainer.pagecontainer('change', '#multiProductPage', {});
        },
        logMessage: function (message) {
            console.log(message);
        }
    };
    return oc;
}(OCRUISE || {}));