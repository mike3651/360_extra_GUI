(function() {
	// this keeps track of all the JSON objects that we currently have
	JSON_OBJECTS_USERS = [];
	JSON_OBJECTS_SHOPS = [];

	// checks to see if we can generate a map
	var map_okay = true;
	var container_made = false;

	// creates a psuedo message class
	var coffee_shop = function() {
		name = "",
		owner = "",
		employees = [];
		address = "",
		phone = "",
		update = function(employee) {
			employees.push(employee);
		}
	}

	// creates a psuedo message class
	var employee = function() {
		name = "",
		business_affiliations = [],
		phone = "",
		update = function(business) {
			business_affiliations.push(business);
		}
	}

	// creates a psuedo message class
	var message = function() {
		person = "",
		date = "",
		message = ""
		update = function(new_message) {
			message = new_message;
		}			
	}

	window.onload = function() {
		var list = document.getElementsByClassName("change-page");
		for(var i = 0; i < list.length; i++) {
			list[i].onclick = linkPage;		
		}
		$("#view-port").load("home.html");		
		$("#fade-in").hide().fadeIn(2500);		

		$("body").bind("DOMSubtreeModified", function() {
			var forms = document.getElementsByTagName("form");
			for(var i = 0; i < forms.length; i++) {
				$(forms[i]).submit(function(e) {
					e.preventDefault();
					getInformation(this.id);
					console.log("form submitted");		
			});
			}		
		});
		// $("form").submit(function(e) {
		// 	alert("here");
		// 	e.preventDefault();
		// 	getInformation();
		// });
		$("#get-user-message-data").click(function() {			
			getMessages();
		});	

		$("#get-JSON").click(function(){
			getStarted();
		});
	}

	function getStarted() {
		alert("here");
		var ajax = new XMLHttpRequest();
		ajax.onload = getJSON;
		ajax.open("GET", "https://gentle-coast-59786.herokuapp.com/tcss360/coffeeShop/api/shops", false);
		ajax.send();
	}

	function getJSON() {
		alert(this.status);
	}


	function linkPage() {	
		// get the target div
		$("#view-port").load($(this).attr("title") + ".html");	
	}

	// function that extracts information from the form field
	function getInformation(form_type) {	
		var object = {};
				
		
		$("form :input").each(function() {
			var title = $(this).attr("title");		
			var input = $(this).val();	
			if(typeof title !== "undefined") {
				object[title] = input;
			}
		});

		if(form_type == "shop") {
			JSON_OBJECTS_SHOPS.push(object);
		} else if (form_type == "user") {
			JSON_OBJECTS_USERS.push(object);
		}


		if(form_type == "user") {	
			// for the geo location using google's api
			// var geocoder = new google.maps.Geocoder();		
			
			if(!container_made) {
				// create the container object
				var container = document.createElement("div");
				container.innerHTML = object["Name"];
				container.className = "shop col-sm-4";
				container.id = "business" + JSON_OBJECTS_SHOPS.length;
			}

			// create the map object
			var map = document.createElement("div");			
			map.id = "mapid" + JSON_OBJECTS_SHOPS.length;		
	 
			$("#business" + JSON_OBJECTS_SHOPS.length).append(map);
			$("#test").append(container);	
			alert(JSON_OBJECTS_SHOPS.length);
			for(var i = 0; JSON_OBJECTS_SHOPS.length; i++) {
				// THIS IS THE SWEET STUFF
				var ajax = new XMLHttpRequest();
				ajax.onload = createMap;
				ajax.open("GET", "http://maps.googleapis.com/maps/api/geocode/json?address=" 
					+ JSON_OBJECTS_SHOPS[i]["ZIP code"]+ "&sensor=true", false);
				ajax.send();	
			}
		}
				
	}

	function getMessages() {
		// clear the data table
		$("#table-data").html("");
		// this is where I will generate a table
		var table = document.createElement("table");
		var tr = document.createElement("tr");
		var th = document.createElement("th");
		th.innerHTML = "name";
		var th2 = document.createElement("th");
		th2.innerHTML = "message";
		$(tr).append(th);
		$(tr).append(th2);
		$(table).append(tr);
		for(var i = 0; i < JSON_OBJECTS_SHOPS.length; i++) {
			var tr1 = document.createElement("tr");
			var th1 = document.createElement("th");
			th1.innerHTML = JSON_OBJECTS[i]["Name"];			

			var th2 = document.createElement("th");
			th2.innerHTML = JSON_OBJECTS_SHOPS[i]["Message"];
			$(tr1).append(th1);
			$(tr1).append(th2);
			$(table).append(tr1);
		}
		$("#table-data").append(table);
	}

	// validates information from the json object
	function createMap() {				
		var data = JSON.parse(this.responseText);
		// console.log(data);

		// get the locations		
		var lat = data["results"][0].geometry.bounds.northeast["lat"];
		var lng = data["results"][0].geometry.bounds.northeast["lng"];
		console.log($("#mapid" + JSON_OBJECTS_SHOPS.length));
		// stylistics of the map
		var myMap = L.map("mapid" + JSON_OBJECTS_SHOPS.length).setView([lat, lng], 13);
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(myMap);

		// adds a marker to the map
		var marker = L.marker([lat, lng]).addTo(myMap);		
		$("#mapid" + JSON_OBJECTS_SHOPS.length).append(myMap);	
		// map_okay = true;
		// console.log("map status: " + map_okay);	
	}
})();
