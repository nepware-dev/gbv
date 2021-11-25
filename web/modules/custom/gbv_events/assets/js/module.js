(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.loadCalendar = {
        attach: function (context, settings) {
            $('#calendar', context).once('loadCalendar').each( function () {
                if(!document.getElementById('calendar').hasChildNodes()) {
                    let calendarEvents = JSON.parse(drupalSettings.calendarEvents);
                    $('#calendar').fullCalendar({
                        defaultView: 'listMonth',
                        header: {
                            left: 'prev,next,today',
                            center: 'title',
                            right: 'listMonth,month,agendaWeek,agendaDay'
                        },
                        navLinks: true, // can click day/week names to navigate views
                        editable: true,
                        eventLimit: true, // allow "more" link when too many events
                        events: calendarEvents,
                        eventRender: function(event, element) {
                            let title = event.title,
                                body = event.body,
                                dateContent = event.dateContent,
                                uri = (event.uri)?event.uri.uri:null,
                                buttonTitle = (event.uri)?event.uri.title:null;
                            let innerContent = '<div class="event-header"><h5>'+title+'</h5>'+
                            '<a class="close-popover" href="javascript:onclick=alert('+'"test"'+')");">&times;</a></div>';
                            innerContent += '<p class="event-date">'+dateContent+'</p>';
                            innerContent += '<div class="event-body">'+body+'</div>';
                            if (uri) {
                                innerContent += '<div class="col-12 nopadding event-footer">'+
                                                '<div class="row">'+
                                                    '<div class="col-8 content-left">'+
                                                    '</div>'+
                                                    '<div class="col-4 nopadding content-right">'+
                                                      '<div class="btn-contained">'+
                                                        '<a href="'+uri+'" target="_blank">'+buttonTitle+
                                                          '<i style="font-size:16px" class="fa fa-external-link"></i>'+
                                                        '</a>'+
                                                      '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>';
                            }
                            setTimeout(function() {
                              jQuery(element).popover({
                                animation: true,
                                trigger: 'click',
                                content: innerContent,
                                placement: 'top',
                                html: true,
                              });
                              element.addClass('event-popover');
                            }, 5000);
                        },
                    });
                }

                $(document).click(function (e) {
                    if (($('.popover').has(e.target).length === 0) || !$(e.target).is('.close-popover')) {
                        $('.event-popover').popover('hide');
                    }
                });

                $(document).on('click', '.event-popover', function(e) {
                    e.stopPropagation();
                    let btns = document.getElementsByClassName('close-popover');
                    for (let i=0; i < btns.length; i++) {
                        btns[i].onclick = function() { $('.event-popover').popover('hide'); };
                    }

                });

                $('#calendar').on('click', 'button', function(e) {
                    $('.popover').hide();
                });
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
