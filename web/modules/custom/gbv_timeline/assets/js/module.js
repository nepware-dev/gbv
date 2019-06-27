(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.loadTimeline = {
        attach: function (context, settings) {
            $('#timeline', context).once('loadTimeline').each(function () {
                let lastId,
                    sideMenu = $('#timeline'),
                    wrapper = $('#main-wrapper'),
                    topMenuHeight = 400,
                    dataTitles = wrapper.find('div[data-title]'),
                    dataItems = dataTitles.map(function () {
                        let title = $(this).attr('data-title');
                        let id = $(this).attr('id');
                        return {
                            title,
                            id,
                        };
                    });
                let i, content = [];
                for (i = 0; i < dataItems.length; i++) {
                    let sectionContent = '<li> <span class="circle"><span class="inner-circle"></span></span>';
                    sectionContent += '<a href= #' + dataItems[i].id + ' >' + dataItems[i].title + ' </a>';
                    sectionContent += '</li>';
                    content.push(sectionContent);
                }
                $('#timeline').html(content);

                // All list items
                let menuItems = sideMenu.find('a'),
                    // Anchors corresponding to menu items
                    scrollItems = menuItems.map(function () {
                        let item = $($(this).attr('href'));
                        if (item.length) { return item; }
                    });

                // Bind click handler to menu items
                // so we can get a fancy scroll animation
                menuItems.click(function (e) {
                    let href = $(this).attr('href'),
                        offsetTop = href === '#' ? 0 : $(href).offset().top - topMenuHeight + 1;
                    $('html, body').stop().animate({
                        scrollTop: offsetTop
                    }, 850);
                    e.preventDefault();
                });

                // call in first load
                onScroll();

                function hideIfFooterVisible() {
                    let footer = $('.site-footer')[0];
                    if(footer.offsetTop - window.innerHeight < $(window).scrollTop()) {
                        $('#timeline').hide();
                    } else {
                        $('#timeline').show();
                    }
                }

                function onScroll() {
                    // Get container scroll position
                    let fromTop = $(this).scrollTop() + topMenuHeight;

                    // Get id of current scroll item
                    let cur = scrollItems.map(function () {
                        if ($(this).offset().top < fromTop)
                            return this;
                    });
                    // Get the id of the current element
                    cur = cur[cur.length - 1];
                    let id = cur && cur.length ? cur[0].id : '';
                    if (lastId !== id) {
                        lastId = id;
                        // Set/remove active class
                        menuItems
                            .parent().removeClass('active')
                            .end().filter(`[href='#${id}']`).parent().addClass('active');
                    }
                    if(!id) {
                        menuItems.filter(`[href='#${lastId}']`).parent().removeClass('active');
                    }
                    hideIfFooterVisible();
                }
                // Bind to scroll
                $(window).scroll(onScroll);
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
