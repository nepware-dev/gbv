/**
 * @file
 * Global utilities.
 *
 */
(function($, Drupal) {

    'use strict';

    Drupal.behaviors.gbv = {
        attach: function(context, settings) {
            let position = $(window).scrollTop();
            $(window).scroll(function () {
                if ($(this).scrollTop() > 50) {
                    $('body').addClass('scrolled');
                }
                else {
                    $('body').removeClass('scrolled');
                }
                let scroll = $(window).scrollTop();
                if (scroll > position) {
                    $('body').addClass('scrolldown');
                    $('body').removeClass('scrollup');
                } else {
                    $('body').addClass('scrollup');
                    $('body').removeClass('scrolldown');
                }
                position = scroll;
            });

        }
    };

    $('.dropdown-toggle').prop('disabled', true);

    $('.dropdown').hover( 
        function () {
            $(".dropdown-menu", this).css("display", "block");
        },
        function () {
            $(".dropdown-menu", this).css("display", "none");
        }
    );

})(jQuery, Drupal);
