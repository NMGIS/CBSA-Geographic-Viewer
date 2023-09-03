mapboxgl.accessToken = 'pk.eyJ1Ijoibm1naXMiLCJhIjoiY2xsZDFlZDcwMDVweDNlbDAydG81Mmk1eSJ9.h-IyelCFTJxaqXlTX2M-5w';

const layerInteractivityState = {
    'Metro_GeoJSON_Layer': true,
    'Micro_GeoJSON_Layer': true,
    'CSA_GeoJSON_Layer': true,
    'CSA_GeoJSON_Fill': true,  // Add this line
    'Place_Layer': true
};

// Get elements
const infoButton = document.getElementById('info-button');
const splashScreen = document.getElementById('splash-screen');
const closeButton = document.getElementById('close-button');

// Show splash screen when the info button is clicked
infoButton.addEventListener('click', function() {
  splashScreen.style.display = "block";
});

// Hide splash screen when the close button is clicked
closeButton.addEventListener('click', function() {
  splashScreen.style.display = "none";
});

// Show splash screen initially
window.addEventListener('load', function() {
  splashScreen.style.display = "block";
});


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
                6,  // Increase line width when the feature is clicked
                2   // Default width
            ]
        }
    });
    map.addLayer({
        'id': 'CSA_GeoJSON_Labels',
        'type': 'symbol',
        'source': 'CSA_GeoJSON',
        'minzoom': 6,
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
        'minzoom': 5,  // The layer will become visible starting at this zoom level
        'maxzoom': 22, // The layer will become invisible after this zoom level
        'paint': {
            'fill-color': [
                'case',
                ['boolean', ['feature-state', 'clicked'], false],
                '#38F6F3',  // Color when clicked (change this to your preferred highlight color)
                '#8c8c8c'   // Default color
            ],
            'fill-opacity': 0.7,
            'fill-outline-color': '#8c8c8c'
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
            // Special case for CSA layers
            if (item.id === 'CSA_GeoJSON_Layer') {
                if (this.checked) {
                    map.setLayoutProperty('CSA_GeoJSON_Layer', 'visibility', 'visible');
                    map.setLayoutProperty('CSA_GeoJSON_Fill', 'visibility', 'visible');
                    layerInteractivityState['CSA_GeoJSON_Layer'] = true;
                    layerInteractivityState['CSA_GeoJSON_Fill'] = true;
                } else {
                    map.setLayoutProperty('CSA_GeoJSON_Layer', 'visibility', 'none');
                    map.setLayoutProperty('CSA_GeoJSON_Fill', 'visibility', 'none');
                    layerInteractivityState['CSA_GeoJSON_Layer'] = false;
                    layerInteractivityState['CSA_GeoJSON_Fill'] = false;
                }
            } else {
                // For all other layers
                if (this.checked) {
                    map.setLayoutProperty(item.id, 'visibility', 'visible');
                    layerInteractivityState[item.id] = true;
                } else {
                    map.setLayoutProperty(item.id, 'visibility', 'none');
                    layerInteractivityState[item.id] = false;
                }
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
        layers: ['Metro_GeoJSON_Layer', 'Micro_GeoJSON_Layer', 'CSA_GeoJSON_Fill', 'Place_Layer']
    });

    if (features.length) {
        const csaFeature = features.find(f => f.layer.id === 'CSA_GeoJSON_Fill');
        const clickedFeature = csaFeature || features[0];

        if (!layerInteractivityState[clickedFeature.layer.id]) {
            return;
        }

        const popupElement = document.getElementById('mobile-popup');

        if (previousFeature && previousFeature.id === clickedFeature.id) {
            // The same feature was clicked again, unselect it
            clearSidebar();
            unhighlightFeature(previousFeature);
            previousFeature = null;

            // Hide the popup
            popupElement.innerHTML = '';
            popupElement.classList.add('popup-hidden');  // Hide the popup
        } else {
            // A different feature was clicked
            if (previousFeature) {
                unhighlightFeature(previousFeature);
            }
            
            highlightFeature(clickedFeature);
            populateSidebar(clickedFeature);

            // Show the popup for mobile
            if (window.innerWidth <= 768) {
                populateMobilePopup(clickedFeature);
            }

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
    clearSidebar();
    map.setFeatureState(
        { source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id },
        { clicked: false }
    );
}

function clearSidebar() {
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    const section3 = document.getElementById('section3');
    const section4 = document.getElementById('section4');
    section1.innerHTML = '';
    section2.innerHTML = '';
    section3.innerHTML = '';
    section4.innerHTML = '';
}


let sidebarFeatures = [];
function populateSidebar(feature) {
    sidebarFeatures = [];
    clearSidebar();
    // Clear all sections first
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    const section3 = document.getElementById('section3');
    const section4 = document.getElementById('section4');
    section1.innerHTML = '';
    section2.innerHTML = '';
    section3.innerHTML = '';
    section4.innerHTML = '';

    let section;

    switch (feature.layer.id) {
        case 'CSA_GeoJSON_Fill':
            
            section = section1;
            const csaName = feature.properties.NAME;
            const nameElementCSA = document.createElement('h3');
            nameElementCSA.innerText = csaName;
            section.appendChild(nameElementCSA);

            
            // Lookup related Metro features using the CSAFP field
            const relatedMetroFeatures = map.querySourceFeatures('Metro_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            });
            sidebarFeatures = sidebarFeatures.concat(relatedMetroFeatures);
            const uniqueMetroNames = [...new Set(relatedMetroFeatures.map(f => f.properties.NAME))];
            uniqueMetroNames.forEach(name => {
                const nameElementMetro = document.createElement('h3');
                nameElementMetro.innerText = name;
                section2.appendChild(nameElementMetro);
            });

            // Lookup related Micro features using the CSAFP field
            const relatedMicroFeatures = map.querySourceFeatures('Micro_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            });
            sidebarFeatures = sidebarFeatures.concat(relatedMicroFeatures);
            const uniqueMicroNames = [...new Set(relatedMicroFeatures.map(f => f.properties.NAME))];
            uniqueMicroNames.forEach(name => {
                const nameElementMicro = document.createElement('h3');
                nameElementMicro.innerText = name;
                section3.appendChild(nameElementMicro);
            });
            

            // Populate related Place features for CSA
            const relatedPlacesForCSA = map.querySourceFeatures('Place', {
                sourceLayer: 'Incorporated_Place_Related-1qqx0j',
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            });
            sidebarFeatures = sidebarFeatures.concat(relatedPlacesForCSA);
            // Map each feature to a string in the format "NAMELSAD Pop: TOTAL"
            const placeInfoArray = relatedPlacesForCSA.map(feat => `${feat.properties.NAMELSAD} - Pop: ${feat.properties.TOTAL}`);

            // Convert the array to a Set to get unique values
            const uniquePlaceInfoForCSA = [...new Set(placeInfoArray)];

            uniquePlaceInfoForCSA.forEach(placeInfo => {
                const placeElement = document.createElement('h3');
                placeElement.innerText = placeInfo;
                section4.appendChild(placeElement);
            });
            
            
            break;

        case 'Metro_GeoJSON_Layer':
            section = section2;
            const metroName = feature.properties.NAME;
            const nameElementMetro = document.createElement('h3');
            nameElementMetro.innerText = metroName;
            section.appendChild(nameElementMetro);

            // Lookup the corresponding CSA feature using the CSAFP field
            const csaFeatureMetro = map.querySourceFeatures('CSA_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            })[0];
            if (csaFeatureMetro) {
                const nameElementCSAForMetro = document.createElement('h3');
                nameElementCSAForMetro.innerText = csaFeatureMetro.properties.NAME;
                section1.appendChild(nameElementCSAForMetro);
                sidebarFeatures.push(csaFeatureMetro);
            }

            // Populate related Place features for Metro
            const relatedPlacesForMetro = map.querySourceFeatures('Place', {
                sourceLayer: 'Incorporated_Place_Related-1qqx0j',
                filter: ['==', 'CBSAFP', feature.properties.CBSAFP]
            });
            sidebarFeatures = sidebarFeatures.concat(relatedPlacesForMetro);
            // Map each feature to a string in the format "NAMELSAD Pop: TOTAL"
            const placeInfoArrayForMetro = relatedPlacesForMetro.map(feat => `${feat.properties.NAMELSAD} - Pop: ${feat.properties.TOTAL}`);

            // Convert the array to a Set to get unique values
            const uniquePlaceInfoForMetro = [...new Set(placeInfoArrayForMetro)];

            uniquePlaceInfoForMetro.forEach(placeInfo => {
                const placeElement = document.createElement('h3');
                placeElement.innerText = placeInfo;
                section4.appendChild(placeElement);
            });


            break;

        case 'Micro_GeoJSON_Layer':
            section = section3;
            const microName = feature.properties.NAME;
            const nameElementMicro = document.createElement('h3');
            nameElementMicro.innerText = microName;
            section.appendChild(nameElementMicro);

            // Lookup the corresponding CSA feature using the CSAFP field
            const csaFeatureMicro = map.querySourceFeatures('CSA_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            })[0];
            if (csaFeatureMicro) {
                const nameElementCSAForMicro = document.createElement('h3');
                nameElementCSAForMicro.innerText = csaFeatureMicro.properties.NAME;
                section1.appendChild(nameElementCSAForMicro);
                sidebarFeatures.push(csaFeatureMicro);
            }

            // Populate related Place features for Micro
            const relatedPlacesForMicro = map.querySourceFeatures('Place', {
                sourceLayer: 'Incorporated_Place_Related-1qqx0j',
                filter: ['==', 'CBSAFP', feature.properties.CBSAFP]
            });
            sidebarFeatures = sidebarFeatures.concat(relatedPlacesForMicro);
            // Map each feature to a string in the format "NAMELSAD Pop: TOTAL"
            const placeInfoArrayForMicro = relatedPlacesForMicro.map(feat => `${feat.properties.NAMELSAD} - Pop: ${feat.properties.TOTAL}`);

            // Convert the array to a Set to get unique values
            const uniquePlaceInfoForMicro = [...new Set(placeInfoArrayForMicro)];

            uniquePlaceInfoForMicro.forEach(placeInfo => {
                const placeElement = document.createElement('h3');
                placeElement.innerText = placeInfo;
                section4.appendChild(placeElement);
            });

        
            break;

        case 'Place_Layer':
            section = section4;
            const placeName = `${feature.properties.NAMELSAD} - Pop: ${feature.properties.TOTAL}`;
            const nameElementPlace = document.createElement('h3');
            nameElementPlace.innerText = placeName;
            section.appendChild(nameElementPlace);

            // Lookup related Metro or Micro features using the CBSAFP field
            const relatedMetroForPlace = map.querySourceFeatures('Metro_GeoJSON', {
                filter: ['==', 'CBSAFP', feature.properties.CBSAFP]
            });
            if (relatedMetroForPlace.length) {
                section2.innerHTML = '';
                const nameElementMetroForPlace = document.createElement('h3');
                nameElementMetroForPlace.innerText = relatedMetroForPlace[0].properties.NAME;
                section2.appendChild(nameElementMetroForPlace);
                sidebarFeatures = sidebarFeatures.concat(relatedMetroForPlace);
                // Also populate the related CSA for the Metro
                const csaForMetro = map.querySourceFeatures('CSA_GeoJSON', {
                    filter: ['==', 'CSAFP', relatedMetroForPlace[0].properties.CSAFP]
                });
                if (csaForMetro.length) {
                    const nameElementCSAForPlace = document.createElement('h3');
                    nameElementCSAForPlace.innerText = csaForMetro[0].properties.NAME;
                    section1.appendChild(nameElementCSAForPlace);
                    sidebarFeatures = sidebarFeatures.concat(csaForMetro);
                }
            } else {
                const relatedMicroForPlace = map.querySourceFeatures('Micro_GeoJSON', {
                    filter: ['==', 'CBSAFP', feature.properties.CBSAFP]
                });
                if (relatedMicroForPlace.length) {
                    section3.innerHTML = '';
                    const nameElementMicroForPlace = document.createElement('h3');
                    nameElementMicroForPlace.innerText = relatedMicroForPlace[0].properties.NAME;
                    section3.appendChild(nameElementMicroForPlace);
                    sidebarFeatures = sidebarFeatures.concat(relatedMicroForPlace);

                    // Also populate the related CSA for the Micro
                    const csaForMicro = map.querySourceFeatures('CSA_GeoJSON', {
                        filter: ['==', 'CSAFP', relatedMicroForPlace[0].properties.CSAFP]
                    });
                    if (csaForMicro.length) {
                        const nameElementCSAForMicroPlace = document.createElement('h3');
                        nameElementCSAForMicroPlace.innerText = csaForMicro[0].properties.NAME;
                        section1.appendChild(nameElementCSAForMicroPlace);
                        sidebarFeatures = sidebarFeatures.concat(csaForMicro);
                    }
                }
            }
            break;

        default:
            return;
    }

}



function populateMobilePopup(feature) {
    const popupElement = document.getElementById('mobile-popup');
    popupElement.innerHTML = '';  // Clear the existing popup content

    let section;
    let header;

    switch (feature.layer.id) {
        case 'CSA_GeoJSON_Fill':
            section = document.createElement('div');
            const csaName = feature.properties.NAME;
            const nameElementCSA = document.createElement('h3');
            nameElementCSA.innerHTML = "<strong>CSA:</strong> " + csaName;
            section.appendChild(nameElementCSA);

            const popupSectionMetro = document.createElement('div');
            const popupSectionMicro = document.createElement('div');
            const popupSectionPlace = document.createElement('div');
            
            const relatedMetroFeatures = map.querySourceFeatures('Metro_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            });
            const uniqueMetroNames = [...new Set(relatedMetroFeatures.map(f => f.properties.NAME))];
            uniqueMetroNames.forEach(name => {
                const nameElementMetro = document.createElement('h3');
                nameElementMetro.innerHTML = "<strong>MSA:</strong> " + name;
                popupSectionMetro.appendChild(nameElementMetro);
            });
        
            // For Micro features
            const relatedMicroFeatures = map.querySourceFeatures('Micro_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            });
            const uniqueMicroNames = [...new Set(relatedMicroFeatures.map(f => f.properties.NAME))];
            uniqueMicroNames.forEach(name => {
                const nameElementMicro = document.createElement('h3');
                nameElementMicro.innerHTML = "<strong>µSA:</strong> " + name;
                popupSectionMicro.appendChild(nameElementMicro);
            });
        
            // For Place features
            const relatedPlacesForCSA = map.querySourceFeatures('Place', {
                sourceLayer: 'Incorporated_Place_Related-1qqx0j',
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            });
            const placeInfoArray = relatedPlacesForCSA.map(feat => `${feat.properties.NAMELSAD} - Pop: ${feat.properties.TOTAL}`);
            const uniquePlaceInfoForCSA = [...new Set(placeInfoArray)];
            uniquePlaceInfoForCSA.forEach(placeInfo => {
                const placeElement = document.createElement('h3');
                placeElement.innerText = placeInfo;
                popupSectionPlace.appendChild(placeElement);
            });
        
            // Append these new divs to the main 'section'
            section.appendChild(popupSectionMetro);
            section.appendChild(popupSectionMicro);
            section.appendChild(popupSectionPlace);
        
            // Append the main 'section' to the popup
            popupElement.appendChild(section);
            popupElement.classList.remove('popup-hidden');  // Show the popup
        
            break;

        case 'Metro_GeoJSON_Layer':
            section = document.createElement('div');  // Create a new div for the main section
        
            // Subsections for Metro, CSA, and Place within the popup
            const popupSectionCSAForMetro = document.createElement('div');
            const popupSectionPlaceForMetro = document.createElement('div');
        
            const metroName = feature.properties.NAME;
            const nameElementMetro = document.createElement('h3');
            nameElementMetro.innerHTML = "<strong>MSA:</strong> " + metroName;
            section.appendChild(nameElementMetro);
        
            // Lookup the corresponding CSA feature using the CSAFP field
            const csaFeatureMetro = map.querySourceFeatures('CSA_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            })[0];
            if (csaFeatureMetro) {
                const nameElementCSAForMetro = document.createElement('h3');
                nameElementCSAForMetro.innerHTML = "<strong>CSA:</strong> " + csaFeatureMetro.properties.NAME;
                popupSectionCSAForMetro.appendChild(nameElementCSAForMetro);
            }
        
            // Populate related Place features for Metro
            const relatedPlacesForMetro = map.querySourceFeatures('Place', {
                sourceLayer: 'Incorporated_Place_Related-1qqx0j',
                filter: ['==', 'CBSAFP', feature.properties.CBSAFP]
            });
            const placeInfoArrayForMetro = relatedPlacesForMetro.map(feat => `${feat.properties.NAMELSAD} - Pop: ${feat.properties.TOTAL}`);
            const uniquePlaceInfoForMetro = [...new Set(placeInfoArrayForMetro)];
        
            uniquePlaceInfoForMetro.forEach(placeInfo => {
                const placeElement = document.createElement('h3');
                placeElement.innerText = placeInfo;
                popupSectionPlaceForMetro.appendChild(placeElement);
            });
        
            // Append these new divs to the main 'section'
            section.appendChild(popupSectionCSAForMetro);
            section.appendChild(popupSectionPlaceForMetro);
        
            // Append the main 'section' to the popup
            popupElement.appendChild(section);
            popupElement.classList.remove('popup-hidden');  // Show the popup
        
            break;
            

        case 'Micro_GeoJSON_Layer':
            section = document.createElement('div');  // Create a new div for the main section
        
            // Subsections for Micro, CSA, and Place within the popup
            const popupSectionCSAForMicro = document.createElement('div');
            const popupSectionPlaceForMicro = document.createElement('div');
        
            const microName = feature.properties.NAME;
            const nameElementMicro = document.createElement('h3');
            nameElementMicro.innerHTML = "<strong>µSA:</strong> " + microName;
            section.appendChild(nameElementMicro);
        
            // Lookup the corresponding CSA feature using the CSAFP field
            const csaFeatureMicro = map.querySourceFeatures('CSA_GeoJSON', {
                filter: ['==', 'CSAFP', feature.properties.CSAFP]
            })[0];
            if (csaFeatureMicro) {
                const nameElementCSAForMicro = document.createElement('h3');
                nameElementCSAForMicro.innerHTML = "<strong>CSA:</strong> " + csaFeatureMicro.properties.NAME;
                popupSectionCSAForMicro.appendChild(nameElementCSAForMicro);
            }
        
            // Populate related Place features for Micro
            const relatedPlacesForMicro = map.querySourceFeatures('Place', {
                sourceLayer: 'Incorporated_Place_Related-1qqx0j',
                filter: ['==', 'CBSAFP', feature.properties.CBSAFP]
            });
            const placeInfoArrayForMicro = relatedPlacesForMicro.map(feat => `${feat.properties.NAMELSAD} - Pop: ${feat.properties.TOTAL}`);
            const uniquePlaceInfoForMicro = [...new Set(placeInfoArrayForMicro)];
        
            uniquePlaceInfoForMicro.forEach(placeInfo => {
                const placeElement = document.createElement('h3');
                placeElement.innerText = placeInfo;
                popupSectionPlaceForMicro.appendChild(placeElement);
            });
        
            // Append these new divs to the main 'section'
            section.appendChild(popupSectionCSAForMicro);
            section.appendChild(popupSectionPlaceForMicro);
        
            // Append the main 'section' to the popup
            popupElement.appendChild(section);
            popupElement.classList.remove('popup-hidden');  // Show the popup
        
            break;
            

        case 'Place_Layer':
            section = document.createElement('div');  // Create a new div for the main section
        
            // Subsections for Place, Metro, and Micro within the popup
            const popupSectionMetroForPlace = document.createElement('div');
            const popupSectionMicroForPlace = document.createElement('div');
        
            const placeName = `${feature.properties.NAMELSAD} - Pop: ${feature.properties.TOTAL}`;
            const nameElementPlace = document.createElement('h3');
            nameElementPlace.innerText = placeName;
            section.appendChild(nameElementPlace);
        
            // Lookup related Metro features using the CBSAFP field
            const relatedMetroForPlace = map.querySourceFeatures('Metro_GeoJSON', {
                filter: ['==', 'CBSAFP', feature.properties.CBSAFP]
            });
            if (relatedMetroForPlace.length) {
                const nameElementMetroForPlace = document.createElement('h3');
                nameElementMetroForPlace.innerText = relatedMetroForPlace[0].properties.NAME;
                popupSectionMetroForPlace.appendChild(nameElementMetroForPlace);
            } else {
                // Lookup related Micro features using the CBSAFP field
                const relatedMicroForPlace = map.querySourceFeatures('Micro_GeoJSON', {
                    filter: ['==', 'CBSAFP', feature.properties.CBSAFP]
                });
                if (relatedMicroForPlace.length) {
                    const nameElementMicroForPlace = document.createElement('h3');
                    nameElementMicroForPlace.innerText = relatedMicroForPlace[0].properties.NAME;
                    popupSectionMicroForPlace.appendChild(nameElementMicroForPlace);
                }
            }
        
            // Append these new divs to the main 'section'
            section.appendChild(popupSectionMetroForPlace);
            section.appendChild(popupSectionMicroForPlace);
        
            // Append the main 'section' to the popup
            popupElement.appendChild(section);
            popupElement.classList.remove('popup-hidden');  // Show the popup
        
            break;
            

        default:
            return;
    }

    popupElement.appendChild(section);
    popupElement.classList.remove('popup-hidden');  // Show the popup
}
