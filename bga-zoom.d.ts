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
declare const DEFAULT_ZOOM_LEVELS: number[];
declare class ZoomManager {
    private settings;
    zoom: number;
    private wrapper;
    private zoomOutButton;
    private zoomInButton;
    private zoomLevels;
    /**
     * @param settings: a `ZoomManagerSettings` object
     */
    constructor(settings: ZoomManagerSettings);
    private wrapElement;
    private setZoom;
    private zoomOrDimensionChanged;
    zoomIn(): void;
    zoomOut(): void;
}
declare const define: any;
