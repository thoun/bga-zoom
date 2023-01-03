# Links
[Documentation](https://thoun.github.io/bga-zoom/docs/index.html)

[Demo](https://thoun.github.io/bga-zoom/demo/index.html)

# Concept
Allow to zoom in and out of a div element (for example your game table).  
It will wrap your div element to allow scaling, and it will adjust automatically on resize (of the window or the div).  
It can save the zoom to localStorage to persist it.  

# Integration
## On standard BGA project
Copy bga-zoom.css and bga-zoom.js files to the `modules` directory.  
Then you can include the module on your game :

CSS file: 
```css
@import url(modules/bga-zoom.css);
```
JS file:
```js
define([
   "dojo","dojo/_base/declare",
   "dojo/debounce",
   "ebg/core/gamegui",
   /*...,*/
   g_gamethemeurl + "modules/bga-zoom.js",
],
function (dojo, declare, debounce, gamegui, /*...,*/ bgaZoom) {
   return declare("bgagame.mygame", gamegui, {
      constructor: function() {

        // create the zoom manager
        this.zoomManager = new ZoomManager({
            element: document.getElementById('game-table'),
            localStorageZoomKey: 'mygame-zoom',
        });
```
