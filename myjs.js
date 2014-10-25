var map;
var places;
var myPlaces;
function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(42.4055470, -71.1238240)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
    setupMap();
}

google.maps.event.addDomListener(window, 'load', initialize);


function setupMap()
{
	var latlng = new google.maps.LatLng(42.4055470, -71.1238240);
	var request = {
			location: latlng,
			radius: '500',
			types: ['food']
			};
	service = new google.maps.places.PlacesService(map);
	service.search(request, callback);
}
// Taken from http://code.google.com/apis/maps/documentation/javascript/places.html
function callback(results, status)
{
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		alert("Got places back!");
		places = results;
		console.log("testing status");
		for (var i = 0; i < 6; i++) {
			console.log(results[i]);
			createMarker(results[i]);
			console.log("created an marker");
			

		}
	}
	
}
function createMarker(place)
{
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.close();
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
				
var reqq = new XMLHttpRequest;
url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&js?sensor=true&amp;libraries=places"

reqq.open ("GET", url, true);


}


