(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.loadMap = {
    attach: function (context, settings) {
      $("#gbv-country-map", context)
        .once("loadMap")
        .each(function () {
          mapboxgl.accessToken = drupalSettings.accessToken;
          let map = new mapboxgl.Map({
            container: "gbv-country-map",
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
          map.addControl(new mapboxgl.NavigationControl());
          let mapData = JSON.parse(drupalSettings.mapData);
          $(document).ready(function () {
            let hr_info = mapData.hr_info ? '<a href="' + mapData.hr_info + '" target="_blank">HR Info</a>' : '';
            let countryDescription = mapData.description ? '<p>' + mapData.description + '</p>' : '';
            $(
              '<div class="gbv-country-content-cont"><div class="gbv-country-content"><h3>' +
                mapData.name +
                '</h3>' +
                countryDescription +
                hr_info +
              '</div></div>'
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
            map.on("load", function () {
          postResult.then(function (countries) {
            let filteredCountry = countries.features.filter(function (feature) {
              return feature.iso_2 === mapData["iso-2"];
            });

            filteredCountries.features.push(filteredCountry[0]);

              map.addLayer({
                id: "country-boundaries",
                source: {
                  type: "vector",
                  url: "mapbox://mapbox.country-boundaries-v1",
                },
                "source-layer": "country_boundaries",
                type: "fill",
                paint: {
                  "fill-color": '#A991B6',
                  "fill-opacity": 0.7,
                },
              });

              map.setFilter("country-boundaries", [
                "in",
                "iso_3166_1",
                mapData["iso-2"],
              ]);

              let bbox = turf.bbox(filteredCountries);
              map.fitBounds(bbox, { padding: 100 });

              if ($(window).width() < 480) {
                map.fitBounds(bbox, { padding: 30 });
              }
              if ($(window).width() > 1023) {
                map.fitBounds(bbox, { padding: 200 });
              }
            });
          });
        });
    },
  };
})(jQuery, Drupal, drupalSettings);
