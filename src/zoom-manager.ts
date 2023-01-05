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

interface ZoomManagerSettings {
    /**
     * The element that can be zoomed in/out.
     */
    element: HTMLElement;

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

    private _zoom: number;

    private wrapper: HTMLDivElement;
    private zoomControls: HTMLDivElement;
    private zoomOutButton: HTMLButtonElement;
    private zoomInButton: HTMLButtonElement;
    private zoomLevels: number[];

    /**
     * Place the settings.element in a zoom wrapper and init zoomControls.
     * 
     * @param settings: a `ZoomManagerSettings` object
     */
    constructor(private settings: ZoomManagerSettings) {
        if (!settings.element) {
            throw new DOMException('You need to set the element to wrap in the zoom element');
        }

        this.zoomLevels = settings.zoomLevels ?? DEFAULT_ZOOM_LEVELS;

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

        if (settings.zoomControls?.visible ?? true) {
            this.initZoomControls(settings);
        }
        
        if (this._zoom !== 1) {
            this.setZoom(this._zoom);
        }

        window.addEventListener('resize', () => this.zoomOrDimensionChanged());
        if (window.ResizeObserver) {
            new ResizeObserver(() => this.zoomOrDimensionChanged()).observe(settings.element);
        }
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
        const newIndex = this.zoomLevels.indexOf(this._zoom);
        this.zoomInButton?.classList.toggle('disabled', newIndex === this.zoomLevels.length - 1);
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
        if (this._zoom === this.zoomLevels[this.zoomLevels.length - 1]) {
            return;
        }
        const newIndex = this.zoomLevels.indexOf(this._zoom) + 1;
        this.setZoom(newIndex === -1 ? 1 : this.zoomLevels[newIndex]);
    }

    /**
     * Simulates a click on the Zoom-out button.
     */
    public zoomOut() {
        if (this._zoom === this.zoomLevels[0]) {
            return;
        }
        const newIndex = this.zoomLevels.indexOf(this._zoom) - 1;
        this.setZoom(newIndex === -1 ? 1 : this.zoomLevels[newIndex]);
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