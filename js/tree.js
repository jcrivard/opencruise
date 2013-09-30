/*
Forest Inventory Data Collection - Jim Rivard, Michigan Technological University, 2012
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/

var OCRUISE = (function (oc) {

	oc.tree = function(field1, field2, field3, field4, inSegments) { 
		var dv = oc.defaultValues;
		var field1Array = dv.speciesKey.toArray();
		if (field1Array.indexOf(field1) == -1 ) {
			field1Array.push(field1); //in case user deleted species code via config and later edits plot
		}
		this.field1 = ko.observable(field1);
		this.field2 = ko.observable(field2);
		this.field3 = ko.observable(field3);
		this.field4 = ko.observable(field4);
		this.segments = []; //for multiproduct mode
		this.grades = ko.observableArray(dv.gradeKey.toArray());
		this.field1Values = ko.observableArray(field1Array);
		for (var i=0; i < 6; i++) { //put segment array into observables
			if (inSegments[i]){
	        	this.segments.push({id: i, product: ko.observable(inSegments[i].product), length: ko.observable(inSegments[i].length)});  //init 6 multiproduct segments.
	        	//check if grade in default list; if not, user changed valid grades since tree recorded; add grade to dropdown
	        	if (this.grades.indexOf(inSegments[i].product) == -1) {
	        		this.grades.push(inSegments[i].product);
	        	}
			}
			else {
				this.segments.push({id: i, product: ko.observable(" "), length: ko.observable(null)});  //init 6 multiproduct segments.
			}
        }

	};
	oc.tree.prototype = {
	   //change color of field2, field3, field3 in DOM to red or green
	   //increment lastEditedTree which is used by speech recognition methods
	   validateTree: function(thisObj, event) {
	    	var cruise = oc.activeList.selectedCruise(); //get field min,max, etc... for active cruise
		    var goodBG = "#088A08";
	    	var badBG = "#FF0000";
	    	var thisElem = event.target;
	    	var thisValue = Number(thisElem.value);
	    	//field 2 in range?
	    	if ((thisElem.id == 'field2') && ((thisValue < cruise.field2.min()) || (thisValue > cruise.field2.max())) ) {
	    		$(thisElem).parent().css('background-color', badBG);
	    	}
	    	//field2 too small for field3 value (ie. 5 inch tree with > 0 sawlogs)
	    	else if ((thisElem.id == 'field3') && (thisValue > 0) && (Number(thisObj.field2()) < cruise.field3.field2Min())) {
	    		$(thisElem).parent().css('background-color', badBG);
	    	}
	    	//field 3 in range? (ie. too many sawlogs entered)
	    	else if ((thisElem.id == 'field3') && ((thisValue < cruise.field3.min()) || (thisValue > cruise.field3.max())) ) {
	    		$(thisElem).parent().css('background-color', badBG);
	    	}
	    	//field 4 in range? (ie. too many pulpsticks entered)
	    	else if ((thisElem.id == 'field4') && ((thisValue < cruise.field4.min()) || (thisValue > cruise.field4.max())) ) {
	    		$(thisElem).parent().css('background-color', badBG);
	    	}
	    	else {
	    		$(thisElem).parent().css('background-color', goodBG);
	    	}
	   }
	}
	

    return oc;
}(OCRUISE || {}));