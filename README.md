opencruise
==========

Forest Inventory Software for Mobile Platforms - HTML 5 Web Application

See https://opencruise.mtu.edu for a working version.

Opencruise is a forest inventory web application designed to work on IOS (Apple) and Android mobile computing platforms.
It works offline (i.e. airplane mode) in remote areas where network access is unavailable.
 The primary purpose of Opencruise is to collect forest inventory data, but the software could easily be configured to collect
 regeneration, down dead wood, or other plot level items.  Use of the application requires that the user have some knowledge of forest
 inventory procedures (point/plot sampling, tree identification, diameter/height measurements, etc...).
 
 The default version allows for 4 data variables to be collected per "sample unit", which in generally a tree.
 Users are free to configure the field names/default values via the "Config" button.
 
 The application makes heavy use of HTML5 technologies, including:  offline use,
 local storage, local database and geolocation.  Most modern web browsers will work including:
 
 Chrome (update channel version).
 Firefox (update channel version).
 Safari (on IOS 5+).
 Android Browser (on Android 4+; most older versions work as well).
 Dolphin Browser (on IOS 5+; on Android 2.2.x+; good alternative for older Android devices).
 Internet Explorer V10 should work, but has not been tested.
 
 Browser Configuration:
 1. Most default browser configurations will work.
 2. Incognito Mode (Chrome) or Private Browsing (Safari) will not work since local storage is disabled.
 3. Geolocation services must be enabled for the software to collect lat/long at each plot.
 4. Different browsers treat local storage differently.  Some delete local storage when the cache is cleared
 and others have more specific options.  To be safe, be sure to upload data before clearing the cache.
 
 If you wish to download/modify the software, the following tips are offered:
 
 1. Download all files to a directory on your web server.
 2. Install php (only used for data uploading via gmail).
 3. Enable the serving of compressed files (via gzip).  This is "mod_deflate" for apache web servers.
 
 The code is currently not "minified" due to the relative frequency of updates at this point in time.  Some of
 the files in the repository are not currently used (i.e. js/mainmin.js, js/ocruise-min.js), but are included as a 
 guide for the direction to take when building out a production version.  The js/libs directory includes 3rd party
 libraries used in the project.
 
 After navigating past the intro screen, press the "help" button and navigate to the "coming soon" section for planned updates.
 
 Opencruise is licensed under version 3 of the GNU Public License:  http://www.gnu.org/copyleft/gpl.html