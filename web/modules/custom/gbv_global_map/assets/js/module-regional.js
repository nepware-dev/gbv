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
          $(document).ready(function () {
            $(
              '<div class="gbv-regional-content-cont"><div class="gbv-regional-content"><h3>' +
                mapData.region.name +
                "</h3><p>" +
                mapData.region.description +
                "</p></div></div>"
            ).appendTo("#gbv-global-map");
          });
          let filteredCountries = {
            type: "FeatureCollection",
            features: [],
          };
          let postResult = $.ajax({
            url: "https://gistcdn.githack.com/timilsinabishal/1df12bb0ce3afe5dbdd6081f89513cae/raw/ece2a05253c7e86a43d8f3e5ea4841cd79b59299/world-admin-0.geojson",
            dataType: "json",
          });
          postResult.then(function (countries) {
            let filteredCountryColor = [];
            mapData.countries.forEach(function (data) {
              let filteredCountry = countries.features.filter(function (
                feature
              ) {
                if(feature.iso_2 === data["iso-2"]){
                  feature.properties.color = data["color-code"];
                  if(feature.properties.color){
                    filteredCountryColor.push(feature.properties.name, feature.properties.color.color);
                  }
                }
                return feature.iso_2 === data["iso-2"];
              });

              filteredCountries.features.push(filteredCountry[0]);
            });

            map.on("load", function () {
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
                  "fill-color": [
                    'match',
                    ['get', 'name'],
                    ...filteredCountryColor,
                    '#ad95ba'
                  ],
                },
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
