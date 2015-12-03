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
	this.name = ko.observable("Johnny");
	this.information = ko.observable("Hello there");

	var addMarker = google.maps.event.addListener(map, 'dblclick', function(e){
		var lat = e.latLng.lat();
		var lng = e.latLng.lng();
		var marker = new google.maps.Marker({
			position : getPlace(lat, lng),
			map : map,
			title : self.name(),
			draggable : true
		});
	});


};



ko.applyBindings(new ViewModel());





