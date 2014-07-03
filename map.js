var map; // the map object
var layers = {};
var drawControl;

function initMap() {
    // var resolutions = [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5]
    // var crs32640 = new L.Proj.CRS('EPSG:32640', '+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs', {});
    // crs32640.scale = function(zoom){
    // return 1 / resolutions[zoom];
    // };

    // create a map in the "map" div, set the view to a given place and zoom
    map = L.map('map', {
        minZoom: 0
    }).setView([0, 52.5], 12);

    var crs = L.extend({}, L.CRS.EPSG4326, new L.Proj.CRS("EPSG:32640", "+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs"));

    // Set the map background to our WMS layer of the world boundaries
    // Replace this with your own background layer
    layers.world = L.tileLayer.wms("http://isogd:8082/geoserver/isogd/wms", {
        layers: 'isogd:GPZU',
        format: 'image/png',
        transparent: true,
        noWrap: false
    }).addTo(map);



    // Initialize the WFST layer 
    layers.drawnItems = L.wfst(null, {
        // Required
        url: 'http://isogd:8082/geoserver/isogd/wfs',
        featureNS: 'isogd',
        featureType: 'GPZU',
        primaryKeyField: 'FID',
        showExisting: true,
        style: {
            color: "#ff7800",
            weight: 5,
            opacity: 0.65
        },
        crs: crs
    }).addTo(map);

    // Initialize the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: layers.drawnItems
        }
    });

    map.addControl(drawControl);

    map.on('draw:created', function (e) {
        layers.drawnItems.addLayer(e.layer);
    });
    map.on('draw:edited', function (e) {
        layers.drawnItems.wfstSave(e.layers);
    });
    L.control.mousePosition().addTo(map);
}
