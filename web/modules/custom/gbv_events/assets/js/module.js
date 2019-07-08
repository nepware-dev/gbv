(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.loadCalendar = {
        attach: function (context, settings) {
            $('#calendar', context).once('loadCalendar').each( function () {
                if(!document.getElementById('calendar').hasChildNodes()) {
                    let calendarEvents = JSON.parse(drupalSettings.calendarEvents);
                    $('#calendar').fullCalendar({
                        header: {
                            left: 'prev,next,today',
                            center: 'title',
                            right: 'month,agendaWeek,agendaDay,list'
                        },
                        navLinks: true, // can click day/week names to navigate views
                        editable: true,
                        eventLimit: true, // allow "more" link when too many events
                        events: calendarEvents,
                        eventRender: function(event, element) {
                            let title = event.title,
                                body = event.body,
                                dateContent = event.dateContent,
                                uri = event.uri.uri,
                                buttonTitle = event.uri.title;
                            let innerContent = '<h5>'+title+'</h5>';
                            innerContent += '<p class="event-date">'+dateContent+'</p>';
                            innerContent += '<div class="event-body">'+body+'</div>';
                            innerContent += '<div class="col-12 nopadding event-footer"><div class="row"><div class="col-8 content-left"><h5 class="contact-header">Contact for more information</h5><p class="contact-email"><a href="mailto:contact@unfpa.org">contact@unfpa.org<a/></p></div><div class="col-4 nopadding content-right"><div class="btn-contained"><a href="' + uri + '" target="_blank">'+buttonTitle+'<i style="font-size:16px" class="fa fa-external-link"></i></a></div></div></div></div>';
                            element.popover({
                                animation: true,
                                content: innerContent,
                                trigger: 'click',
                                placement: 'top',
                                html: true,
                            });
                        },
                    });
                }
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
