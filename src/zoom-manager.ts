/**
 * Options of the zoom controls.
 */
interface ZoomControls {
    /**
     * Set the visibility of the default zoom controls.
     * Default : true.
     */
    visible?: boolean;

    /**
     * Set the position of the zoom controls.
     * Default : 'top-right'.
     */
    position?: 'top-left' | 'top-right';

    /**
     * Set the color of the zoom controls.
     * Default : 'black'.
     */
    color?: 'black' | 'white';

    /**
     * Function to customize the button (add classes or inline style, inner HTML, ...). If set, the default icon (and color parameter) is ignored.
     */
    customZoomInElement?: (element: HTMLButtonElement) => void;

    /**
     * Function to customize the button (add classes or inline style, inner HTML, ...). If set, the default icon (and color parameter) is ignored.
     */
    customZoomOutElement?: (element: HTMLButtonElement) => void;
}

/**
 * Options of the auto zoom.
 */
interface AutoZoomSettings {
    /**
     * The expected width to be available.
     */
    expectedWidth: number;

    /**
     * The minimum zoom level allowed for auto zoom.
     */
    minZoomLevel?: number;
}

interface ZoomManagerSettings {
    /**
     * The element that can be zoomed in/out.
     */
    element: HTMLElement;

    /**
     * Smooth transition when changing zoom level. Default true.
     */
    smooth: boolean;

    /**
     * Default zoom, used at setup. If a zoom if stored in localStorage, the default zoom is ignored.
     */
    defaultZoom?: number;

    /**
     * The key used to persist the zoom level on localStorage.
     * Default (unset) is no storage.
     */
    localStorageZoomKey?: string;

    /**
     * An array of zoom levels for the zoomIn/zoomOut methods.
     * Default is [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
     */
    zoomLevels?: number[];

    /**
     * Options of the zoom controls.
     */
    zoomControls?: ZoomControls;

    /**
     * Options of the auto zoom. If provided, will automatically change the zoom when the window width changes so expectedWidth is available on the rescaled element.
     */
    autoZoom?: AutoZoomSettings;

    /**
     * Function called when the zoom changes.
     */
    onZoomChange?: (zoom: number) => void;

    /**
     * Function called when the element dimensions changes, or after a zoom change.
     * This function can be called a lot of times, don't forget to debounce it if used.
     */
    onDimensionsChange?: (zoom: number) => void;
}

const DEFAULT_ZOOM_LEVELS = [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];

class ZoomManager {
    /**
     * Returns the zoom level
     */
    public get zoom(): number {
        return this._zoom;
    }

    /**
     * Returns the zoom levels
     */
    public get zoomLevels(): number[] {
        return this._zoomLevels;
    }

    private _zoom: number;
    private _zoomLevels: number[];

    private wrapper: HTMLDivElement;
    private zoomControls: HTMLDivElement;
    private zoomOutButton: HTMLButtonElement;
    private zoomInButton: HTMLButtonElement;

    /**
     * Place the settings.element in a zoom wrapper and init zoomControls.
     * 
     * @param settings: a `ZoomManagerSettings` object
     */
    constructor(private settings: ZoomManagerSettings) {
        if (!settings.element) {
            throw new DOMException('You need to set the element to wrap in the zoom element');
        }

        this._zoomLevels = settings.zoomLevels ?? DEFAULT_ZOOM_LEVELS;

        this._zoom = this.settings.defaultZoom || 1;
        if (this.settings.localStorageZoomKey) {
            const zoomStr = localStorage.getItem(this.settings.localStorageZoomKey);
            if (zoomStr) {
                this._zoom = Number(zoomStr);
            }
        }

        this.wrapper = document.createElement('div');
        this.wrapper.id = 'bga-zoom-wrapper';
        this.wrapElement(this.wrapper, settings.element);
        this.wrapper.appendChild(settings.element);
        settings.element.classList.add('bga-zoom-inner');
        if (settings.smooth ?? true) {
            settings.element.dataset.smooth = 'true';
            settings.element.addEventListener('transitionend', () => this.zoomOrDimensionChanged());
        }

        if (settings.zoomControls?.visible ?? true) {
            this.initZoomControls(settings);
        }
        
        if (this._zoom !== 1) {
            this.setZoom(this._zoom);
        }

        window.addEventListener('resize', () => {
            this.zoomOrDimensionChanged();
            if (this.settings.autoZoom?.expectedWidth) {
                this.setAutoZoom();
            }
        });
        if (window.ResizeObserver) {
            new ResizeObserver(() => this.zoomOrDimensionChanged()).observe(settings.element);
        }

        if (this.settings.autoZoom?.expectedWidth) {
            this.setAutoZoom();
        }
    }

    private setAutoZoom() {
        const zoomWrapperWidth = document.getElementById('bga-zoom-wrapper').clientWidth;

        if (!zoomWrapperWidth) {
            setTimeout(() => this.setAutoZoom(), 200);
            return;
        }

        const expectedWidth = this.settings.autoZoom?.expectedWidth;
        let newZoom = this.zoom;
        while (newZoom > this._zoomLevels[0] && newZoom > (this.settings.autoZoom?.minZoomLevel ?? 0) && zoomWrapperWidth/newZoom < expectedWidth) {
            newZoom = this._zoomLevels[this._zoomLevels.indexOf(newZoom) - 1];
        }

        if (this._zoom == newZoom) {
            if (this.settings.localStorageZoomKey) {
                localStorage.setItem(this.settings.localStorageZoomKey, ''+this._zoom);
            }
        } else {
            this.setZoom(newZoom);
        }
    }

