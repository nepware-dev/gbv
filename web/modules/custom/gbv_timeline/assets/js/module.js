(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.loadTimeline = {
    attach(context, settings) {
      const timelineElement = once("loadTimeline", "#timeline", context);
      timelineElement.forEach(function () {
        let lastId;
        const sideMenu = $("#timeline");
        const wrapper = $("#main-wrapper");
        const thresholdHeight = screen.height / 2;
        const dataTitles = wrapper.find("div[data-title]");
        const maxoffsetTop = $("#content").offset().top;
        const minoffsetTop = screen.height * 0.08;
        const dataItems = dataTitles.map(function () {
          const title = $(this).attr("data-title");
          const id = $(this).attr("id");
          return {
            title,
            id,
          };
        });

        if (dataItems.length <= 1) {
          return;
        }

        let i;
        const content = [];
        for (i = 0; i < dataItems.length; i++) {
          let sectionContent =
            '<li> <span class="circle"><span class="inner-circle"></span></span>';
          sectionContent += `<a href= #${dataItems[i].id} >${
            dataItems[i].title
          } </a>`;
          sectionContent += "</li>";
          content.push(sectionContent);
        }
        $("#timeline").html(content);

        // All list items
        const menuItems = sideMenu.find("a");
        // Anchors corresponding to menu items
        const scrollItems = menuItems.map(function () {
          const item = $($(this).attr("href"));
          if (item.length) {
            return item;
          }
        });

        // Bind click handler to menu items
        // so we can get a fancy scroll animation
        menuItems.click(function (e) {
          const href = $(this).attr("href");
          const offsetTop = href === "#" ? 0 : $(href).offset().top;
          $("html, body").stop().animate(
            {
              scrollTop: offsetTop,
            },
            850,
          );
          e.preventDefault();
        });

        // call in first load
        onScroll();

        function hideIfFooterVisible() {
          const footer = $(".site-footer");

          if (footer.offset().top < sideMenu.offset().top + sideMenu.height()) {
            $("#timeline").css({
              visibility: "hidden",
              opacity: 0,
            });
          } else {
            $("#timeline").css({
              visibility: "visible",
              opacity: 1,
            });
          }
        }

        function onScroll() {
          const offsetTop = maxoffsetTop - window.pageYOffset;
          if ((offsetTop >= minoffsetTop) & (offsetTop <= maxoffsetTop)) {
            $("#timeline").css({ top: offsetTop });
          } else if (offsetTop < minoffsetTop) {
            // when scroll page is refreshed
            $("#timeline").css({ top: minoffsetTop });
          }

          // Get container scroll position
          const fromTop = $(this).scrollTop() + thresholdHeight;

          // Get id of current scroll item
          let cur = scrollItems.map(function () {
            if ($(this).offset().top < fromTop) return this;
          });

          // Get the id of the current element
          cur = cur[cur.length - 1];
          const id = cur && cur.length ? cur[0].id : "";
          if (lastId !== id) {
            lastId = id;
            // Set/remove active class
            menuItems
              .parent()
              .removeClass("active")
              .end()
              .filter(`[href='#${id}']`)
              .parent()
              .addClass("active");
          }
          if (!id) {
            menuItems
              .filter(`[href='#${lastId}']`)
              .parent()
              .removeClass("active");
          }
          hideIfFooterVisible();
        }
        // Bind to scroll
        $(window).scroll(onScroll);
      });
    },
  };
})(jQuery, Drupal, drupalSettings);
