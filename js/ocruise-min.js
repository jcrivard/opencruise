var OCRUISE=function(d){d.currentDate=function(){var a=new Date;return a.getMonth()+1+"/"+a.getDate()+"/"+a.getFullYear()};d.init=function(){$(document).ready(function(){window.indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;window.IDBTransaction=window.IDBTransaction||window.webkitIDBTransaction||window.msIDBTransaction;window.IDBKeyRange=window.IDBKeyRange||window.webkitIDBKeyRange||window.msIDBKeyRange;if(window.openDatabase||window.indexedDB){navigator.geolocation&&
navigator.geolocation.getCurrentPosition(function(a){},function(a){},{timeout:5E4,maximumAge:0,enableHighAccuracy:!0});new FastClick(document.body);d.defaultValues=new d.config;localStorage.defaults?d.defaultValues.load():d.defaultValues.save();var a=d.defaultValues,c=function(){d.activeList=new d.cruiseList(a.pages.cruisePage);d.activeList.getCruises();ko.applyBindings(d.activeList,$("#cruiseListPage")[0]);ko.applyBindings(d.activeList,$("#cruisePage")[0]);ko.applyBindings(d.activeList,$("#emailPage")[0]);
ko.applyBindings(d.activeList,$("#fieldsPage")[0]);ko.applyBindings(d.activeList,$("#plotPage")[0]);ko.applyBindings(d.activeList,$("#multiProductPage")[0]);ko.applyBindings(d.defaultValues,$("#configPage")[0])};d.DB=window.openDatabase?new d.webSQL(d.webSQLConfig(),c):new d.indexedDB(d.indexedDBConfig(),c);$(".OCLoading").hide();$.mobile.initializePage();$.mobile.changePage(a.pages.cruiseListPage);$("#cruisePage").bind("pagebeforeshow",function(){$("#selectPlotPopup ul").listview().listview("refresh");
$("#cruiseName").trigger("change");$("#cruisePage").trigger("create")});$("#selectPlotPopup").on("click","li a",function(){d.activeList.selectedCruise().editPlot($(this).data("plotnum"))});$("#plotPage").bind("pagebeforeshow",function(){$("#plotPage").trigger("create")});$("#fieldsPage").bind("pagebeforeshow",function(){$("#fieldsPage").trigger("create")});$("#multiProductPage").bind("pagebeforeshow",function(){$("#multiProductPage").trigger("create")});$("#emailPage").bind("pagebeforeshow",function(){d.activeList.selectedCruise().exporttoCSV();
$("#emailPage").trigger("create")})}else alert("Local Databases are not supported by your browser.")})};d.webSQLConfig=function(){var a=d.defaultValues;return{name:"CRUISEDB",version:"5.0",descript:"CRUISE DB",maxsize:2E5,tables:[{tableName:"cruise",fields:[{name:"cruiseid",type:"INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT"},{name:"cname",type:"TEXT NOT NULL"},{name:"cpeople",type:"TEXT NOT NULL"},{name:"cdate",type:"TEXT"},{name:"cbaf",type:"TEXT"},{name:"mpm",type:"INTEGER"},{name:"field2name",type:'TEXT DEFAULT "DBH"'},
{name:"field3name",type:'TEXT DEFAULT "Saw"'},{name:"field4name",type:'TEXT DEFAULT "Pulp"'},{name:"field2min",type:"TEXT"},{name:"field2max",type:"TEXT"},{name:"field2init",type:"TEXT"},{name:"field3min",type:"TEXT"},{name:"field3max",type:"TEXT"},{name:"field3init",type:"TEXT"},{name:"field3field2min",type:"TEXT"},{name:"field4min",type:"TEXT"},{name:"field4max",type:"TEXT"},{name:"field4init",type:"TEXT"}]},{tableName:"plots",index:{name:"cruiseid_idx",fields:"cruiseid"},fields:[{name:"id",type:"INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT"},
{name:"cruiseid",type:"INTEGER NOT NULL"},{name:"plotnum",type:"INTEGER NOT NULL"},{name:"plotid",type:"TEXT NOT NULL"},{name:"comments",type:"TEXT"},{name:"covertype",type:"TEXT"},{name:"accuracy",type:"INTEGER"},{name:"latitude",type:"REAL"},{name:"longitude",type:"REAL"},{name:"deleted",type:"INTEGER"}]},{tableName:"trees",index:{name:"cruiseid_plotnum_idx",fields:"cruiseid, plotnum"},fields:[{name:"treeid",type:"INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT"},{name:"cruiseid",type:"INTEGER NOT NULL"},
{name:"plotnum",type:"INTEGER NOT NULL"},{name:"plotid",type:"TEXT NOT NULL"},{name:"treenum",type:"INTEGER"},{name:a.field1.dbName,type:"TEXT NOT NULL"},{name:a.field2.dbName,type:"INTEGER NOT NULL"},{name:a.field3.dbName,type:"INTEGER"},{name:a.field4.dbName,type:"INTEGER"},{name:"deleted",type:"INTEGER"},{name:"seg0prod",type:"TEXT"},{name:"seg0len",type:"INTEGER"},{name:"seg1prod",type:"TEXT"},{name:"seg1len",type:"INTEGER"},{name:"seg2prod",type:"TEXT"},{name:"seg2len",type:"INTEGER"},{name:"seg3prod",
type:"TEXT"},{name:"seg3len",type:"INTEGER"},{name:"seg4prod",type:"TEXT"},{name:"seg4len",type:"INTEGER"},{name:"seg5prod",type:"TEXT"},{name:"seg5len",type:"INTEGER"}]}]}};d.indexedDBConfig=function(){return{name:"CRUISEDB",version:2,stores:[{storeName:"cruise",keyPath:"cruiseid",autoIncrement:!0,indexes:[{name:"cruiseid",fields:"cruiseid",unique:!0}]},{storeName:"plots",keyPath:["cruiseid","plotnum"],autoIncrement:!1,indexes:[{name:"cruiseid",fields:"cruiseid",unique:!1},{name:"cruiseidplotnum",
fields:["cruiseid","plotnum"],unique:!0}]},{storeName:"trees",keyPath:["cruiseid","plotnum","treenum"],autoIncrement:!1,indexes:[{name:"cruiseid",fields:"cruiseid",unique:!1},{name:"cruiseidplotnum",fields:["cruiseid","plotnum"],unique:!1}]}]}};return d}(OCRUISE||{});OCRUISE=function(d){d.webSQL=function(a,c){this.name=a.name;this.version=a.version;this.tableNames=a.tables;this.initDatabase(a,c)};d.webSQL.prototype={insert:function(a,c,b){for(var e=this,h=[],f=0;f<a.length;f++){h[f]="INSERT INTO "+a[f][0]+" (";for(var d="",g="",l=0;l<a[f][1].length;l++)d=d+a[f][1][l]+", ",g+="?, ";h[f]=h[f]+d.substring(0,d.length-2)+") VALUES("+g.substring(0,g.length-2)+")"}this.DB.transaction(function(b){for(f=0;f<h.length;f++)b.executeSql(h[f],a[f][2],c,function(a,b){e.errorHandler(a,
b)})},function(a,b){e.errorHandler(a,b)},b)},select:function(a,c,b,e,h,f){var d=this,g=c;h&&(g="MAX("+c+") AS "+h);var l="SELECT "+g+" FROM "+a;if(f){var l=l+" WHERE ",m;for(m in f)l+=m+"="+f[m]+" AND ";l=l.substring(0,l.length-5)}""!=b&&(l+=" ORDER BY "+b);l+=";";this.DB.transaction(function(a){a.executeSql(l,[],e,function(a,e){d.errorHandler(a,e)})})},update:function(a,c,b){var e=this,h=[],f="UPDATE "+a+" SET",d;for(d in c)f+=" "+d+"=?,",h.push(c[d]);f=f.substring(0,f.length-1);if(b){f+=" WHERE ";
for(d in b)f+=d+"="+b[d]+" AND ";f=f.substring(0,f.length-5)}f+=";";this.DB.transaction(function(a){a.executeSql(f,h,e.nullDataHandler(),function(a,b){e.errorHandler(a,b)})})},deleteRows:function(a,c){for(var b=this,e=[],h=null,f=0;f<a.length;f++){e[f]="DELETE FROM "+a[f][0];e[f]+=" WHERE ";var h=a[f][1],d;for(d in h)e[f]+=d+"="+h[d]+" AND ";e[f]=e[f].substring(0,e[f].length-5)+";"}this.DB.transaction(function(a){for(f=0;f<e.length;f++)a.executeSql(e[f],[],c,function(a,e){b.errorHandler(a,e)})})},
initDatabase:function(a,c){(this.DB=openDatabase(a.name,"",a.descript,a.maxsize))?this.checkVersion(a,c):alert("Cannot open database, try installing and using a different web browser such as Chrome or Firefox.")},checkVersion:function(a,c){var b=this;""==this.DB.version?this.DB.changeVersion("",b.version,this.createTables(a,c),function(a,c){b.errorHandler(a,c)},function(){console.log("Database initialized to version: "+b.version)}):"1.0"==this.DB.version?this.DB.changeVersion("1.0","5.0",function(a){a.executeSql("ALTER TABLE cruise ADD COLUMN mpm INTEGER ");
a.executeSql('ALTER TABLE cruise ADD COLUMN field2name TEXT DEFAULT "DBH" ');a.executeSql('ALTER TABLE cruise ADD COLUMN field3name TEXT DEFAULT "Saw" ');a.executeSql('ALTER TABLE cruise ADD COLUMN field4name TEXT DEFAULT "Pulp" ');a.executeSql("ALTER TABLE cruise ADD COLUMN field2min TEXT ");a.executeSql("ALTER TABLE cruise ADD COLUMN field2max TEXT ");a.executeSql("ALTER TABLE cruise ADD COLUMN field2init TEXT ");a.executeSql("ALTER TABLE cruise ADD COLUMN field3min TEXT ");a.executeSql("ALTER TABLE cruise ADD COLUMN field3max TEXT ");
a.executeSql("ALTER TABLE cruise ADD COLUMN field3init TEXT ");a.executeSql("ALTER TABLE cruise ADD COLUMN field3field2min TEXT ");a.executeSql("ALTER TABLE cruise ADD COLUMN field4min TEXT ");a.executeSql("ALTER TABLE cruise ADD COLUMN field4max TEXT ");a.executeSql("ALTER TABLE cruise ADD COLUMN field4init TEXT ");a.executeSql("ALTER TABLE trees ADD COLUMN seg0prod TEXT");a.executeSql("ALTER TABLE trees ADD COLUMN seg0len INTEGER");a.executeSql("ALTER TABLE trees ADD COLUMN seg1prod TEXT");a.executeSql("ALTER TABLE trees ADD COLUMN seg1len INTEGER");
a.executeSql("ALTER TABLE trees ADD COLUMN seg2prod TEXT");a.executeSql("ALTER TABLE trees ADD COLUMN seg2len INTEGER");a.executeSql("ALTER TABLE trees ADD COLUMN seg3prod TEXT");a.executeSql("ALTER TABLE trees ADD COLUMN seg3len INTEGER");a.executeSql("ALTER TABLE trees ADD COLUMN seg4prod TEXT");a.executeSql("ALTER TABLE trees ADD COLUMN seg4len INTEGER");a.executeSql("ALTER TABLE trees ADD COLUMN seg5prod TEXT");a.executeSql("ALTER TABLE trees ADD COLUMN seg5len INTEGER")},function(a,c){b.errorHandler(a,
c)},function(){console.log("Database upgraded from version 1.0 to version: 5.0");c()}):(this.createTables(a,c),console.log("Database Opened, Version: "+this.DB.version))},createTables:function(a,c){var b=this,e="";this.DB.transaction(function(c){for(var f in a.tables){e="";e+="CREATE TABLE IF NOT EXISTS "+a.tables[f].tableName+"(";for(var d in a.tables[f].fields)e+=a.tables[f].fields[d].name+" "+a.tables[f].fields[d].type+", ";e=e.substring(0,e.length-2)+");";c.executeSql(e,[],function(){b.nullDataHandler()},
function(a,c){b.errorHandler(a,c)});a.tables[f].index&&(e="CREATE INDEX IF NOT EXISTS "+a.tables[f].index.name+" ON "+a.tables[f].tableName+" ("+a.tables[f].index.fields+");",c.executeSql(e,[],function(){b.nullDataHandler()},function(a,c){b.errorHandler(a,c)}))}},function(a,c){b.errorHandler(a,c)},c)},deleteDatabase:function(){var a=this,c=[];if(confirm("All data will be erased, are you sure?")){for(var b=0;b<this.tableNames.length;b++)c[b]="DROP TABLE IF EXISTS "+this.tableNames[b].tableName+";";
this.DB.transaction(function(b){for(var d=0;d<c.length;d++)b.executeSql(c[d],[],a.nullDataHandler(),function(b,c){a.errorHandler(b,c)})},function(b,c){a.errorHandler(b,c)},function(){window.location.reload(!1)})}},nullDataHandler:function(){console.log("SQL Query Succeeded!!!")},errorHandler:function(a,c){var b="",e="";c?(b=c.message,e=c.code):a&&(b=a.message,e=a.code);console.log("Database Error: "+b+" (Code "+e+")");alert("Database Error:  "+b+" (Code "+e+") - make sure private browsing is OFF.");
return!1}};d.indexedDB=function(a,c){this.name=a.name;this.version=a.version;this.initDatabase(a,c)};d.indexedDB.prototype={insert:function(a,c,b){for(var e=[],d={},f=0;f<a.length;f++)e[f]=a[f][0];var k=this.DB.transaction(this.DB.objectStoreNames,"readwrite");k.oncomplete=function(a){b()};for(f=0;f<a.length;f++){for(var g=k.objectStore(e[f]),l=0;l<a[f][1].length;l++)d[a[f][1][l]]=a[f][2][l];g=g.add(d);d={};g.onerror=function(a){alert("IndexedDB Error.")};g.onsuccess=function(a){c(null,{insertId:a.target.result})}}},
select:function(a,c,b,e,d,f){b="next";d&&(b="prev");var k={rows:{length:0,contents:[],item:function(a){return this.contents[a]}}};a=this.DB.transaction(a,"readonly").objectStore(a);var g={indexName:a.indexNames[0],indexRange:null};f&&(g=this.buildKeyRange(f));a.index(g.indexName).openCursor(g.indexRange,b).onsuccess=function(a){if(a=a.target.result)if(k.rows.length++,k.rows.contents.push(a.value),d)k.rows.contents[0][d]=a.value[c],e("",k);else a["continue"]();else d&&(k.rows.contents[0]={},k.rows.contents[0][d]=
0,k.rows.length=1),e("",k)}},update:function(a,c,b){for(var e in b)c[e]=b[e];this.DB.transaction(a,"readwrite").objectStore(a).put(c).onerror=function(a){alert("IndexedDB Error - error updating cruise parameters.")}},deleteRows:function(a,c){for(var b=[],e={},d=0;d<a.length;d++)b[d]=a[d][0];var f=this.DB.transaction(b,"readwrite");f.oncomplete=function(a){c()};for(d=0;d<a.length;d++){var k=f.objectStore(b[d]),e=this.buildKeyRange(a[d][1]);k.index(e.indexName).openCursor(e.indexRange).onsuccess=function(a){if(a=
a.target.result)a["delete"](),a["continue"]()}}},initDatabase:function(a,c){var b=this,e=indexedDB.open(a.name,a.version);e.onerror=function(a){alert("IndexedDB Error - could not open database.")};e.onsuccess=function(a){b.DB=a.target.result;c();b.DB.onerror=function(a){b.errorHandler(a)}};e.onupgradeneeded=function(c){b.createTables(c,a)}},createTables:function(a,c){this.DB=a.target.result;for(var b=0;b<c.stores.length;b++)for(var e=this.DB.createObjectStore(c.stores[b].storeName,{keyPath:c.stores[b].keyPath,
autoIncrement:c.stores[b].autoIncrement}),d=0;d<c.stores[b].indexes.length;d++)e.createIndex(c.stores[b].indexes[d].name,c.stores[b].indexes[d].fields,{unique:c.stores[b].indexes[d].unique})},deleteDatabase:function(){confirm("All data will be erased, are you sure?")&&(window.indexedDB.deleteDatabase(this.name),window.location.reload(!1))},buildKeyRange:function(a){var c=[],b={indexName:"",indexRange:null},e;for(e in a)b.indexName+=e,c.push(parseInt(a[e]));b.indexRange=1==c.length?IDBKeyRange.only(c[0]):
IDBKeyRange.only(c);return b},nullDataHandler:function(){console.log("IndexedDB Query Succeeded!!!")},errorHandler:function(a){console.log("IndexedDB Database Error: "+a.target.errorCode);return!1}};return d}(OCRUISE||{});OCRUISE=function(d){d.cruiseList=function(a){var c=d.defaultValues.cruiseParms,b=this;this.editCruisePage=a;this.cruises=ko.observableArray([]);this.selectedCruise=ko.observable(new d.cruise(0,c));this.deleteCruise=function(a){if(confirm("Delete cruise?")){var c={cruiseid:a.cruiseID};d.DB.deleteRows([["cruise",c],["plots",c],["trees",c]],function(){b.logMessage("Cruise deleted.")});b.cruises.remove(a)}};this.editCruise=function(a){b.selectedCruise(a);$.mobile.changePage(b.editCruisePage)}};d.cruiseList.prototype=
{getCruises:function(){var a=this;d.DB.select("cruise","*","",function(c,b){a.updateListPageDOM(c,b)})},newCruise:function(a,c){var b=d.defaultValues.cruiseParms;d.DB.insert([["cruise","cname cpeople cdate cbaf field2name field3name field4name".split(" "),[b.jobName,b.cruisers,b.date,b.BAF,b.field2.name,b.field3.name,b.field4.name]]],function(c,h){var f=new d.cruise(h.insertId,b);a.cruises.push(f);a.editCruise(f)},function(){a.logMessage("Cruise created.")})},deleteDatabase:function(){d.DB.deleteDatabase()},
updateListPageDOM:function(a,c){for(var b=0;b<c.rows.length;b++){var e=c.rows.item(b);this.cruises.push(new d.cruise(e.cruiseid,{jobName:e.cname,date:e.cdate,cruisers:e.cpeople,BAF:e.cbaf,mpm:e.mpm,field2:{name:e.field2name,min:e.field2min,max:e.field2max,init:e.field2init},field3:{name:e.field3name,min:e.field3min,max:e.field3max,init:e.field3init,field2Min:e.field3field2min},field4:{name:e.field4name,min:e.field4min,max:e.field4max,init:e.field4init}}))}},logMessage:function(a){console.log(a)}};
return d}(OCRUISE||{});OCRUISE=function(d){d.cruise=function(a,c){var b=d.defaultValues;this.self=this;this.cruiseName=ko.observable(c.jobName);this.people=ko.observable(c.cruisers);this.BAF=ko.observable(c.BAF);this.date=ko.observable(c.date);this.multiProducts=ko.observable(Boolean(c.mpm));this.field2={name:ko.observable(c.field2.name||b.cruiseParms.field2.name),min:ko.observable(c.field2.min||b.cruiseParms.field2.min),max:ko.observable(c.field2.max||b.cruiseParms.field2.max),init:ko.observable(c.field2.init||b.cruiseParms.field2.init)};
this.field3={name:ko.observable(c.field3.name||b.cruiseParms.field3.name),min:ko.observable(c.field3.min||b.cruiseParms.field3.min),max:ko.observable(c.field3.max||b.cruiseParms.field3.max),init:ko.observable(c.field3.init||b.cruiseParms.field3.init),field2Min:ko.observable(c.field3.field2Min||b.cruiseParms.field3.field2Min)};this.field4={name:ko.observable(c.field4.name||b.cruiseParms.field4.name),min:ko.observable(c.field4.min||b.cruiseParms.field4.min),max:ko.observable(c.field4.max||b.cruiseParms.field4.max),
init:ko.observable(c.field4.init||b.cruiseParms.field4.init)};this.selectedPlot=ko.observable();this.plots=ko.observableArray([]);this.cruiseID=a;this.defaultSpecies=b.defaultSpecies;this.loadPlots();this.field1Values=ko.observableArray(b.speciesKey.toArray());this.showDownloadFileBtn=ko.observable(!1)};d.cruise.prototype={newPlot:function(a,c){$.mobile.loading("show",{text:"Loading",textVisible:!0,theme:"e",html:""});var b=this;d.DB.select("trees","plotnum","",function(a,c){for(var f=1,k=0;k<c.rows.length;k++)f=
c.rows.item(k).MAXPLOT+1,b.selectedPlot(new d.plot("new",b.cruiseID,f,b.defaultSpecies(),b.field2.name(),b.field3.name(),b.field4.name())),$.mobile.changePage("#plotPage",{role:"dialog"})},"MAXPLOT",{cruiseid:b.cruiseID})},updateCruise:function(a,c){var b={cname:this.cruiseName(),cpeople:this.people(),cdate:this.date(),cbaf:this.BAF(),mpm:Number(this.multiProducts()),field2name:this.field2.name(),field2min:this.field2.min(),field2max:this.field2.max(),field2init:this.field2.init(),field3name:this.field3.name(),
field3min:this.field3.min(),field3max:this.field3.max(),field3init:this.field3.init(),field3field2min:this.field3.field2Min(),field4name:this.field4.name(),field4min:this.field4.min(),field4max:this.field4.max(),field4init:this.field4.init()};d.DB.update("cruise",b,{cruiseid:this.cruiseID})},loadPlots:function(){var a=this;d.DB.select("plots","*","plotnum",function(c,b){for(var e=0;e<b.rows.length;e++){var d=b.rows.item(e);a.plots.push({plotNum:d.plotnum,plotID:d.plotid})}},"",{cruiseid:a.cruiseID})},
editPlot:function(a){$.mobile.loading("show",{text:"Loading",textVisible:!0,theme:"e",html:""});this.selectedPlot(new d.plot("edit",this.cruiseID,a,this.defaultSpecies(),this.field2.name(),this.field3.name(),this.field4.name()))},exporttoCSV:function(a,c){var b="",e="",h="",f=this,k={cruiseid:f.cruiseID},g=function(a,c){b=f.buildCSV(a,c);d.DB.select("cruise","*","",l,"",k)},l=function(a,c){var g=d.defaultValues;h=f.buildCSV(a,c);var g=g.field2.dbName+","+g.field3.dbName+","+g.field4.dbName,k=f.field2.name()+
","+f.field3.name()+","+f.field4.name();e=e.replace(g,k);f.csv="sep=,\r\n"+h+b+e;f.setFileDownload()};d.DB.select("trees","*","plotnum",function(a,b){e=f.buildCSV(a,b);d.DB.select("plots","*","plotnum",g,"",k)},"",k)},setFileDownload:function(){var a=!1;window.URL=window.URL||window.webkitURL;if(window.URL&&window.Blob){try{var c=new Blob([this.csv],{type:"text/csv"})}catch(b){console.log("setFileDownload: blobs not supported")}window.URL.createObjectURL&&c?(a=window.URL.createObjectURL(c),$("#downloadFileBtn").attr("href",
a),$("#downloadFileBtn").attr("download",this.cruiseName()+".csv"),this.showDownloadFileBtn(!0),a=!0,console.log("File download supported!")):console.log("File download NOT supported.")}return a},buildCSV:function(a,c){var b="",d;if(0<c.rows.length){d=c.rows.item(c.rows.length-1);for(var h in d)b+=h+",";b=b.substring(0,b.length-1);b+="\r\n"}for(h=0;h<c.rows.length;h++){d=c.rows.item(h);for(var f in d)b+=d[f]+",";b=b.substring(0,b.length-1);b+="\r\n"}return b=b.replace(/null/g,"")},sendEmail:function(){(function(a){return/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(a)})($("#emailTo").val())?
($.mobile.loading("show",{text:"Connecting to server....",textVisible:!0,theme:"b",html:""}),$.ajax({type:"POST",url:"gmail.php",data:{data:this.csv,emailTo:$("#emailTo").val(),emailPW:$("#emailPW").val(),cruiseName:this.cruiseName},success:function(a){$.mobile.loading("hide");$("#emailSentPopup p").html("Results: "+a);$("#emailSentPopup").popup("open")},error:function(a,c,b){$.mobile.loading("hide");$("#emailSentPopup p").html("Error: "+c+" - Make sure you have a network connection.");$("#emailSentPopup").popup("open")},
dataType:"text"})):(alert("Invalid email address"),$.mobile.loading("hide"))}};return d}(OCRUISE||{});OCRUISE=function(d){d.plot=function(a,c,b,e,h,f,k){this.field1Name=d.defaultValues.field1.name;this.field2Name=h;this.field3Name=f;this.field4Name=k;this.plotnum=b;this.trees=ko.observableArray([]);this.plotID=ko.observable(b.toString());this.cruiseid=c;this.defaultSpecies=e;this.lastEditedTree=-1;this.selectedTree=ko.observable();this.showSaveButton=ko.observable(!0);this.showUpdateButton=ko.observable(!1);this.showSpeechButton=ko.observable(!1);this.position={coords:{accuracy:null,latitude:null,
longitude:null}};window.speechRecognition=window.speechRecognition||window.webkitSpeechRecognition||window.mozSpeechRecognition;if(window.speechRecognition){var g=this;this.recognition=new webkitSpeechRecognition;this.recognition.onresult=function(a){g.speechInputResult(a)};this.showSpeechButton(!0)}"new"==a?this.initPlot():this.loadPlot()};d.plot.prototype={initPlot:function(){for(var a=0;10>a;a++)this.trees.push(new d.tree(this.defaultSpecies,null,null,null,[]));this.updatePosition();this.showSaveButton(!0);
this.showUpdateButton(!1)},addTree:function(){this.trees.push(new d.tree(this.defaultSpecies,null,null,null,[]));$("#plotDetail").trigger("create")},loadPlot:function(){var a=this,c=d.defaultValues;this.showSaveButton(!1);this.showUpdateButton(!0);var b={cruiseid:this.cruiseid,plotnum:this.plotnum},e=function(b,e){for(var k=0;k<e.rows.length;k++){for(var g=e.rows.item(k),l=[],m=0;6>m;m++)l.push({product:g["seg"+m+"prod"],length:g["seg"+m+"len"]});a.trees.push(new d.tree(g[c.field1.dbName],g[c.field2.dbName],
g[c.field3.dbName],g[c.field4.dbName],l));a.lastEditedTree++}g&&a.plotID(g.plotid);$.mobile.changePage("#plotPage",{role:"dialog"})};d.DB.select("plots","*","",function(c,f){a.position={coords:{accuracy:null,latitude:null,longitude:null}};if(0<f.rows.length){var k=f.rows.item(0);a.plotID(k.plotid);a.position={coords:{accuracy:k.accuracy,latitude:k.latitude,longitude:k.longitude}}}d.DB.select("trees","*","",e,"",b)},"",b)},updatePosition:function(){var a=this;navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(c){a.position=
c},function(a){},{timeout:5E4,maximumAge:0,enableHighAccuracy:!0})},speechInputStart:function(){$.mobile.loading("show",{text:"Begin Speaking Now",textVisible:!0,theme:"b",html:""});this.recognition.start()},speechInputResult:function(a){var c=d.defaultValues,b,e,h=this.trees();$.mobile.loading("hide");a=a.results[0][0].transcript.replace("Dash","-");a=a.replace("dash","-");a=a.split("-");h[this.lastEditedTree+1]&&(this.lastEditedTree++,a[0]&&(b=a[0].replace(/[0-9]+/g,""),b=b.replace(/\s+/g,""),e=
a[0].replace(/[a-zA-Z]+/g,""),e=e.replace(/\s+/g,""),(b=c.speciesKey.getKey(b.toLowerCase()))&&h[this.lastEditedTree].field1(b),h[this.lastEditedTree].field2(e)),a[1]&&(c=a[1].replace(/\s+/g,""),h[this.lastEditedTree].field3(c)),a[2]&&(c=a[2].replace(/\s+/g,""),h[this.lastEditedTree].field4(c)))},insertPlot:function(a){var c=d.defaultValues,b=this,e=this.trees(),h=[],f=this.position,k="cruiseid plotid plotnum comments covertype accuracy latitude longitude deleted".split(" ");h.push(["plots",k,[this.cruiseid,
this.plotID(),this.plotnum,"","",f.coords.accuracy,f.coords.latitude,f.coords.longitude,0]]);var f="trees",k=["cruiseid","plotid","plotnum","treenum",c.field1.dbName,c.field2.dbName,c.field3.dbName,c.field4.dbName,"deleted","seg0prod","seg0len","seg1prod","seg1len","seg2prod","seg2len","seg3prod","seg3len","seg4prod","seg4len","seg5prod","seg5len"],g;for(g in e)0<e[g].field2()&&h.push([f,k,[this.cruiseid,this.plotID(),this.plotnum,g,e[g].field1(),e[g].field2(),e[g].field3(),e[g].field4(),0,e[g].segments[0].product(),
e[g].segments[0].length(),e[g].segments[1].product(),e[g].segments[1].length(),e[g].segments[2].product(),e[g].segments[2].length(),e[g].segments[3].product(),e[g].segments[3].length(),e[g].segments[4].product(),e[g].segments[4].length(),e[g].segments[5].product(),e[g].segments[5].length()]]);d.DB.insert(h,function(){return!0},function(){a&&(a.plots.push({plotNum:b.plotnum,plotID:b.plotID()}),b.logMessage("Plot added."));$.mobile.changePage("#cruisePage")})},updatePlot:function(a){var c=this,b={cruiseid:this.cruiseid,
plotnum:this.plotnum};d.DB.deleteRows([["plots",b],["trees",b]],function(){a.plots.remove(function(a){return a.plotNum==c.plotnum})});this.insertPlot(a)},multiProductEntry:function(a,c){this.selectedTree(a);$.mobile.changePage("#multiProductPage",{role:"dialog"})},logMessage:function(a){console.log(a)}};return d}(OCRUISE||{});OCRUISE=function(d){d.tree=function(a,c,b,e,h){var f=d.defaultValues,k=f.speciesKey.toArray();-1==k.indexOf(a)&&k.push(a);this.field1=ko.observable(a);this.field2=ko.observable(c);this.field3=ko.observable(b);this.field4=ko.observable(e);this.segments=[];this.grades=ko.observableArray(f.gradeKey.toArray());this.field1Values=ko.observableArray(k);for(a=0;6>a;a++)h[a]?(this.segments.push({id:a,product:ko.observable(h[a].product),length:ko.observable(h[a].length)}),-1==this.grades.indexOf(h[a].product)&&
this.grades.push(h[a].product)):this.segments.push({id:a,product:ko.observable(" "),length:ko.observable(null)})};d.tree.prototype={validateTree:function(a,c){var b=d.activeList.selectedCruise(),e=c.target,h=Number(e.value);"field2"==e.id&&(h<b.field2.min()||h>b.field2.max())?$(e).parent().css("background-color","#FF0000"):"field3"==e.id&&0<h&&Number(a.field2())<b.field3.field2Min()?$(e).parent().css("background-color","#FF0000"):"field3"==e.id&&(h<b.field3.min()||h>b.field3.max())?$(e).parent().css("background-color",
"#FF0000"):"field4"==e.id&&(h<b.field4.min()||h>b.field4.max())?$(e).parent().css("background-color","#FF0000"):$(e).parent().css("background-color","#088A08")}};return d}(OCRUISE||{});OCRUISE=function(d){d.config=function(){this.cruiseParms={jobName:"New Cruise",cruisers:"Michigan Tech FERM",date:d.currentDate(),BAF:"10",mpm:!1,field2:{name:"DBH",min:"5",max:"62",init:""},field3:{name:"Saw",min:"0",max:"10",init:"",field2Min:11},field4:{name:"Pulp",min:"0",max:"12",init:""}};this.speciesKey={species:ko.observableArray([{key:"HM",names:["hardmaple","sugarmaple"]},{key:"RM",names:["redmaple","softmaple"]},{key:"AS",names:["aspen"]},{key:"RO",names:["redoak","oak","ok"]},{key:"BF",
names:["balsamfir"]},{key:"YB",names:["yellowbirch"]},{key:"PB",names:["paperbirch","whitebirch"]},{key:"BW",names:["basswood"]},{key:"WA",names:["whiteash"]},{key:"BA",names:["blackash"]},{key:"BC",names:["blackcherry"]},{key:"BP",names:["balsampoplar"]},{key:"WP",names:["whitepine"]},{key:"RP",names:["redpine"]},{key:"JP",names:["jackpine"]},{key:"WS",names:["whitespruce"]},{key:"BS",names:["blackspruce"]},{key:"TM",names:["tamarack"]},{key:"WC",names:["whitecedar","cedar"]},{key:"EH",names:["hemlock"]},
{key:"AE",names:["elm"]},{key:"IW",names:["ironwood"]},{key:"MA",names:["mountainash"]},{key:"SNAG",names:["snag"]}])};this.defaultSpecies=ko.observable("HM");this.field1={name:"Species",dbName:"species"};this.field2={dbName:"dbh"};this.field3={dbName:"sawlogs"};this.field4={dbName:"pulpsticks"};this.gradeKey={grades:ko.observableArray([{key:"1"},{key:"2"},{key:"3"},{key:"Bolt"},{key:"V"},{key:"C"},{key:"Pulp"}])};this.BAF=[10,20,40,80];this.pages={cruiseListPage:"#cruiseListPage",cruisePage:"#cruisePage"};
this.speciesKey.deleteSpecies=function(a,c){this.species.remove(a)};this.speciesKey.addSpecies=function(a,c){this.species.unshift({key:"new",names:[]});$("#configPage").trigger("create")};this.speciesKey.getKey=function(a){for(var c=0;c<this.species().length;c++)for(var b=0;b<this.species()[c].names.length;b++)if(this.species()[c].names[b]==a)return this.species()[c].key;return null};this.speciesKey.toArray=function(){for(var a=[],c=0;c<this.species().length;c++)a.push(this.species()[c].key);return a};
this.gradeKey.toArray=function(){for(var a=[],c=0;c<this.grades().length;c++)a.push(this.grades()[c].key);return a};this.gradeKey.deleteGrade=function(a,c){this.grades.remove(a)};this.gradeKey.addGrade=function(a,c){this.grades.unshift({key:"new"});$("#configPage").trigger("create")};this.save=function(a,c){a&&(a.max&&(a.max=parseInt(a.max,10)),a.min&&(a.min=parseInt(a.min,10)));localStorage.defaults=ko.toJSON(this)};this.load=function(){var a=JSON.parse(localStorage.defaults);this.speciesKey.species(a.speciesKey.species);
a.cruiseParms.mpm&&(this.cruiseParms=a.cruiseParms);a.gradeKey&&this.gradeKey.grades(a.gradeKey.grades);this.defaultSpecies(a.defaultSpecies)}};return d}(OCRUISE||{});