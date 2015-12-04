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
	
	this.names = ko.observableArray([]);





	var addMarker = google.maps.event.addListener(map, 'dblclick', function(e){
		var lat = e.latLng.lat();
		var lng = e.latLng.lng();
		var marker = new google.maps.Marker({
			position : getPlace(lat, lng),
			map : map,
			title : "Title",
			description : ko.observable("description goes here..."),
			id : lat + " " + lng,

		});
		markers.push(marker);
		self.names.push(marker);
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

				self.names().forEach(function(oldInfo){
					if(oldInfo.id == clickedMarkerId){

						self.names.replace(oldInfo, 
						{title : markerNewTitle, id : clickedMarkerId, description : oldInfo.description});



					}; 
				});
			};
		});
		//Remove marker
		google.maps.event.addListener(marker, 'rightclick', function(point){
			var clickedMarkerId = point.latLng.lat() + " " + point.latLng.lng();
			self.names().forEach(function(markerInfo){
				if(markerInfo.id == clickedMarkerId){

					if(confirm("Remove marker " + markerInfo.title + "?")){

						self.names.remove(function (item){return item.id == clickedMarkerId});
						marker.setMap(null);

					};
				};

			});
		});
		//Highlight marker
		google.maps.event.addListener(marker, 'click', function(point){
			var clickedMarkerId = point.latLng.lat() + " " + point.latLng.lng();
			self.names().forEach(function(markerInfo, i){
				if(markerInfo.id == clickedMarkerId){
					//send clicked marker info to the top of the list
					var makeFirst = self.names.splice(i, 1);
					self.names.unshift(makeFirst[0]);
				};
			});
			//set special icon for clicked marker
			markers.forEach(function(marker, i){
				marker.setIcon('http://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png');
				if(marker.id == clickedMarkerId){
					marker.setIcon('http://maps.google.com/mapfiles/marker_green.png');
				}
			})
		});
	};

};

ko.applyBindings(new ViewModel());





