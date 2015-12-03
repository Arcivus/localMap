var ViewModel = function(){
	var self = this;

	self.localMap = ko.observable({
		lat : ko.observable(59.957369),
		lng : ko.observable(30.307766)
	});
};




ko.bindingHandlers.map = {

	init : function(element, valueAccessor, allBindingsAccessor) {
		var	mapObj = ko.utils.unwrapObservable(valueAccessor());
		var latLng = new google.maps.LatLng(
			ko.utils.unwrapObservable(mapObj.lat),
			ko.utils.unwrapObservable(mapObj.lng));
		var mapOptions = {
			 center : latLng,
			 zoom : 17,
			 mapTypeId : google.maps.MapTypeId.ROADMAP
		};

		mapObj.googleMap = new google.maps.Map(element, mapOptions);

		mapObj.addMarker = google.maps.event.addListener(mapObj.googleMap, 'dblclick', function(e){
			var lat = e.latLng.lat();
			var lng = e.latLng.lng();
			var marker = new google.maps.Marker({
				position : new google.maps.LatLng(lat, lng),
				map : mapObj.googleMap,
				dragable : true,
				title : "message here",
			});

			var infowindow = new google.maps.InfoWindow({
				content : "Here's Johnny!!!"
			});

			marker.addListener('click', function(){
				infowindow.open(mapObj.googleMap, marker);
			});



			event.preventDefault();
    });  
	}
};

ko.applyBindings(new ViewModel());





