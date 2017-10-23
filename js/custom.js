$( document ).ready(function() {

  $('.cta').click(function() {
    $('html, body').animate({
      scrollTop: ($('#test0').offset().top)
    },550);
  });

  // $('.menu-icon').click(function() {
  //   console.log('hello');
  //   $(this).toggleClass('highlight');
  // });
});
