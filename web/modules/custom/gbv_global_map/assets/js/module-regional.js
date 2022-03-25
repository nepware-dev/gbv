(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.loadMap = {
    attach: function (context, settings) {
      $("#gbv-regional-map", context)
        .once("loadMap")
        .each(function () {
          mapboxgl.accessToken = drupalSettings.accessToken;
          let map = new mapboxgl.Map({
            container: "gbv-regional-map",
            style: drupalSettings.mapStyle,
            renderWorldCopies: false,
            bounds: [
              [-180, -60],
              [180, 90],
            ],
            attributionControl: false,
            interactive: true,
          });
          map.dragPan.disable();
          map.touchZoomRotate.disableRotation();
          map.dragRotate.disable();
          map.scrollZoom.disable();
          map.boxZoom.disable();
          map.doubleClickZoom.disable();
          let mapData = JSON.parse(drupalSettings.mapData);
          let regionalDescription = mapData.region.description ? '<p>'+ mapData.region.description +'</p>' : '';
          $(document).ready(function () {
            $(
              '<div class="gbv-regional-content-cont"><div class="gbv-regional-content"><h3>' +
                mapData.region.name +
                "</h3>" +
                regionalDescription +
                "</div></div>"
            ).appendTo("#gbv-global-map");
          });
          let filteredCountries = {
            type: "FeatureCollection",
            features: [],
          };
          let postResult = $.ajax({
            url: "https://gistcdn.githack.com/timilsinabishal/b2b59aa75b62810d56374d059ea17229/raw/b6252ee74737d273119debad9f7f6c6d3c3a616e/world-admin-0-fiji.geojson",
            dataType: "json",
          });

            map.on("load", function () {
          postResult.then(function (countries) {
            let filteredCountryColor = [];
            mapData.countries.forEach(function (data) {
              let filteredCountry = countries.features.filter(function (
                feature
              ) {
                if(feature.iso_2 === data["iso-2"]){
                  feature.properties.color = data["color-code"];
                  if(feature.properties.color){
                    filteredCountryColor.push(feature.properties.name, feature.properties.color);
                  }
                }
                return feature.iso_2 === data["iso-2"];
              });

              filteredCountries.features.push(filteredCountry[0]);
            });
              map.addSource("countries", {
                type: "geojson",
                data: filteredCountries,
              });
              map.addLayer({
                id: "country-fill",
                type: "fill",
                source: "countries",
                layout: {},
                paint: {
                  "fill-color": '#A991B6',
                  "fill-opacity": 0.7,
                },
              });

              const hoverPopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
                });

            map.on('mouseenter', 'country-fill', function (e) {
                map.getCanvas().style.cursor = 'pointer';
                let centroid = $.parseJSON(e.features[0].properties.centroid);
                let coordinates = centroid.slice();
                let name = e.features[0].properties.name;
                let content = '<h3 class="country-name">'+name+'</h3>'

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                hoverPopup.setLngLat(coordinates).setHTML(content).addTo(map);
            });

            map.on('mouseleave', 'country-fill', function () {
                map.getCanvas().style.cursor = '';
                hoverPopup.remove()
            });

              let bbox = turf.bbox(filteredCountries);
              map.fitBounds(bbox, { padding: 20 });

              if ($(window).width() > 1023) {
                map.fitBounds(bbox, { padding: 100 });
              }
            });
          });
        });
    },
  };
})(jQuery, Drupal, drupalSettings);
