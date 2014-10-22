map.js

var myLat;
var myLng;
var myLoc = new google.maps.LatLng(myLat, myLng);
var infowindow = new google.maps.InfoWindow();
var request =  new XMLHttpRequest();
var mapOptions = {
          center: { lat: cred.latitude, lng: cred.longitude},
          zoom: 16
};
var response;
var map;
var markerArray = [];
var markerCArray = [];

function initialize () {
	 map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
	 getmylocation();
}

function getmylocation(){
 if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                        myLat = position.coords.latitude;
                        myLng = position.coords.longitude;
                        drawMap();
                });
        }
        else {
                alert("Geolocation is not supported by your web browser.  Upgrade required");
        }
}

function drawMap() //fills map, marks self with infowindow
{
        
        me = new google.maps.LatLng(myLat, myLng);        
        var userIcon = {
                url: 'ele.jpeg',
        };
        var userMarker = new google.maps.Marker({
                position: me,
                title: "User",
                icon: userIcon.url
        });
        userMarker.setMap(map);

        var myContent = '<b>' + userMarker.title + '<br></b>' +
                        '<p><b> Lat: </b>' + myLat + '<br>' +
                        '<b>Lng: </b>' + myLng + '</p>';
        var myWindow = new google.maps.InfoWindow({
                content: myContent
        });
        google.maps.event.addListener(myMarker, 'click', function() {
                myWindow.open(map, myMarker);
        });
        getStudents();
}

function getStudents() { //mingles with api, 
        var xhr = new XMLHttpRequest();
        http.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                        var studentList = JSON.parse(xhr.responseText);
                        loopMarkers(studentList);
                        loopDrawChars(studentList);
                }
        }
        //var url = "http://chickenofthesea.herokuapp.com/sendLocation";
        var params = "login=" + "SnowWhite" + "&lat="+ String(myLat) + "&lng=" + String(myLng);
        xhr.open("POST", "http://chickenofthesea.herokuapp.com/sendLocation", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
        
}

function loopMarkers(studentList) { //places fucntion call to make markers for each char and stud, with imges for chars
        var numChars = studentList.characters.length;
        var numStuds = studentList.students.length;
   
        for (var i = 0; i < numChars; i++) {
                image = url: String(studentList.characters[i].name) + '.jpg';
                makeMarker(studentList.characters[i].loc.latitude, 
                           studentList.characters[i].loc.longitude, 
                           studentList.characters[i].name,
                           image);
        }
      
        for (var j = 0; j < numStuds; j++) {
                makeStudentMarker(studentList.students[j].lat,
                           studentList.students[j].lng,
                           studentList.students[j].login,
                           studentList.students[j].created_at);
        }
}

function makeMarker(lat, lng, title, image) //creates marker and window for entered char
{
        
        var cCoords = new google.maps.LatLng(lat, lng);
        var cMarker;

        renderLine(cCoords);
        cMarker = new google.maps.Marker({
                position: cCoords,
                title: title,
                icon: image.url
        });
        cMarker.setMap(map);
                
        var cContent = '<h1>' + title + '<br></h1>' +
                        '<p><b> Lat: </b>' + lat + '<br>' +
                        '<b>Lng: </b>' + lng + '</p>';
        var cWindow = new google.maps.InfoWindow({
                content: cContent
        });
        google.maps.event.addListener(cMarker, 'click', function() {
                cWindow.open(map, cMarker);
        });
}

function makeStudentMarker(lat, lng, title, timestamp)// same as makeMarker but for students
{
        var sCoords = new google.maps.LatLng(lat, lng);
        var sMarker;

        
        sMarker = new google.maps.Marker({
                position: sCoords,
                title: title,
        });
        sMarker.setMap(map);

        
        var sContent = '<h1>' + title + '<br></h1>' +
                        '<p><b> Lat: </b>' + lat + '<br>' +
                        '<b>Lng: </b>' + lng + '</p>';
        var sWindow = new google.maps.InfoWindow({
                content: sContent
        });
        google.maps.event.addListener(sMarker, 'click', function() {
                sWindow.close();
                sWindow.open(map, sMarker);
        });
}

function loopDrawChars(studentList) //draws dem polylines and also shoots html with miles distances
{
        var modHTML = "<p> Distances </p><br>";
        var mod = "";
        var numCharacters = studentList.characters.length;

        for (var k = 0; k < numCharacters; k++) {
                mod = "<p> Char: " + studentList.characters[k].name + "<br> " +
                             "Distance: " + haversineFormula(studentList.characters[k].loc.latitude,
                                                             studentList.characters[k].loc.longitude)
                             + " Miles </p>";
                modHTML += mod;
                mod = "";
       


        }
        document.getElementById("DistanceDisplay").innerHTML = modHTML;
        
}

function renderLine(pathCoords)
{
        var line = [
                pathCoords,
                me
        ];
        var pathToTarget= new google.maps.Polyline({
                path: line,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        pathToTarget.setMap(map);
}


function haversineFormula(lat, lng)
{
        Number.prototype.toRad = function() {
                return this * Math.PI / 180;
        }

        var R = 6371; // km

        var x1 = myLat - lat;
        var dLat = x1.toRad();
        var x2 = myLng - lng;
        var dLng = x2.toRad();

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat.toRad()) * Math.cos(myLat.toRad()) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        //convert the R to miles
        return R * c *0.6213;
}