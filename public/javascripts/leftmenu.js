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

function getCategoryList(callback){
	$.ajax({
		url:"http://localhost:8989/category",
		type:"GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		cache: false,
		success: function(data){
			callback(null, data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			callback('err');
			//console.log(textStatus);
			//console.log(XMLHttpRequest);
			//alert("Status: " + textStatus);
			//alert("Error: " + errorThrown);
		}
	});
}

function updateCategoryList(){
	getCategoryList(function(err, data){
		
	});
}