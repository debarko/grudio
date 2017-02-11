var clicked = true;

$(".bar-c").click( function() {
  if (clicked) {
    $(".bar").addClass("noAnim");
    clicked = false;
  } else {
    $(".bar").removeClass("noAnim");
    clicked = true;
  }
});