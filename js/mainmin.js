/*
OpenCruise - Copyright (C) 2013 James C. Rivard
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/
require.config({
  waitSeconds: 180,
  paths: {
    'jquery': 'libs/jquery/jquery-1.9.1.min',
    'mobileinit': 'mobileinit',
    'jquery.mobile': 'libs/jquery.mobile-1.4.0/jquery.mobile-1.4.0.min',
    'knockout': 'libs/knockout/knockout-3.0.0',
    'ocruise' : 'ocruise-min'
  },
  shim: {
          'mobileinit': ['jquery'],
          'jquery.mobile': ['jquery','mobileinit'],
          'knockout': ['jquery.mobile'],
          'ocruise': ['knockout','jquery.mobile']
        }
});
require(['knockout', 'jquery.mobile', 'ocruise' ],
        function(ko){
             window.ko = ko;
             OCRUISE.init();
        });
