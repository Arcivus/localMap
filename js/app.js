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
		self.names.push(marker);
		bindMarkerEvents(marker);

		event.preventDefault();
	});
	
	var bindMarkerEvents = function(marker){
		//Change marker title
		google.maps.event.addListener(marker, 'dblclick', function(point){
			var markerId = point.latLng.lat() + " " + point.latLng.lng();

			var markerNewTitle = window.prompt("Новое название:", marker.title);
			if(markerNewTitle != marker.title && markerNewTitle != null){

				marker.setTitle(markerNewTitle);

				self.names().forEach(function(oldInfo, i){
					if(oldInfo.id == markerId){

						self.names.replace(oldInfo, 
						{title : markerNewTitle, id : markerId, description : oldInfo.description});

						//send clicked marker info to the top of the list
						var makeFirst = self.names.splice(i, 1);
						self.names.unshift(makeFirst[0]);

					}; 
				});
			};
		});
		//Remove marker
		google.maps.event.addListener(marker, 'rightclick', function(point){
			var markerId = point.latLng.lat() + " " + point.latLng.lng();
			console.log(marker.description());
			self.names().forEach(function(markerInfo){
				if(markerInfo.id == markerId){
					if(confirm("Remove marker " + markerInfo.title + "?")){

						self.names.remove(function (item){return item.id == markerId});
						marker.setMap(null);

					};
				};

			});
		});
	};

};

ko.applyBindings(new ViewModel());





