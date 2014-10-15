/*
OpenCruise - Copyright (C) 2013 James C. Rivard
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/

var OCRUISE = (function (oc) {

    oc.tree = function (field1, field2, field3, field4, inSegments) {
        var dv = oc.defaultValues;
        var field1Array = dv.speciesKey.toArray();
        if (field1Array.indexOf(field1) == -1) {
            field1Array.push(field1); //in case user deleted species code via config and later edits plot
        }
        this.field1 = ko.observable(field1);
        this.field2 = ko.observable(field2);
        this.field3 = ko.observable(field3);
        this.field4 = ko.observable(field4);
        this.field1Focus = ko.observable(false);  //for speech input
        this.field2Focus = ko.observable(false);
        this.field3Focus = ko.observable(false);
        this.field4Focus = ko.observable(false);
        this.segments = []; //for multiproduct mode
        this.grades = ko.observableArray(dv.gradeKey.toArray());
        this.field1Values = ko.observableArray(field1Array);
        var i;
        for (i = 0; i < 6; i++) { //put segment array into observables
            if (inSegments[i]) {
                this.segments.push({id: i, product: ko.observable(inSegments[i].product), length: ko.observable(inSegments[i].length)});  //init 6 multiproduct segments.
                //check if grade in default list; if not, user changed valid grades since tree recorded; add grade to dropdown
                if (this.grades.indexOf(inSegments[i].product) == -1) {
                    this.grades.push(inSegments[i].product);
                }
            } else {
                this.segments.push({id: i, product: ko.observable(" "), length: ko.observable(null)});  //init 6 multiproduct segments.
            }
        }

    };
    oc.tree.prototype = {
        //change color of field2, field3, field3 in DOM to red or green
        //increment lastEditedTree which is used by speech recognition methods
        validateTree: function (thisObj, event) {
            var cruise = oc.activeList.selectedCruise(); //get field min,max, etc... for active cruise
            var goodBG = "#088A08";
            var badBG = "#FF0000";
            var thisElem = event.target;
            var thisValue = Number(thisElem.value);
            if ((thisElem.id.indexOf('field2') > -1) && ((thisValue < cruise.field2.min()) || (thisValue > cruise.field2.max()))) { //field 2 in range?
                $(thisElem).parent().css('background-color', badBG);
            } else if ((thisElem.id.indexOf('field3') > -1) && (thisValue > 0) && (Number(thisObj.field2()) < cruise.field3.field2Min())) { //field2 too small for field3 value (ie. 5 inch tree with > 0 sawlogs)
                $(thisElem).parent().css('background-color', badBG);
            } else if ((thisElem.id.indexOf('field3') > -1) && ((thisValue < cruise.field3.min()) || (thisValue > cruise.field3.max()))) { //field 3 in range? (ie. too many sawlogs entered)
                $(thisElem).parent().css('background-color', badBG);
            } else if ((thisElem.id.indexOf('field4') > -1) && ((thisValue < cruise.field4.min()) || (thisValue > cruise.field4.max()))) { //field 4 in range? (ie. too many pulpsticks entered)
                $(thisElem).parent().css('background-color', badBG);
            } else {
                $(thisElem).parent().css('background-color', goodBG);
            }
        }
    };
    return oc;
}(OCRUISE || {}));