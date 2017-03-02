window.onload = function() {
	var list = document.getElementsByClassName("change-page");
	for(var i = 0; i < list.length; i++) {
		list[i].onclick = linkPage;		
	}
	$("#view-port").load("home.html");	
	$("#fade-in").hide().fadeIn(2500);

}

function linkPage() {	
	// get the target div
	$("#view-port").load($(this).attr("title") + ".html");
}
