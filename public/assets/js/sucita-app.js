"use strict";

(function ($) {
  $(window).on("ready", function () {
    $("#preloader").delay(200).fadeOut("fade");
  });

  // Sticky header on scroll
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 0) {
      $(".main-header-menu-wrap").addClass("affix");
      $(".scroll-to-target").addClass("open");
    } else {
      $(".main-header-menu-wrap").removeClass("affix");
      $(".scroll-to-target").removeClass("open");
    }

    if ($(this).scrollTop() > 500) {
      $(".scroll-to-target").addClass("open");
    } else {
      $(".scroll-to-target").removeClass("open");
    }
  });

  // Scroll to top
  if ($(".scroll-to-target").length) {
    $(".scroll-to-target").on("click", function () {
      var target = $(this).attr("data-target");
      $("html, body").animate({ scrollTop: $(target).offset().top }, 500);
    });
  }

  // Bootstrap tooltips (if used)
  $(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
  });
})(jQuery);
