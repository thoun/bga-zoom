# Code example
## Example of integration

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
