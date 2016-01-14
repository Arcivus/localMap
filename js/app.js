
ko.bindingHandlers.editableText = {
    init: function(element, valueAccessor) {
        $(element).on('blur', function() {
            var observable = valueAccessor();
            observable( $(this).text() );
        });

    },
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).text(value);
    }
};

markers = [];

var ViewModel = function(){
	var self = this;
	var map;
	var myOptions = {
    	zoom: 17,
    	center: new google.maps.LatLng(59.957369, 30.307766),
    	mapTypeId: 'roadmap'
	};
	map = new google.maps.Map($('#mapDiv')[0], myOptions);


	var getPlace = function(lat, lng) {
    	return new google.maps.LatLng(lat, lng);
	};
	
	this.places = ko.observableArray([]);


	var addMarker = google.maps.event.addListener(map, 'dblclick', function(e){
		var lat = e.latLng.lat();
		var lng = e.latLng.lng();
		var marker = new google.maps.Marker({
			position : getPlace(lat, lng),
			map : map,
			title : "Title",
			description : ko.observable("Click to add description."),
			id : lat + " " + lng,
			imagePath : "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + lat + ", " + lng
		});
		markers.push(marker);
		self.places.push(marker);
		bindMarkerEvents(marker);

		event.preventDefault();

	});
	
	var bindMarkerEvents = function(marker){
		//Change marker title
		google.maps.event.addListener(marker, 'dblclick', function(point){
			var clickedMarkerId = point.latLng.lat() + " " + point.latLng.lng();

			var markerNewTitle = window.prompt("Новое название:", marker.title);
			if(markerNewTitle != marker.title && markerNewTitle != null){

				marker.setTitle(markerNewTitle);

				self.places().forEach(function(oldInfo){
					if(oldInfo.id == clickedMarkerId){

						self.places.replace(oldInfo, 
						{title : markerNewTitle, id : clickedMarkerId, description : oldInfo.description, imagePath : oldInfo.imagePath});

						markers.forEach(function(marker, i){
							if(marker.id == clickedMarkerId){
								markers[i].title = markerNewTitle;
							};
						});
					}; 
				});
			};
		});
		//Remove marker
		google.maps.event.addListener(marker, 'rightclick', function(point){
			var clickedMarkerId = point.latLng.lat() + " " + point.latLng.lng();
			self.places().forEach(function(markerInfo){
				if(markerInfo.id == clickedMarkerId){

					if(confirm("Remove marker " + markerInfo.title + "?")){

						self.places.remove(function (item){return item.id == clickedMarkerId});
						marker.setMap(null);
						markers.forEach(function(marker, i){
							if(marker.id == clickedMarkerId){
								markers.splice(i, 1);
							};
						});
					};
				};

			});
		});
		//Highlight marker
		google.maps.event.addListener(marker, 'click', function(point){
			var clickedMarkerId = point.latLng.lat() + " " + point.latLng.lng();
			self.places().forEach(function(markerInfo, i){
				if(markerInfo.id == clickedMarkerId){
					//send clicked marker info to the top of the list
					var makeFirst = self.places.splice(i, 1);
					self.places.unshift(makeFirst[0]);
				};
			});
			//set special icon for clicked marker
			markers.forEach(function(marker, i){
				marker.setIcon('http://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png');
				if(marker.id == clickedMarkerId){
					marker.setIcon('http://maps.google.com/mapfiles/marker_green.png');
				};
			});
		});		
	};

	var loadMarkers = function(){
		var restoredMarkers = JSON.parse(localStorage.getItem("markers"));
		restoredMarkers.forEach(function(oldmarker, i){
			var coords = oldmarker.id.split(" ");
			var lat = parseFloat(coords[0]);
			var lng = parseFloat(coords[1]);
			var marker = new google.maps.Marker({
				position : getPlace(lat, lng),
				map : map,
				title : oldmarker.title,
				description : ko.observable(oldmarker.description),
				id : lat + " " + lng,
				imagePath : "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + lat + ", " + lng
			});
			markers.push(marker);
			self.places.push(marker);
			bindMarkerEvents(marker);
		})

	};
	var temp = localStorage.getItem("markers");

	if(typeof temp !== 'undefined' && temp !== null ){
		loadMarkers();
	};


	//search and highlight specific titles

	var searchMarker = function(){

		var targetOfSearch = $("#searchInput").val().replace(/\s+/g, "").toLowerCase();
		$("#searchInput").val("");

		markers.forEach(function(marker, i){
			marker.setIcon('http://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png');
			if(targetOfSearch != "" && (markers[i].title.toLowerCase().indexOf(targetOfSearch) > -1)){
				marker.setIcon('http://maps.google.com/mapfiles/marker_green.png');
			};
		});

	};

	$("#searchButton").click(searchMarker);
	$("#searchBarInner").keyup(function(e){
		if(e.keyCode == 13){
			searchMarker();
		}
	});

	//save added markers

	$("#saveMarkers").click(function(){
		
		markers.forEach(function(marker){
			self.places().forEach(function(place){
				if(marker.id == place.id){
					//to solve problem with Knockout observable unwrapping multiple times in the same session
					if(typeof place.description === "string"){
						marker.description = place.description;
					}else{
						marker.description = place.description();
					};
				};
			});
		});
		
		localStorage["markers"] = JSON.stringify(markers, ['title', 'description', 'id']);
	});

};



ko.applyBindings(new ViewModel());





