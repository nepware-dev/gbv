/* globals mapboxgl */
(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.loadMap = {
        attach: function (context, settings) {
            $('#gbv-map', context).once('loadMap').each( function () {

                mapboxgl.accessToken = drupalSettings.accessToken;
                let map = new mapboxgl.Map({
                    container: 'gbv-map',
                    style: drupalSettings.mapStyle,
                    renderWorldCopies: false,
                    bounds: [ [-180, -60], [180, 90] ],
                    attributionControl: false,
                    interactive: false,
                });
                let hoveredStateId =  null;
                map.scrollZoom.disable();
                map.boxZoom.disable();
                map.doubleClickZoom.disable();
                let mapData = JSON.parse(drupalSettings.mapData);
                let filteredCountries = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                let postResult = $.ajax({
                    url: '/modules/custom/gbv_map/assets/json/country_centroids_az8.geojson',
                    dataType: 'json',
                });
                postResult.then(function(countries) {
                    mapData.forEach(function(data, index) {
                        let filteredCountry = countries.features.filter(function(feature) {
                            // bounds.extend(feature.geometry.coordinates);
                            return feature.iso_2===data.country;
                        });

                        filteredCountries.features.push(filteredCountry[0]);
                        filteredCountries.features[index].properties.content = data.body;
                        filteredCountries.features[index].properties.uri = data.uri;
                    });

                });
                map.on('load', function () {
                    //let layers = map.getStyle().layers;
                    map.addSource('countries', {
                        'type': 'geojson',
                        'data': filteredCountries
                    });
                    map.addLayer({
                        'id': 'country-fill',
                        'type': 'fill',
                        'source': 'countries',
                        'layout': {},
                        'paint': {
                            'fill-color': '#63337c',
                            'fill-opacity': ['case',
                                ['boolean', ['feature-state', 'hover'], false],
                                1,
                                0.5
                            ]
                        }
                    });

                    map.on('mousemove', 'country-fill', function(e) {
                        if (e.features.length > 0) {
                            if (hoveredStateId) {
                                map.setFeatureState({ source: 'countries', id: hoveredStateId }, { hover: false });
                            }
                            hoveredStateId = e.features[0].id;
                            map.setFeatureState({ source: 'countries', id: hoveredStateId }, { hover: true });
                        }
                    });

                    map.on('mouseleave', 'country-fill', function() {
                        if (hoveredStateId) {
                            map.setFeatureState({ source: 'countries', id: hoveredStateId }, { hover: false });
                        }
                        hoveredStateId =  null;
                    });

                    map.on('click', 'country-fill', function (e) {
                        let centroid = $.parseJSON(e.features[0].properties.centroid);
                        let coordinates = centroid.slice();
                        let name = e.features[0].properties.name;
                        let uri = e.features[0].properties.uri;
                        let content = e.features[0].properties.content;

                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }
                        let popupContent = '<div class="country-header"><h3>'+name+'</h3>';
                        if (uri!='null') {
                            popupContent += '<a class="country-url" href="'+uri+'" target="_blank"> Visit Country Page <i class="fa fa-external-link"></i></a>';
                        }
                        popupContent += '</div>';
                        popupContent += content;
                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(popupContent)
                            .addTo(map);
                    });

                    map.on('mouseenter', 'country-fill', function () {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    map.on('mouseleave', 'country-fill', function () {
                        map.getCanvas().style.cursor = '';
                    });
                });
                if($(window).width() < 560) {
                    map.addControl(new mapboxgl.NavigationControl({
                        showCompass: false,
                    }));
                    map.dragPan.enable();
                }
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
