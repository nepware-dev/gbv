(function ($) {
    
    toggleMainSection();
    $("#edit-field-tools-resources-type").change(function () {
        toggleMainSection();
    });

    function toggleMainSection()  {
        let selectedValues = $("#edit-field-tools-resources-type").val();
        if ($.inArray("24", selectedValues) !== -1 || $.inArray("25", selectedValues) !== -1 ) {
            $('#edit-field-section-wrapper').show();
        } else {
            $('#edit-field-section-wrapper').hide();
        }
    }
  })(jQuery);