(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.loadMap = {
        attach: function (context, settings) {
            $('#gbv-map', context).once('loadMap').each( async function () {
                try {
                    mapboxgl.accessToken = 'pk.eyJ1IjoiYmFuc2FqIiwiYSI6ImNqdTJqNTFyODA5dTMzeW8xZWZ3bWhnamcifQ.qBYnz-fhbJH37LW-nrDEXQ';
                    var map = new mapboxgl.Map({
                        container: 'gbv-map',
                        style: 'mapbox://styles/bansaj/cjvgjav4n2rj01fp8g8b8xvr0?fresh=true',
                        center: [-75.020000, 42.362400],
                        minZoom: 2,
                        maxZoom: 5
                    });
                    map.addControl(new mapboxgl.NavigationControl());
                    map.scrollZoom.disable();
                    map.boxZoom.disable();
                    map.doubleClickZoom.disable();
                    let mapData = JSON.parse(drupalSettings.mapData);
                    var filteredCountries = {
                        "type": "FeatureCollection",
                        "features":[]
                    };
                    postResult = $.ajax({
                        url: '/modules/custom/gbv_map/assets/json/country_centroids_az8.geojson',
                        dataType: 'json',
                    });
                    postResult.then(function(centroids) {
                        
                        var bounds = new mapboxgl.LngLatBounds();
                        mapData.forEach(function(data, index){
                            filteredCountry = centroids.features.filter(function(feature){
                                bounds.extend(feature.geometry.coordinates);
                                return feature.properties.iso_a2===data.country;         
                            });
                            filteredCountries.features.push(filteredCountry[0]);
                            filteredCountries.features[index].properties.content = data.body;
                            filteredCountries.features[index].properties.uri = data.uri;
                        });
                        map.fitBounds(bounds);
                        
                    });
                } catch(e) {
                    console.log(e);
                }
                map.on('load', function () {
                    var layers = map.getStyle().layers;
                    map.addLayer({
                        id: 'centroids',
                        type: 'circle',
                        source: {
                        type: 'geojson',
                        data: filteredCountries
                        },
                        paint: {
                            'circle-radius': {
                                'base': 5.5,
                                'stops': [[12, 6], [22, 180]]
                            },
                            'circle-color':'grey',
                            'circle-stroke-color': 'grey',
                        }
                    });

                    map.addLayer({
                        "id": "centroids-highlighted",
                        "type": "circle",
                        "source": "centroids",
                        paint: {
                            'circle-radius': {
                                'base': 5.5,
                                'stops': [[12, 6], [22, 180]]
                            },
                            'circle-color':'red',
                            'circle-stroke-width': 5,
                            'circle-stroke-color': 'red',
                            'circle-stroke-opacity': .2,
                        },
                        "filter": ["in", "name", ""]
                        }); 


                    map.on('click', 'centroids', function (e) {
                        var coordinates = e.features[0].geometry.coordinates.slice();
                        var name = e.features[0].properties.name;
                        var uri = e.features[0].properties.uri;
                        var content = e.features[0].properties.content;
                        
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }
                        let popupContent = '<div class="country-header"><h3>'+name+'</h3>';
                        popupContent += '<a class="country-url" href="'+uri+'" target="_blank"> Visit Country Page </a></div>';
                        popupContent += content;
                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(popupContent)
                            .addTo(map);
                    });

                    map.on('mouseenter', 'centroids', function () {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    map.on('mouseleave', 'centroids', function () {
                        map.getCanvas().style.cursor = '';
                    });

                    map.on('click', function(e) {
                        var bbox = [[e.point.x, e.point.y - 5], [e.point.x, e.point.y]];
                        var features = map.queryRenderedFeatures(bbox, { layers: ['centroids'] });
                        var filter = features.reduce(function(centroid, feature) {
                            centroid.push(feature.properties.name);
                            return centroid;
                            }, ['in', 'name']);
                            
                        map.setFilter("centroids-highlighted", filter);
                    });

                });
            });
        }
    }
})(jQuery, Drupal, drupalSettings);