(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.loadMap = {
    attach: function (context, settings) {
      $('#gbv-global-map', context).once('loadMap').each(function () {
        mapboxgl.accessToken = drupalSettings.accessToken;
        let map = new mapboxgl.Map({
          container: 'gbv-global-map',
          style: drupalSettings.mapStyle,
          renderWorldCopies: false,
          bounds: [ [-180, -60], [180, 90] ],
          attributionControl: false,
          interactive: true,
        });
        let hoveredStateId =  null;
        map.dragPan.disable();
        map.touchZoomRotate.disableRotation();
        map.dragRotate.disable();
        map.scrollZoom.disable();
        map.boxZoom.disable();
        map.doubleClickZoom.disable();
        let mapData = JSON.parse(drupalSettings.mapData);
        let filteredCountries = {
            'type': 'FeatureCollection',
            'features': []
        };
        let postResult = $.ajax({
            url: 'https://gistcdn.githack.com/timilsinabishal/1df12bb0ce3afe5dbdd6081f89513cae/raw/ece2a05253c7e86a43d8f3e5ea4841cd79b59299/world-admin-0.geojson',
            dataType: 'json',
        });
        postResult.then(function(countries) {
            mapData.forEach(function(data, index) {
                let filteredCountry = countries.features.filter(function(feature) {
                    return feature.iso_2===data.country;
                });

                filteredCountries.features.push(filteredCountry[0]);
                filteredCountries.features[index].properties.content = data.body;
                filteredCountries.features[index].properties.hrp_country = data.hrp_country;
                filteredCountries.features[index].properties.uri = data.uri;
            });

            map.on('load', function () {
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
                    let hrp = e.features[0].properties.hrp_country;
                    let uri = e.features[0].properties.uri;
                    let content = e.features[0].properties.content;

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    let popupContent = '<div class="global-country-header"><h3>'+name+'</h3>';
                    if (uri!=='null') {
                        popupContent += '<a class="global-country-url" href="'+uri+'" target="_blank"> Visit Country Page <i class="fa fa-external-link"></i></a>';
                    }
                    popupContent += '</div>';
                    if(hrp!=='null') {
                        popupContent += '<div class="global-country-header-hrp"><strong>HRP Country:</strong> '+ hrp +'</div>';
                    }
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
        });
        if($(window).width() < 560) {
            map.addControl(new mapboxgl.NavigationControl({
                showCompass: false,
            }));
            map.dragPan.enable();
            map.scrollZoom.enable();
        }
        if($(window).width() > 1200) {
            map.fitBounds([[-100, -60], [120, 65]]);
        }
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
