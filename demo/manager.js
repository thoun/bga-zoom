let zoomManager;

function initManager() {
    zoomManager = new ZoomManager({
        element: document.getElementById('game-table'),
        localStorageZoomKey: 'bga-zoom-demo-zoom',
        autoZoom: {
            expectedWidth: 1500,
        },
        onZoomChange: (zoom) => console.log('onZoomChange', zoom),
        onDimensionsChange: (zoom) => console.log('onDimensionsChange', zoom),
    });

    for (let i=0; i<8; i++) {
        increaseBoxCount();
    }
}

let height = 100;

function increaseBoxCount() {
    zoomManager.settings.element.insertAdjacentHTML('beforeend', `<div class="box">Some boxes that will change the height if the window is resized</div>`);
}

function decreaseBoxCount() {
    if (!document.getElementsByClassName('box').length) {
        return;
    }

    document.getElementsByClassName('box')[0].remove();
}

function setZoomControlsColor(color) {
    zoomManager.setZoomControlsColor(color);
}

function changeZoomLevels(zoomLevels) {
    if (zoomLevels) {
        zoomManager.setZoomLevels(zoomLevels)
    } else {
        zoomManager.setZoomLevels(DEFAULT_ZOOM_LEVELS)
    }
}