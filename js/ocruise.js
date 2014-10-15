/*
OpenCruise - Copyright (C) 2013 James C. Rivard
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/
/*
ocruise.js - initialization routine for the application; sets up database, loads list of cruises, and sets up event handlers that are tied to DOM ids.
*/
var OCRUISE = (function (oc) {
    oc.currentDate = function () {
        var cdate = new Date();
        return cdate.getMonth() + 1 + "/" + cdate.getDate() + "/" + cdate.getFullYear();
    };
    oc.init = function () {
        $(document).ready(function () {
            // If new version is available, prompt user for reload
            if (window.applicationCache) {
                window.applicationCache.addEventListener('updateready', function (e) {
                    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                        if (confirm('A new version of OpenCruise is available. Load it now?')) {
                            window.location.reload();
                        }
                    }
                }, false);
            }
            //setup indexedDB
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
            //check for speech recognition support
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
            if (!window.openDatabase && !window.indexedDB) {
                alert('Local Databases are not supported by your browser.');
            } else {
                //generate prompt to ALLOW or DENY geolocation before adding plots - enables it to work later without page refresh
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {var positionTrue = true; }, function (error) { var temp = error; }, {timeout: 50000, maximumAge: 0, enableHighAccuracy: true});
                }
                oc.defaultValues = new oc.config();   //global parameters object
                if (localStorage['defaults']) {               //load global parameters from localstorage if exists
                    oc.defaultValues.load();
                } else {
                    oc.defaultValues.save();                //initial use of app, write global parameters to localstorage
                }
                var dv = oc.defaultValues;
                var initDBCallback = function () {
                    oc.activeList = new oc.cruiseList(dv.pages.cruisePage);
                    oc.activeList.getCruises();
                    //need to bind selectedcruise, selectedplot to pages
                    ko.applyBindings(oc.activeList, $('#cruiseListPage')[0]);
                    ko.applyBindings(oc.activeList, $('#cruisePage')[0]);
                    ko.applyBindings(oc.activeList, $('#emailPage')[0]);
                    ko.applyBindings(oc.activeList, $('#fieldsPage')[0]);
                    ko.applyBindings(oc.activeList, $('#plotPage')[0]);
                    ko.applyBindings(oc.activeList, $('#multiProductPage')[0]);
                    ko.applyBindings(oc.defaultValues, $('#configPage')[0]);
                };
                if (window.openDatabase) { //use webSQL if available; need to reverse this at some point.
                    oc.DB = new oc.webSQL(oc.webSQLConfig(), initDBCallback);
                } else {
                    oc.DB = new oc.indexedDB(oc.indexedDBConfig(), initDBCallback);
                }
                $(".OCLoading").hide();
                $.mobile.initializePage();
                $.mobile.pageContainer.pagecontainer('change', dv.pages.cruiseListPage, {}); // in case of page refresh, go to cruiselist page 
                //Event Handlers - most events are handled via knockout.js data bindings, but these are not;
                 //                         trigger(create) actions are necessary to reapply jquery mobile stying after DOM changes.
                $('#cruisePage').bind("pagebeforeshow", function () {
                    $('#selectPlotPopup ul').listview().listview('refresh');
                    $('#cruiseName').trigger("change"); //workaround for Firefox indexedDB bug failure to create index for new object
                    $('#cruisePage').trigger("create");
                });
                $('#selectPlotPopup').on("click", "li a", function () {oc.activeList.selectedCruise().editPlot($(this).data('plotnum')); });
                $('#plotPage').bind("pagebeforeshow", function () {$('#plotPage').trigger("create"); });
                $('#fieldsPage').bind("pagebeforeshow", function () {$('#fieldsPage').trigger("create"); });
                $('#multiProductPage').bind("pagebeforeshow", function () {$('#multiProductPage').trigger("create"); });
                $('#emailPage').bind("pagebeforeshow", function () {
                    oc.activeList.selectedCruise().exportToCSV();   //build export file when user opens page; should be moved.
                    $('#emailPage').trigger("create");
                });
            }
        });
    };
    return oc;
}(OCRUISE || {}));