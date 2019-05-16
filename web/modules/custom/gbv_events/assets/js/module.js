(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.loadCalendar = {
        attach: function (context, settings) {
            $('#calendar', context).once('loadCalendar').each( async function () {
                let calendarEvents = JSON.parse(drupalSettings.calendarEvents);
                $('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next',
                        center: 'title',
                        right: ''
                    },
                    // defaultDate: '2019-01-12',
                    navLinks: true, // can click day/week names to navigate views
                    editable: true,
                    eventLimit: true, // allow "more" link when too many events
                    events: calendarEvents
                });
            });
        }
    }
})(jQuery, Drupal, drupalSettings);