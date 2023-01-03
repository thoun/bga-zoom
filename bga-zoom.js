var DEFAULT_ZOOM_LEVELS = [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
var ZoomManager = /** @class */ (function () {
    /**
     * @param settings: a `ZoomManagerSettings` object
     */
    function ZoomManager(settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this.settings = settings;
        if (!settings.element) {
            throw new DOMException('You need to set the element to wrap in the zoom element');
        }
        this.zoomLevels = (_a = settings.zoomLevels) !== null && _a !== void 0 ? _a : DEFAULT_ZOOM_LEVELS;
        this.zoom = this.settings.defaultZoom || 1;
        if (this.settings.localStorageZoomKey) {
            var zoomStr = localStorage.getItem(this.settings.localStorageZoomKey);
            if (zoomStr) {
                this.zoom = Number(zoomStr);
            }
        }
        this.wrapper = document.createElement('div');
        this.wrapper.id = 'bga-zoom-wrapper';
        this.wrapElement(this.wrapper, settings.element);
        this.wrapper.appendChild(settings.element);
        settings.element.classList.add('bga-zoom-inner');
        if ((_c = (_b = settings.zoomControls) === null || _b === void 0 ? void 0 : _b.visible) !== null && _c !== void 0 ? _c : true) {
            var zoomControls = document.createElement('div');
            zoomControls.id = 'bga-zoom-controls';
            zoomControls.dataset.position = (_e = (_d = settings.zoomControls) === null || _d === void 0 ? void 0 : _d.position) !== null && _e !== void 0 ? _e : 'top-right';
            this.zoomOutButton = document.createElement('button');
            this.zoomOutButton.type = 'button';
            this.zoomOutButton.addEventListener('click', function () { return _this.zoomOut(); });
            if ((_f = settings.zoomControls) === null || _f === void 0 ? void 0 : _f.customZoomOutElement) {
                settings.zoomControls.customZoomOutElement(this.zoomOutButton);
            }
            else {
                this.zoomOutButton.classList.add("bga-zoom-out-".concat((_h = (_g = settings.zoomControls) === null || _g === void 0 ? void 0 : _g.color) !== null && _h !== void 0 ? _h : 'black', "-icon"));
            }
            this.zoomInButton = document.createElement('button');
            this.zoomInButton.type = 'button';
            this.zoomInButton.addEventListener('click', function () { return _this.zoomIn(); });
            if ((_j = settings.zoomControls) === null || _j === void 0 ? void 0 : _j.customZoomInElement) {
                settings.zoomControls.customZoomInElement(this.zoomInButton);
            }
            else {
                this.zoomInButton.classList.add("bga-zoom-in-".concat((_l = (_k = settings.zoomControls) === null || _k === void 0 ? void 0 : _k.color) !== null && _l !== void 0 ? _l : 'black', "-icon"));
            }
            zoomControls.appendChild(this.zoomOutButton);
            zoomControls.appendChild(this.zoomInButton);
            this.wrapper.appendChild(zoomControls);
        }
        if (this.zoom !== 1) {
            this.setZoom(this.zoom);
        }
        window.addEventListener('resize', function () { return _this.zoomOrDimensionChanged(); });
        new ResizeObserver(function () { return _this.zoomOrDimensionChanged(); }).observe(settings.element);
    }
    ZoomManager.prototype.wrapElement = function (wrapper, element) {
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    };
    ZoomManager.prototype.setZoom = function (zoom) {
        var _a, _b;
        if (zoom === void 0) { zoom = 1; }
        this.zoom = zoom;
        if (this.settings.localStorageZoomKey) {
            localStorage.setItem(this.settings.localStorageZoomKey, '' + this.zoom);
        }
        var newIndex = this.zoomLevels.indexOf(this.zoom);
        (_a = this.zoomInButton) === null || _a === void 0 ? void 0 : _a.classList.toggle('disabled', newIndex === this.zoomLevels.length - 1);
        (_b = this.zoomOutButton) === null || _b === void 0 ? void 0 : _b.classList.toggle('disabled', newIndex === 0);
        this.settings.element.style.transform = zoom === 1 ? '' : "scale(".concat(zoom, ")");
        this.zoomOrDimensionChanged();
    };
    ZoomManager.prototype.zoomOrDimensionChanged = function () {
        this.settings.element.style.width = "".concat(this.wrapper.getBoundingClientRect().width / this.zoom, "px");
        this.wrapper.style.height = "".concat(this.settings.element.getBoundingClientRect().height, "px");
    };
    ZoomManager.prototype.zoomIn = function () {
        if (this.zoom === this.zoomLevels[this.zoomLevels.length - 1]) {
            return;
        }
        var newIndex = this.zoomLevels.indexOf(this.zoom) + 1;
        this.setZoom(newIndex === -1 ? 1 : this.zoomLevels[newIndex]);
    };
    ZoomManager.prototype.zoomOut = function () {
        if (this.zoom === this.zoomLevels[0]) {
            return;
        }
        var newIndex = this.zoomLevels.indexOf(this.zoom) - 1;
        this.setZoom(newIndex === -1 ? 1 : this.zoomLevels[newIndex]);
    };
    return ZoomManager;
}());
define({
    ZoomManager: ZoomManager,
});
