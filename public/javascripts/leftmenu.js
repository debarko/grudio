var clicked = true;

$("#playpause").click( function() {
  if (clicked) {
    $(".bar").addClass("noAnim");
    clicked = false;
  } else {
    $(".bar").removeClass("noAnim");
    clicked = true;
  }
});