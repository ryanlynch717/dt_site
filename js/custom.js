$( document ).ready(function() {

  $('.cta').click(function() {
    $('html, body').animate({
      scrollTop: ($('#test0').offset().top)
    },550);
  });

  $('.submit-contact-button').click(function() {
    // Validate input is not empty

  });

});
