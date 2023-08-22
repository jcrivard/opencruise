# Opencruise Version 2.1.1

> Forest Inventory and Timber Cruising

## Enhancements

1. Added overscroll-behavior: none to prevent accidental refresh of page during plot data entry.
2. Can now delete plots.
3. Added "Quadratic Mean Diameter (QMD)" to statistics and ability to compute plots required to achieve confidence levels for QMD.
4. Statistics - can now express confidence intervals as a value (e.q. 10 ft2/acre) in addition to a percent of the mean.

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
