# Opencruise Version 2.0

> Forest Inventory and Timber Cruising

## Major/Breaking Changes


1. Android, Windows, Linux - Chrome 57+ or Firefox 52+ required. Other browsers may or may not work.<sup>1</sup>
2. IOS - unsupported.<sup>2</sup>
3. Removed Email option for offloading data.
4. Removed speech input support. <sup>3</sup>

## Enhancements

1. Completely rewritten, fully responsive user interface.<sup>4</sup>
2. Enhanced statistics section with more options to include/exclude species and adjust confidence levels/intervals.
3. Grading of segments section enhanced for screens > 800 pixels wide (ie. tablets).
4. User customizable BAF values in config section.

## Installation
Copy the contents of the "dist" folder to your SSL(HTTPS) enabled web server.  You will need SSL to use the app offline
and to get geolocation data for plots.  See the help section for details on additing it to your home screen.

### Footnotes

1. Due to support for CSS grid.
2. Safari 10.1+ should work, but due to removal of email option, you may be unable to offload data.
3. I was hoping that browser support for custom grammars would have been usable by now, but that is not the case.
The feature may be readded if the situation changes.
4. Replaced jquery mobile with custom css, including a modified version of surface from: [https://github.com/mildrenben/surface](https://github.com/mildrenben/surface); removed jquery and knockout.js; added vue.js.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

