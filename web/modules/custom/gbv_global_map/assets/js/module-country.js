(function ($, Drupal, drupalSettings) {
  // let mapData = JSON.parse(drupalSettings.mapData);
  let base_url = drupalSettings.path.baseUrl;
  console.log(drupalSettings.mapData);
  Drupal.behaviors.loadMap = {
    attach: function (context, settings) {
      $('#gbv-global-map', context).once('loadMap').each(function () {
        mapboxgl.accessToken = drupalSettings.accessToken;
        let map = new mapboxgl.Map({
          container: 'gbv-global-map',
          style: drupalSettings.mapStyle,
          renderWorldCopies: false,
          bounds: [[-180, -60], [180, 90]],
          attributionControl: false,
          interactive: true,
        });
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
