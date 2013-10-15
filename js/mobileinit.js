/*
OpenCruise - Copyright (C) 2013 James C. Rivard
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/
define(['jquery'], function ($) {
    $(document).bind("mobileinit", function(){
        $.mobile.buttonMarkup.hoverDelay = 50;
        $.mobile.defaultPageTransition = "none";
        $.mobile.defaultDialogTransition = "none";
        $.mobile.autoInitializePage = false;
        //$.mobile.selectmenu.prototype.options.nativeMenu = false;
    });
});