(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.loadTimeline = {
        attach: function (context, settings) {
            $('#timeline', context).once('loadTimeline').each(function () {
                setTimeout(function () {
                    var lastId,
                        sideMenu = $("#timeline"),
                        wrapper = $("#main-wrapper"),
                        topMenuHeight = 400,

                        dataTitles = wrapper.find("div[data-title]"),

                        dataItems = dataTitles.map(function () {
                            var title = $(this).attr("data-title");
                            var id = $(this).attr("id");
                            var obj = {
                                title: title,
                                id: id,
                            };
                            return obj;
                        });
                    var i;
                    const content = []
                    for (i = 0; i < dataItems.length; i++) {
                        var sectionContent = '<li> <span class="circle"><span class="inner-circle"></span></span>';
                        sectionContent += '<a href= #' + dataItems[i].id + ' >' + dataItems[i].title + ' </a>';
                        sectionContent += '</li>';
                        content.push(sectionContent);
                    }
                    $('#timeline').html(content);

                    // All list items
                    menuItems = sideMenu.find("a"),
                        // Anchors corresponding to menu items
                        scrollItems = menuItems.map(function () {
                            var item = $($(this).attr("href"));
                            if (item.length) { return item; }
                        });

                    // Bind click handler to menu items
                    // so we can get a fancy scroll animation
                    menuItems.click(function (e) {
                        var href = $(this).attr("href"),
                            offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
                        $('html, body').stop().animate({
                            scrollTop: offsetTop
                        }, 850);
                        e.preventDefault();
                    });

                    // Bind to scroll
                    $(window).scroll(function () {
                        // Get container scroll position
                        var fromTop = $(this).scrollTop() + topMenuHeight;

                        // Get id of current scroll item
                        var cur = scrollItems.map(function () {
                            if ($(this).offset().top < fromTop)
                                return this;
                        });
                        // Get the id of the current element
                        cur = cur[cur.length - 1];
                        var id = cur && cur.length ? cur[0].id : "";
                        if (lastId !== id) {
                            lastId = id;
                            // Set/remove active class
                            menuItems
                                .parent().removeClass("active")
                                .end().filter("[href='#" + id + "']").parent().addClass("active");
                        }
                    });
                }, 3000);
            });
        }
    }
})(jQuery, Drupal, drupalSettings);