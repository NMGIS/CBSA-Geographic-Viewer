mapboxgl.accessToken = 'pk.eyJ1Ijoibm1naXMiLCJhIjoiY2xsZDFlZDcwMDVweDNlbDAydG81Mmk1eSJ9.h-IyelCFTJxaqXlTX2M-5w';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/nmgis/clle6s78z00gu01rd16or251q', // style URL
    center: [-98, 39], // starting position [lng, lat]
    zoom: 5 // starting zoom
  });

map.on('load', function() {
    
    map.addSource('Metro_GeoJSON', {
        'type': 'geojson',
        'data': './layers/Metro.geojson',
        'maxzoom': 5
    });

    map.addLayer({
        'id': 'Metro_GeoJSON_Layer',
        'type': 'fill', // Can be 'fill', 'line', 'circle', 'symbol', etc. based on your data
        'source': 'Metro_GeoJSON',
        'layout': {},
        'paint': {
            'fill-color': ['case',
                ['boolean', ['feature-state', 'clicked'], false],
                '#38F6F3',  // Color to use when the feature is clicked
                '#f7d797'  // Default color
            ],
            'fill-opacity': 0.7,
            'fill-outline-color': '#4f4e4d'
        }
    });

    map.addSource('Micro_GeoJSON', {
        'type': 'geojson',
        'data': './layers/Micro.geojson',
        'maxzoom': 5
    });

    map.addLayer({
        'id': 'Micro_GeoJSON_Layer',
        'type': 'fill',
        'source': 'Micro_GeoJSON',
        'layout': {},
        'paint': {
            'fill-color': ['case',
                ['boolean', ['feature-state', 'clicked'], false],
                '#38F6F3',  // Color to use when the feature is clicked
                '#d97759'   // Default color
            ],
            'fill-opacity': 0.6,
            'fill-outline-color': '#4f4e4d'
        }
    });

    map.addSource('CSA_GeoJSON', {
        'type': 'geojson',
        'data': './layers/CSA.geojson',
        'maxzoom': 5
    });
    map.addLayer({
        'id': 'CSA_GeoJSON_Fill',
        'type': 'fill',
        'source': 'CSA_GeoJSON',
        'layout': {},
        'paint': {
            'fill-color': ['case',
                ['boolean', ['feature-state', 'clicked'], false],
                'transparent',  // Set to transparent when the feature is clicked
                'transparent'   // Default color
            ],
            'fill-outline-color': 'transparent'
        }
    });
    map.addLayer({
        'id': 'CSA_GeoJSON_Layer',
        'type': 'line',
        'source': 'CSA_GeoJSON',
        'layout': {},
        'paint': {
            'line-color': ['case',
                ['boolean', ['feature-state', 'clicked'], false],
                '#38F6F3',  // Color to use when the feature is clicked
                '#4f4e4d'   // Default color
            ],
            'line-width': ['case',
                ['boolean', ['feature-state', 'clicked'], false],
                3,  // Increase line width when the feature is clicked
                2   // Default width
            ]
        }
    });
    map.addLayer({
        'id': 'CSA_GeoJSON_Labels',
        'type': 'symbol',
        'source': 'CSA_GeoJSON',
        'minzoom': 7,
        'layout': {
            'text-field': ['get', 'NAME'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-size': 12,
        },
        'paint': {
            'text-color': '#000',
            'text-halo-color': '#fff',
            'text-halo-width': 1
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
    // Add the StatesSimple.geojson source
    map.addSource('StatesSimple', {
        'type': 'geojson',
        'data': './layers/StatesSimple.geojson'  // Assuming the geojson file is located in a directory named "layers"
    });

    // Add the layer for StatesSimple
    map.addLayer({
        'id': 'StatesSimple_Layer',
        'type': 'fill',  // This can be changed based on the type of geometries in the geojson
        'source': 'StatesSimple',
        'layout': {
            'visibility': 'none'  // This will ensure the layer is not visible
        },
        'paint': {
            'fill-color': '#000000',  // Dummy value since it's invisible
            'fill-opacity': 0  // Fully transparent
        }
    });
    
    
    // Legend for the layers
    const legendValues = [
        { label: 'Metropolitan statistical area', color: '#f7d797', type: 'fill', id: 'Metro_GeoJSON_Layer' },
        { label: 'Micropolitan statistical area', color: '#d97759', type: 'fill', id: 'Micro_GeoJSON_Layer' },
        { label: 'Combined statistical area', color: '#57544c', type: 'square-outline', id: 'CSA_GeoJSON_Layer' },
        { label: 'Incorporated place', color: '#8c8c8c', type: 'fill', id: 'Place_Layer' }
    ];

    const legendEl = document.getElementById('legend');

    legendValues.forEach(item => {
        const row = document.createElement('div');
        row.style.marginBottom = '10px';
        row.style.display = 'flex';
        row.style.alignItems = 'center';


        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;  // Default to checked since layers are visible by default
        checkbox.style.marginRight = '10px';
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                map.setLayoutProperty(item.id, 'visibility', 'visible');
            } else {
                map.setLayoutProperty(item.id, 'visibility', 'none');
            }
        });
        row.appendChild(checkbox);
        

        if(item.type === 'fill') {
            const colorBox = document.createElement('div');
            colorBox.style.backgroundColor = item.color;
            colorBox.style.width = '20px';
            colorBox.style.height = '20px';
            colorBox.style.display = 'inline-block';
            colorBox.style.marginRight = '10px';
            row.appendChild(colorBox);
        } else if(item.type === 'line') {
            const lineBox = document.createElement('div');
            lineBox.style.borderTop = '3px solid ' + item.color;
            lineBox.style.width = '20px';
            lineBox.style.marginRight = '10px';
            row.appendChild(lineBox);
        } else if(item.type === 'square-outline') {
            const squareBox = document.createElement('div');
            squareBox.style.border = '2px solid ' + item.color;
            squareBox.style.width = '16px';
            squareBox.style.height = '16px';
            squareBox.style.marginRight = '10px';
            row.appendChild(squareBox);
        }

        const valueLabel = document.createTextNode(item.label);
        row.appendChild(valueLabel);

        legendEl.appendChild(row);
    });


});


// reset button
document.getElementById('reset-button').addEventListener('click', function() {
    location.reload();
});

// Populate state dropdown and add event listener for state selection
fetch('./layers/StatesSimple.geojson')
.then(response => response.json())
.then(data => {
    const features = data.features;
    const stateDropdown = document.getElementById('state-dropdown');

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.innerText = 'Select a state...';
    defaultOption.value = '';
    stateDropdown.appendChild(defaultOption);

    features.forEach(function(feature) {
        const stateName = feature.properties.NAME;
        const option = document.createElement('option');
        option.innerText = stateName;
        option.value = JSON.stringify(feature); // Store the feature as string in the option's value
        stateDropdown.appendChild(option);
    });

    // Add an event listener to the dropdown
    stateDropdown.addEventListener('change', function() {
        if (this.value) {
            const feature = JSON.parse(this.value);
            const bbox = turf.bbox(feature);
            map.fitBounds(bbox, { padding: { top: 10, bottom: 10, left: 300, right: 10 } });
        }
    });
})
.catch(error => {
    console.error('Error fetching the geojson:', error);
});


// selecting features
let previousFeature = null;  // Store the entire previous feature instead of just its ID

map.on('click', function(e) {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['Metro_GeoJSON_Layer', 'Micro_GeoJSON_Layer', 'CSA_GeoJSON_Fill']
    });

    if (features.length) {
        // Check if any of the features are from the CSA fill layer
        const csaFeature = features.find(f => f.layer.id === 'CSA_GeoJSON_Fill');
        const clickedFeature = csaFeature || features[0];


        if (previousFeature && previousFeature.id === clickedFeature.id) {
            // The same feature was clicked again, unselect it
            clearSidebar();
            unhighlightFeature(previousFeature);
            previousFeature = null;
        } else {
            // A different feature was clicked
            if (previousFeature) {
                // Unhighlight the previously clicked feature
                unhighlightFeature(previousFeature);
            }
            
            // Highlight the new feature
            highlightFeature(clickedFeature);
            populateSidebar(clickedFeature);
            previousFeature = clickedFeature;
        }
    }
});

