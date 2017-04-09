# Opencruise Version 2.0

> Forest Inventory and Timber Cruising

Installation instructions coming soon...

## Major/Breaking Changes

1. Dropped support for IOS.<sup>1</sup>
2. Chrome 57+ or Firefox 52+ required. <sup>2</sup>
3. Removed speech input support. <sup>3</sup>

## Enhancements

1. Completely rewritten, fully responsive user interface.
2. Enhanced statistics section with more options to include/exclude species and adjust confidence levels/intervals.
3. Grading of segments section enhanced for screens > 800 pixels wide (ie. tablets).
4. User customizable BAF values in config section.

### Footnotes

1. Due to Safari on IOS lagging behind in functionality and an assumption that most Foresters would rather take a cheap tablet
into the woods.
2. Due to support for CSS grid.
3. I was hoping that browser support for custom grammars would have been usable by now, but that is not the case.  I may
add this feature back in if the situation changes.

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

