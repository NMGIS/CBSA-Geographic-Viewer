mapboxgl.accessToken = 'pk.eyJ1Ijoibm1naXMiLCJhIjoiY2xsZDFlZDcwMDVweDNlbDAydG81Mmk1eSJ9.h-IyelCFTJxaqXlTX2M-5w';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/nmgis/clle6s78z00gu01rd16or251q', // style URL
    center: [-98, 39], // starting position [lng, lat]
    zoom: 5 // starting zoom
  });

map.on('load', function() {
    
    map.addSource('Metro', {
        'type': 'vector',
        'url': 'mapbox://nmgis.8bzh59zu'
    });

    map.addLayer({
        'id': 'Metro_Layer',
        'type': 'fill', // Can be 'fill', 'line', 'circle', 'symbol', etc. based on your data
        'source': 'Metro',
        'source-layer': 'Metropolitan_Statistical_Area-1sl8an', // This is usually the name of your tileset
        'layout': {},
        'paint': {
            'fill-color': '#f7d797',  // Contrasting color
            'fill-opacity': 0.7,     // Medium-high opacity
            'fill-outline-color': '#f7d797'  // Thin or medium dark outline
        }
    });

    map.addSource('Micro', {
        'type': 'vector',
        'url': 'mapbox://nmgis.8675zfmi'
    });

    map.addLayer({
        'id': 'Micro_Layer',
        'type': 'fill', // Can be 'fill', 'line', 'circle', 'symbol', etc. based on your data
        'source': 'Micro',
        'source-layer': 'Micropolitan_Statistical_Area-3zt3x6', // This is usually the name of your tileset
        'layout': {},
        'paint': {
            'fill-color': '#dbcdb2',  // Another contrasting color
            'fill-opacity': 0.6,     // Medium opacity
            'fill-outline-color': '#dbcdb2'  // Medium dark outline
        }
    });

    map.addSource('CSA', {
        'type': 'vector',
        'url': 'mapbox://nmgis.5yeqsljb'
    });
    
    map.addLayer({
        'id': 'CSA_Layer',
        'type': 'line',  // Change from 'fill' to 'line'
        'source': 'CSA',
        'source-layer': 'Combined_Statistical_Area-8s87ox',
        'layout': {},
        'paint': {
            'line-color': '#57544c', 
            'line-width': 2,  
        }
    }); 
    map.addSource('Place', {
        'type': 'vector',
        'url': 'mapbox://nmgis.59eos659'
    });

    map.addLayer({
        'id': 'Place_Layer',
        'type': 'fill', // Can be 'fill', 'line', 'circle', 'symbol', etc. based on your data
        'source': 'Place',
        'source-layer': 'Incorporated_Place_Related-1qqx0j', // This is usually the name of your tileset
        'layout': {},
        'minzoom': 7,  // The layer will become visible starting at this zoom level
        'maxzoom': 22, // The layer will become invisible after this zoom level
        'paint': {
            'fill-color': '#8c8c8c',  // Bright color
            'fill-opacity': 0.7,     // High opacity
            'fill-outline-color': '#8c8c8c'  // Thin dark outline
        }
    });
    
});

// Add click event to the reset button
document.getElementById('reset-button').addEventListener('click', function() {
    map.flyTo({
    center: [-98, 39], // starting position [lng, lat]
    zoom: 5 // starting zoom
    });
  });
  

