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

    let numbers = [];
    let countryNumbers = [];

  for (
    let i = 0;
    i < $(".key-figure-wrapper .view-content").children().length;
    i++
  ) {
    numbers.push(
      $(`.key-figure-wrapper .view-content .views-row:nth-child(${i + 1}) p`)
        .html()
        .match(/\d+/)
    );
  }

  for (
    let i = 0;
    i < $(".view-country-key-figures .view-content").children().length;
    i++
  ) {
    countryNumbers.push(
      $(`.view-country-key-figures .view-content .views-row:nth-child(${i + 1}) p`)
        .html()
        .match(/\d+/)
    );
  }

  for (
    let i = 0;
    i < $(".key-figure-wrapper .view-content").children().length;
    i++
  ) {
    let str = $(
      `.key-figure-wrapper .view-content .views-row:nth-child(${i + 1}) p`
    ).html();
    let newStr = str.replace(
      numbers[i],
      `<span class='counter' data-count=${numbers[i]}>${numbers[i]}</span>`
    );
    $(
      `.key-figure-wrapper .view-content .views-row:nth-child(${i + 1}) p`
    ).html(newStr);
  }

  for (
    let i = 0;
    i < $(".view-country-key-figures .view-content").children().length;
    i++
  ) {
    let str = $(
      `.view-country-key-figures .view-content .views-row:nth-child(${i + 1}) p`
    ).html();
    let newStr = str.replace(
      countryNumbers[i],
      `<span class='counter' data-count=${countryNumbers[i]}>${countryNumbers[i]}</span>`
    );
    $(
      `.view-country-key-figures .view-content .views-row:nth-child(${i + 1}) p`
    ).html(newStr);
  }

  function runCounter() {
    $(".count").each(function () {
      const This = $(this);
      This.text(0);
      $({ Count: This.text() }).animate(
        { Count: This.attr("data-count") },
        {
          duration: 2000,
          easing: "linear",
          step: function () {
            This.text(Math.floor(this.Count));
          },
          complete: function () {
            This.text(this.Count);
          },
        }
      );
    });
  }

  const counters = document.querySelectorAll(".counter");
  const options = { root: null, threshold: 0.5, rootMargin: "-50px" };

  const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("count");
      runCounter();
      observer.unobserve(entry.target);
    });
  }, options);

  counters.forEach((counter) => {
    observer.observe(counter);
  });

  $('.help-desk-slider-wrapper').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
})(jQuery, Drupal);
