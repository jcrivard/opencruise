/*
Forest Inventory Data Collection - Jim Rivard, Michigan Technological University, 2012
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/

var OCRUISE = (function (oc) {

	oc.tree = function(field1, field2, field3, field4) { 
		var dv = oc.defaultValues;
		var field1Array = dv.speciesKey.toArray();
		if (field1Array.indexOf(field1) == -1 ) {
			field1Array.push(field1); //in case user deleted species code via config and later edits plot
		}
		this.field1 = ko.observable(field1);
		this.field2 = ko.observable(field2);
		this.field3 = ko.observable(field3);
		this.field4 = ko.observable(field4);
		this.field1Values = ko.observableArray(field1Array);
	};
	oc.tree.prototype = {
	   //change color of field2, field3, field3 in DOM to red or green
	   //increment lastEditedTree which is used by speech recognition methods
	   validateTree: function(thisObj, event) {
	    	var dv = oc.defaultValues; //shorthand
		    var goodBG = "#088A08";
	    	var badBG = "#FF0000";
	    	var thisElem = event.target;
	    	//field 2 in range?
	    	if ((thisElem.id == 'field2') && ((thisElem.value < dv.field2.min) || (thisElem.value > dv.field2.max)) ) {
	    		$(thisElem).parent().css('background-color', badBG);
	    	}
	    	//field2 too small for field3 value (ie. 5 inch tree with > 0 sawlogs)
	    	else if ((thisElem.id == 'field3') && (thisElem.value > 0) && (thisObj.field2() < dv.field3.field2Min)) {
	    		$(thisElem).parent().css('background-color', badBG);
	    	}
	    	//field 3 in range? (ie. too many sawlogs entered)
	    	else if ((thisElem.id == 'field3') && ((thisElem.value < dv.field3.min) || (thisElem.value > dv.field3.max)) ) {
	    		$(thisElem).parent().css('background-color', badBG);
	    	}
	    	//field 4 in range? (ie. too many pulpsticks entered)
	    	else if ((thisElem.id == 'field4') && ((thisElem.value < dv.field4.min) || (thisElem.value > dv.field4.max)) ) {
	    		$(thisElem).parent().css('background-color', badBG);
	    	}
	    	else {
	    		$(thisElem).parent().css('background-color', goodBG);
	    	}
	   }
	}
	

    return oc;
}(OCRUISE || {}));