Opencruise V1.2.3b
===============

Forest Inventory Software for Mobile Platforms - HTML 5 Web Application

See https://jcrivard.github.io/opencruise/index.html  (download via email will not work from this site)
or  https://opencruise.mtu.edu for a working version.

Opencruise is a forest inventory web application designed to work on IOS (Apple) and Android mobile computing platforms.  
It works offline (i.e. airplane mode) in remote areas where network access is unavailable.  The primary purpose of Opencruise
 is to collect forest inventory data, but the software could easily be configured to collect regeneration,
 down dead wood, or other plot level items.  Use of the application requires that the user have some knowledge
 of forest inventory procedures (point/plot sampling, tree identification, diameter/height measurements, etc...).
 
The default version allows for 4 data variables to be collected per "sample unit", which is generally a tree.  
Users are free to configure the field names/default values globally via the "Config" button or for each cruise/job
via the "Flds" button.

Multi product mode allows for up to six products per tree to be recorded.  
 
The application makes heavy use of HTML5 technologies, including:  offline use,
 local storage, local database, geolocation and speech input.  

Browser Support: 
* Chrome (update channel version).
* Firefox (update channel version).
* Safari (on IOS 5+). 
* Android Browser (on Android 4+; most older versions work as well).
* Dolphin Browser (on IOS 5+; on Android 2.2.x+).
* Internet Explorer V10+ should work, but has not been tested.

Browser Configuration:
* Most default browser configurations will work.
* Incognito Mode (Chrome) or Private Browsing (Safari) will not work since local storage is disabled.
* Geolocation services must be enabled for the software to collect lat/long at each plot.
* Speech input for tree entry is available for recent versions of Android running Chrome.  See the help section in the app for details.
* Different browsers treat local storage differently.  Some delete local storage when the cache is cleared
and others have more specific options.  To be safe, be sure to upload data before clearing the cache.  Users 
should thoroughly test the software with their preferred browser before using in production. 

Installation Tips (for those wanting to run their own version of the software): 
* Click "Releases" towards the top of the page and download the source code zip file.
* Unzip the file to a directory (ie. opencruise) on your web server.  If you don't need to use email to upload data, and can
tolerate a little slower load time (initially and when the software changes), this is all you need to do.
Just point your web browser to the directory (i.e your.domain.com/opencruise) and run the software.

Additional Installation Tips
* To use the email upload feature:  Check if your web hosting company has "php" installed and if there
is anything you need to do to utilize it.
* Faster software load:  Check if your webhosting company enables the serving of compressed files (via gzip).
This is often an option that must be turned on.  The option may be referred to as "mod_deflate" for apache web servers.

For those who want to modify the software (technical information for your programmer)
* offline-min.manifest, /js/mainmin.js and /js/ocruise-min.js are for production use.
* offline.manifest, /js/main.js, ocruise.js, cruise.js, etc... are for development.  To use the development
files, change the manifest file name in index.html and ocruise.html; change the data-main parameter in 
ocruise.html from mainmin.js to main.js.
* To minify the code for production use, use the closure compiler, currently located at http://closure-compiler.appspot.com
Select either "simple" or "whitespace only" (do not use advanced) and compile the following files:
ocruise.js, database.js. cruiselist.js, cruise.js, plot.js, tree.js, config.js .  Copy/paste the compiled code into
ocruise-min.js and use offline-min.manifest and mainmin.js in the html files.  Closure compiler directives are located
in closureCompilerDirectives.txt.
  
Opencruise is licensed under version 3 of the GNU Public License:  http://www.gnu.org/copyleft/gpl.html