function highlightFeature(feature) {
    map.setFeatureState(
        { source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id },
        { clicked: true }
    );
}

function unhighlightFeature(feature) {
    map.setFeatureState(
        { source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id },
        { clicked: false }
    );
}

function clearSidebar() {
    const section1 = document.getElementById('section1');
    section1.innerHTML = '';
}


function populateSidebar(feature) {
    // Clear all sections first
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    const section3 = document.getElementById('section3');
    section1.innerHTML = '';
    section2.innerHTML = '';
    section3.innerHTML = '';

    let section;
    switch (feature.layer.id) {
        case 'CSA_GeoJSON_Fill':
            section = section1;
            // Lookup related Metro features using the CSAFP field
            const relatedMetroFeatures = map.querySourceFeatures('Metro_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            });
            const uniqueMetroNames = [...new Set(relatedMetroFeatures.map(f => f.properties.NAME))];
            if (uniqueMetroNames.length) {
                section2.innerHTML = '';  // Clear any previous content
                const nameElementMetro = document.createElement('h3');
                nameElementMetro.innerText = uniqueMetroNames.join(', ');
                section2.appendChild(nameElementMetro);
            }
            // Lookup related Micro features using the CSAFP field
            const relatedMicroFeatures = map.querySourceFeatures('Micro_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            });
            const uniqueMicroNames = [...new Set(relatedMicroFeatures.map(f => f.properties.NAME))];
            if (uniqueMicroNames.length) {
                section3.innerHTML = '';  // Clear any previous content
                const nameElementMicro = document.createElement('h3');
                nameElementMicro.innerText = uniqueMicroNames.join(', ');
                section3.appendChild(nameElementMicro);
            }
            break;
        case 'Metro_GeoJSON_Layer':
            section = section2;
            // Lookup the corresponding CSA feature using the CSAFP field
            const csaFeatureMetro = map.querySourceFeatures('CSA_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            })[0];
            if (csaFeatureMetro) {
                const nameElementCSA = document.createElement('h3');
                nameElementCSA.innerText = csaFeatureMetro.properties.NAME;
                section1.appendChild(nameElementCSA);
            }
            break;
        case 'Micro_GeoJSON_Layer':
            section = section3;
            // Lookup the corresponding CSA feature using the CSAFP field
            const csaFeatureMicro = map.querySourceFeatures('CSA_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            })[0];
            if (csaFeatureMicro) {
                const nameElementCSA = document.createElement('h3');
                nameElementCSA.innerText = csaFeatureMicro.properties.NAME;
                section1.appendChild(nameElementCSA);
            }
            break;
        default:
            return;
    }

    const featureName = feature.properties.NAME; 
    const nameElement = document.createElement('h3');
    nameElement.innerText = featureName;
    section.appendChild(nameElement);
}



