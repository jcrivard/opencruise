opencruise
==========

Forest Inventory Software for Mobile Platforms - HTML 5 Web Application

See https://opencruise.mtu.edu for a working version.

Opencruise is a web application designed to work offline in remote areas.
 It's primary purpose is to collect forest inventory data, but could easily be modified to collect
 regeneration, down dead wood, or other items.  Use of the application requires that the user have some knowledge of forest
 inventory procedures (point/plot sampling, tree identification, diameter/height measurements, etc...).
 
 The default version allows for 4 data variables to be collected per "sample unit", which in generally a tree.
 Users are free to configure the field names/default values via the "Config" button.
 
 If you wish to download/modify the software, the following tips are offered:
 
 1. Download all files to a directory on your web server.
 2. Install php (only used for data uploading via gmail).
 3. Enable the serving of compressed files (via gzip).  This is "mod_deflate" for apache web servers.
 
 The code is currently not "minified" due to the relative frequency of updates at this point in time.  Some of
 the files in the repository are not currently used (i.e. js/mainmin.js, js/ocruise-min.js), but are included as a 
 guide for the direction to take when building out a production version.  The js/libs directory includes 3rd party
 libraries used in the project.
 
 Press the "help" button and navigate to the "coming soon" section for planned updates.