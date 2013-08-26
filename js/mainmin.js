/*
Forest Inventory Data Collection - Jim Rivard, Michigan Technological University, 2012
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
*/
require.config({
  //baseUrl: "/",  //production
  //baseUrl: "/OpenCruiseV3", //testing
  waitSeconds: 180,
  paths: {
    'jquery': 'libs/jquery/jquery-1.8.3.min',
    'mobileinit': 'mobileinit',
    'jquery.mobile': 'libs/jquery.mobile-1.3.1/jquery.mobile-1.3.1.min',
    'knockout': 'libs/knockout/knockout-2.2.1',
    'fastclick': 'libs/fastclick/fastclick',
    'ocruise' : 'ocruise-min'
  },
  shim: {
          'mobileinit': ['jquery'],
          'jquery.mobile': ['jquery','mobileinit'],
          'knockout': ['jquery.mobile'],
          'ocruise': ['knockout','jquery.mobile']
        }
});
require(['knockout', 'jquery.mobile', 'ocruise', 'fastclick' ],
		function(ko){
	         window.ko = ko;
             OCRUISE.init();
        });