    /**
     * Sets the available zoomLevels and new zoom to the provided values.
     * @param zoomLevels the new array of zoomLevels that can be used.
     * @param newZoom if provided the zoom will be set to this value, if not the last element of the zoomLevels array will be set as the new zoom
     */
    public setZoomLevels(zoomLevels: number[], newZoom?: number) {
        if (!zoomLevels || zoomLevels.length <= 0) {
            return;
        }

        this._zoomLevels = zoomLevels;

        const zoomIndex = newZoom && zoomLevels.includes(newZoom) ? this._zoomLevels.indexOf(newZoom) : this._zoomLevels.length - 1;

        this.setZoom(this._zoomLevels[zoomIndex]);
    }

    /**
     * Set the zoom level. Ideally, use a zoom level in the zoomLevels range.
     * @param zoom zool level
     */
    public setZoom(zoom: number = 1) {
        this._zoom = zoom;
        if (this.settings.localStorageZoomKey) {
            localStorage.setItem(this.settings.localStorageZoomKey, ''+this._zoom);
        }
        const newIndex = this._zoomLevels.indexOf(this._zoom);
        this.zoomInButton?.classList.toggle('disabled', newIndex === this._zoomLevels.length - 1);
        this.zoomOutButton?.classList.toggle('disabled', newIndex === 0);

        this.settings.element.style.transform = zoom === 1 ? '' : `scale(${zoom})`;

        this.settings.onZoomChange?.(this._zoom);

        this.zoomOrDimensionChanged();
    }

    /**
     * Call this method for the browsers not supporting ResizeObserver, everytime the table height changes, if you know it.
     * If the browsert is recent enough (>= Safari 13.1) it will just be ignored.
     */
    public manualHeightUpdate() {
        if (!window.ResizeObserver) {
            this.zoomOrDimensionChanged();
        }
    }

    /**
     * Everytime the element dimensions changes, we update the style. And call the optional callback.
     */
    private zoomOrDimensionChanged() {
        this.settings.element.style.width = `${this.wrapper.getBoundingClientRect().width / this._zoom}px`;
        this.wrapper.style.height = `${this.settings.element.getBoundingClientRect().height}px`;

        this.settings.onDimensionsChange?.(this._zoom);
    }

    /**
     * Simulates a click on the Zoom-in button.
     */
    public zoomIn() {
        if (this._zoom === this._zoomLevels[this._zoomLevels.length - 1]) {
            return;
        }
        const newIndex = this._zoomLevels.indexOf(this._zoom) + 1;
        this.setZoom(newIndex === -1 ? 1 : this._zoomLevels[newIndex]);
    }

    /**
     * Simulates a click on the Zoom-out button.
     */
    public zoomOut() {
        if (this._zoom === this._zoomLevels[0]) {
            return;
        }
        const newIndex = this._zoomLevels.indexOf(this._zoom) - 1;
        this.setZoom(newIndex === -1 ? 1 : this._zoomLevels[newIndex]);
    }

    /**
     * Changes the color of the zoom controls.
     */
    public setZoomControlsColor(color: 'black' | 'white') {
        if (this.zoomControls) {
            this.zoomControls.dataset.color = color;
        }
    }
    
    /**
     * Set-up the zoom controls
     * @param settings a `ZoomManagerSettings` object.
     */
    private initZoomControls(settings: ZoomManagerSettings) {
        this.zoomControls = document.createElement('div');
        this.zoomControls.id = 'bga-zoom-controls';
        this.zoomControls.dataset.position = settings.zoomControls?.position ?? 'top-right';

        this.zoomOutButton = document.createElement('button');
        this.zoomOutButton.type = 'button';
        this.zoomOutButton.addEventListener('click', () => this.zoomOut());
        if (settings.zoomControls?.customZoomOutElement) {
            settings.zoomControls.customZoomOutElement(this.zoomOutButton);
        } else {
            this.zoomOutButton.classList.add(`bga-zoom-out-icon`);
        }

        this.zoomInButton = document.createElement('button');
        this.zoomInButton.type = 'button';
        this.zoomInButton.addEventListener('click', () => this.zoomIn());
        if (settings.zoomControls?.customZoomInElement) {
            settings.zoomControls.customZoomInElement(this.zoomInButton);
        } else {
            this.zoomInButton.classList.add(`bga-zoom-in-icon`);
        }

        this.zoomControls.appendChild(this.zoomOutButton);
        this.zoomControls.appendChild(this.zoomInButton);
        this.wrapper.appendChild(this.zoomControls);
        this.setZoomControlsColor(settings.zoomControls?.color ?? 'black');
    }

    /**
     * Wraps an element around an existing DOM element
     * @param wrapper the wrapper element
     * @param element the existing element
     */
    private wrapElement(wrapper: HTMLElement, element: HTMLElement) {
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    }
}