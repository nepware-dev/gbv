/**
 * @file
 * Global utilities.
 *
 */
(function($, Drupal) {
    'use strict';
    $( ".button-outline-violet" ).click(function() {
      let category = $('.views-element-container').children('h2').text();
      let parentElement = $(this).parent().parent().parent().parent();
      let title = parentElement.find('h4:first-child').text();
      let ext = parentElement.find('.col-2').children('p:first-child').text();
      gtag('event', ext, {
        event_category: category,
        event_label: title,
        transport_type: 'beacon'
      });
    });
})(jQuery, Drupal);

