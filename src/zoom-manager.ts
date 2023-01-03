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
}

const DEFAULT_ZOOM_LEVELS = [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];

class ZoomManager {
    public zoom: number;

    private wrapper: HTMLDivElement;
    private zoomOutButton: HTMLButtonElement;
    private zoomInButton: HTMLButtonElement;
    private zoomLevels: number[];

    /**
     * @param settings: a `ZoomManagerSettings` object
     */
    constructor(private settings: ZoomManagerSettings) {
        if (!settings.element) {
            throw new DOMException('You need to set the element to wrap in the zoom element');
        }

        this.zoomLevels = settings.zoomLevels ?? DEFAULT_ZOOM_LEVELS;

        this.zoom = this.settings.defaultZoom || 1;
        if (this.settings.localStorageZoomKey) {
            const zoomStr = localStorage.getItem(this.settings.localStorageZoomKey);
            if (zoomStr) {
                this.zoom = Number(zoomStr);
            }
        }

        this.wrapper = document.createElement('div');
        this.wrapper.id = 'bga-zoom-wrapper';
        this.wrapElement(this.wrapper, settings.element);
        this.wrapper.appendChild(settings.element);
        settings.element.classList.add('bga-zoom-inner');

        if (settings.zoomControls?.visible ?? true) {
            const zoomControls = document.createElement('div');
            zoomControls.id = 'bga-zoom-controls';
            zoomControls.dataset.position = settings.zoomControls?.position ?? 'top-right';

            this.zoomOutButton = document.createElement('button');
            this.zoomOutButton.type = 'button';
            this.zoomOutButton.addEventListener('click', () => this.zoomOut());
            if (settings.zoomControls?.customZoomOutElement) {
                settings.zoomControls.customZoomOutElement(this.zoomOutButton);
            } else {
                this.zoomOutButton.classList.add(`bga-zoom-out-${settings.zoomControls?.color ?? 'black'}-icon`);
            }

            this.zoomInButton = document.createElement('button');
            this.zoomInButton.type = 'button';
            this.zoomInButton.addEventListener('click', () => this.zoomIn());
            if (settings.zoomControls?.customZoomInElement) {
                settings.zoomControls.customZoomInElement(this.zoomInButton);
            } else {
                this.zoomInButton.classList.add(`bga-zoom-in-${settings.zoomControls?.color ?? 'black'}-icon`);
            }

            zoomControls.appendChild(this.zoomOutButton);
            zoomControls.appendChild(this.zoomInButton);
            this.wrapper.appendChild(zoomControls);
        }
        
        if (this.zoom !== 1) {
            this.setZoom(this.zoom);
        }

        window.addEventListener('resize', () => this.zoomOrDimensionChanged());
        new ResizeObserver(() => this.zoomOrDimensionChanged()).observe(settings.element);
    }
    
    private wrapElement(wrapper: HTMLElement, element: HTMLElement) {
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    }

    private setZoom(zoom: number = 1) {
        this.zoom = zoom;
        if (this.settings.localStorageZoomKey) {
            localStorage.setItem(this.settings.localStorageZoomKey, ''+this.zoom);
        }
        const newIndex = this.zoomLevels.indexOf(this.zoom);
        this.zoomInButton?.classList.toggle('disabled', newIndex === this.zoomLevels.length - 1);
        this.zoomOutButton?.classList.toggle('disabled', newIndex === 0);

        this.settings.element.style.transform = zoom === 1 ? '' : `scale(${zoom})`;

        this.zoomOrDimensionChanged();
    }

    private zoomOrDimensionChanged() {
        this.settings.element.style.width = `${this.wrapper.getBoundingClientRect().width / this.zoom}px`;
        this.wrapper.style.height = `${this.settings.element.getBoundingClientRect().height}px`;
    }

    public zoomIn() {
        if (this.zoom === this.zoomLevels[this.zoomLevels.length - 1]) {
            return;
        }
        const newIndex = this.zoomLevels.indexOf(this.zoom) + 1;
        this.setZoom(newIndex === -1 ? 1 : this.zoomLevels[newIndex]);
    }

    public zoomOut() {
        if (this.zoom === this.zoomLevels[0]) {
            return;
        }
        const newIndex = this.zoomLevels.indexOf(this.zoom) - 1;
        this.setZoom(newIndex === -1 ? 1 : this.zoomLevels[newIndex]);
    }
}