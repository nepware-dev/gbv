/* globals mapboxgl turf */
(function ($, Drupal, drupalSettings, once) {
  Drupal.behaviors.loadMap = {
    attach(context, settings) {
      const mapElement = once("loadMap", "#gbv-map", context);
      mapElement.forEach(function () {
        mapboxgl.accessToken = drupalSettings.accessToken;
        const map = new mapboxgl.Map({
          container: "gbv-map",
          style: drupalSettings.mapStyle,
          renderWorldCopies: false,
          bounds: [
            [-180, -60],
            [180, 90],
          ],
          attributionControl: false,
          interactive: true,
        });
        let hoveredStateId = null;
        map.dragPan.disable();
        map.touchZoomRotate.disableRotation();
        map.dragRotate.disable();
        map.scrollZoom.disable();
        map.boxZoom.disable();
        map.doubleClickZoom.disable();
        const mapData = JSON.parse(drupalSettings.mapData);
        const filteredCountries = {
          type: "FeatureCollection",
          features: [],
        };
        const postResult = $.ajax({
          url: "https://gistcdn.githack.com/timilsinabishal/1df12bb0ce3afe5dbdd6081f89513cae/raw/ece2a05253c7e86a43d8f3e5ea4841cd79b59299/world-admin-0.geojson",
          dataType: "json",
        });

        map.on("load", function () {
          postResult.then(function (countries) {
            mapData.forEach(function (data, index) {
              const filteredCountry = countries.features.filter(
                function (feature) {
                  // bounds.extend(feature.geometry.coordinates);
                  return feature.iso_2 === data.country;
                },
              );

              filteredCountries.features.push(filteredCountry[0]);
              filteredCountries.features[index].properties.content = data.body;
              filteredCountries.features[index].properties.uri = data.uri;
            });
            // let layers = map.getStyle().layers;
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
                "fill-color": "#63337c",
                "fill-opacity": [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  0.8,
                  0.5,
                ],
              },
            });

            const bbox = turf.bbox(filteredCountries);
            map.fitBounds(bbox, { padding: 20 });

            map.on("mousemove", "country-fill", function (e) {
              if (e.features.length > 0) {
                if (hoveredStateId) {
                  map.setFeatureState(
                    { source: "countries", id: hoveredStateId },
                    { hover: false },
                  );
                }
                hoveredStateId = e.features[0].id;
                map.setFeatureState(
                  { source: "countries", id: hoveredStateId },
                  { hover: true },
                );
              }
            });

            map.on("mouseleave", "country-fill", function () {
              if (hoveredStateId) {
                map.setFeatureState(
                  { source: "countries", id: hoveredStateId },
                  { hover: false },
                );
              }
              hoveredStateId = null;
            });

            map.on("click", "country-fill", function (e) {
              const centroid = $.parseJSON(e.features[0].properties.centroid);
              const coordinates = centroid.slice();
              const { name } = e.features[0].properties;
              const { uri } = e.features[0].properties;
              const { content } = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }
              let popupContent = `<div class="country-header"><h3>${name}</h3>`;
              if (uri !== "null") {
                popupContent += `<a class="country-url" href="${
                  uri
                }" target="_blank"> Visit Country Page <i class="fa fa-external-link"></i></a>`;
              }
              popupContent += "</div>";
              popupContent += content;
              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);
            });

            map.on("mouseenter", "country-fill", function () {
              map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "country-fill", function () {
              map.getCanvas().style.cursor = "";
            });
          });
        });
        if ($(window).width() < 560) {
          map.addControl(
            new mapboxgl.NavigationControl({
              showCompass: false,
            }),
          );
          map.dragPan.enable();
          map.scrollZoom.enable();
        }
      });
    },
  };
})(jQuery, Drupal, drupalSettings, once);
