var $ = jQuery;

( function( $ ) {
  var Neu = Neu || {};

  $.fn.categorySlider = function(options) {
      return this.each(function() {
          var categorySlider = Object.create(Neu.categorySlider);
          categorySlider.init(this, options);
      });
  };

  $.fn.categorySlider.options = {
      categoryItem: ".category li",
  };

  Neu.categorySlider = {
    init: function(elem, options) {
        var self = this;
        self.$container = $(elem);
        self.options = $.extend({}, $.fn.categorySlider.options, options);
        self.bindElements();
        self.bindEvents();
        self.categorySlider();
    },
    bindElements: function() {
      var self = this;

      self.$categoryItem = self.$container.find(self.options.categoryItem);
    },
    bindEvents: function() {
      var self = this;

      $(document).ready( function() {
      });
    },
    categorySlider: function() {
      var self = this;

      self.$categoryItem.each( function() {
        var prev;
        var next;
        if ($(this).is(":first-child")) {
          prev = $(".category li:last-child");
        } else {
          prev = $(this).prev();
        }

        if ($(this).is(":last-child")) {
          next = $(".category li:first-child");
        } else {
          next = $(this).next();
        }

        var prevCat = prev.children(".category-title").text();
        var prevId = prev.attr("id");
        var nextCat = next.children(".category-title").text();
        var nextId = next.attr("id");

        $(this).append("<button id='" + prevId + "' class='category-prev'>" + prevCat + "</button><button id='" + nextId + "' class='category-next'>" + nextCat + "</button>")
      });

      var prevButton = $(".category-prev");
      var nextButton = $(".category-next");

      prevButton.click( function() {
        var btnId = $(this).attr("id");
        self.$categoryItem.removeClass("visible");
        self.$categoryItem.each( function() {
          var introCat = $(this).attr("id");
          if (btnId === introCat) {
            $(this).addClass("visible");
          }
        })
      });

      nextButton.click( function() {
        var btnId = $(this).attr("id");
        self.$categoryItem.removeClass("visible");
        self.$categoryItem.each( function() {
          var introCat = $(this).attr("id");
          if (btnId === introCat) {
            $(this).addClass("visible");
          }
        })
      });
    },
  };

}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".yir-wrapper").categorySlider();
  });
})();
