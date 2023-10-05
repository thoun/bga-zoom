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
    smooth?: boolean;
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
    /**
     * Throttle time, in ms, for resize events, to avoid event spamming.
     * Default is 100ms.
     */
    throttleTime?: number;
}
declare const DEFAULT_ZOOM_LEVELS: number[];
declare function throttle(callback: Function, delay: number): () => void;
declare const advThrottle: (func: any, delay: any, options?: {
    leading: boolean;
    trailing: boolean;
}) => (...args: any[]) => void;
declare class ZoomManager {
    protected settings: ZoomManagerSettings;
    /**
     * Returns the zoom level
     */
    get zoom(): number;
    /**
     * Returns the zoom levels
     */
    get zoomLevels(): number[];
    protected _zoom: number;
    protected _zoomLevels: number[];
    protected wrapper: HTMLDivElement;
    protected zoomControls: HTMLDivElement;
    protected zoomOutButton: HTMLButtonElement;
    protected zoomInButton: HTMLButtonElement;
    protected throttleTime: number;
    /**
     * Place the settings.element in a zoom wrapper and init zoomControls.
     *
     * @param settings: a `ZoomManagerSettings` object
     */
    constructor(settings: ZoomManagerSettings);
    private setAutoZoom;
    /**
     * Sets the available zoomLevels and new zoom to the provided values.
     * @param zoomLevels the new array of zoomLevels that can be used.
     * @param newZoom if provided the zoom will be set to this value, if not the last element of the zoomLevels array will be set as the new zoom
     */
    setZoomLevels(zoomLevels: number[], newZoom?: number): void;
    /**
     * Set the zoom level. Ideally, use a zoom level in the zoomLevels range.
     * @param zoom zool level
     */
    setZoom(zoom?: number): void;
    /**
     * Call this method for the browsers not supporting ResizeObserver, everytime the table height changes, if you know it.
     * If the browsert is recent enough (>= Safari 13.1) it will just be ignored.
     */
    manualHeightUpdate(): void;
    /**
     * Everytime the element dimensions changes, we update the style. And call the optional callback.
     * Unsafe method as this is not protected by throttle. Surround with  `advThrottle(() => this.zoomOrDimensionChanged(), this.throttleTime, { leading: true, trailing: true, })` to avoid spamming recomputation.
     */
    protected zoomOrDimensionChanged(): void;
    /**
     * Simulates a click on the Zoom-in button.
     */
    zoomIn(): void;
    /**
     * Simulates a click on the Zoom-out button.
     */
    zoomOut(): void;
    /**
     * Changes the color of the zoom controls.
     */
    setZoomControlsColor(color: 'black' | 'white'): void;
    /**
     * Set-up the zoom controls
     * @param settings a `ZoomManagerSettings` object.
     */
    protected initZoomControls(settings: ZoomManagerSettings): void;
    /**
     * Wraps an element around an existing DOM element
     * @param wrapper the wrapper element
     * @param element the existing element
     */
    protected wrapElement(wrapper: HTMLElement, element: HTMLElement): void;
}
declare const define: any;
