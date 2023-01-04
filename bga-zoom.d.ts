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
declare const DEFAULT_ZOOM_LEVELS: number[];
declare class ZoomManager {
    private settings;
    get zoom(): number;
    private _zoom;
    private wrapper;
    private zoomControls;
    private zoomOutButton;
    private zoomInButton;
    private zoomLevels;
    /**
     * Place the settings.element in a zoom wrapper and init zoomControls.
     *
     * @param settings: a `ZoomManagerSettings` object
     */
    constructor(settings: ZoomManagerSettings);
    setZoom(zoom?: number): void;
    private zoomOrDimensionChanged;
    zoomIn(): void;
    zoomOut(): void;
    setZoomControlsColor(color: 'black' | 'white'): void;
    private initZoomControls;
    private wrapElement;
}
declare const define: any;
