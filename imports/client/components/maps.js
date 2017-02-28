import "./maps.html";
import {framework7} from "../../../client/main";
import {ReactiveVar} from 'meteor/reactive-var'

const MAP_ZOOM = 19;


Template.maps.events({
    'submit #endpointForm'(event){
        event.preventDefault();

        let template = Template.instance();
        let endpoint = document.getElementById('endpointInput').value;

        map = template.mapInstance.get();

        Meteor.call('callApi', endpoint, function (error, result) {
            if (!error) {
                map.instance.data.addGeoJson(result.data);
            } else {
                printErrorModal(error);
            }
        });
    }
});

Template.maps.onCreated(function helloOnCreated() {
    var self = this;
    var positionOverriden = false;

    self.mapInstance = new ReactiveVar;

    GoogleMaps.ready('map', function (map) {
        var marker;

        var noPoi = [
            {
                featureType: "poi",
                stylers: [
                    {visibility: "off"}
                ]
            }
        ];
        map.instance.setOptions({styles: noPoi});

        var bounds = new google.maps.LatLngBounds();
        map.instance.data.addListener('addfeature', function (e) {
            processPoints(e.feature.getGeometry(), bounds.extend, bounds);
            processPoints(marker.getPosition(), bounds.extend, bounds);
            map.instance.fitBounds(bounds);
        });

        // add a click event handler to the map object
        google.maps.event.addListener(map.instance, "click", function (event) {
            marker.setPosition(event.latLng);
            positionOverriden = true;
        });

        self.mapInstance.set(map);
        // Create and move the marker when latLng changes.
        self.autorun(function () {
            if (!positionOverriden) {
                var latLng = Geolocation.latLng();
                if (!latLng)
                    return;

                // If the marker doesn't yet exist, create it.
                if (!marker) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(latLng.lat, latLng.lng),
                        map: map.instance
                    });
                }
                // The marker already exists, so we'll just change its position.
                else {
                    marker.setPosition(latLng);
                }

                // Center and zoom the map view onto the current position.
                map.instance.setCenter(marker.getPosition());
                map.instance.setZoom(MAP_ZOOM);
            }
        });
    });
});

Template.maps.helpers({
    geolocationError: function () {
        var error = Geolocation.error();
        return error && error.message;
    },
    mapOptions: function () {
        var latLng = Geolocation.latLng();
        // Initialize the map once we have the latLng.
        if (GoogleMaps.loaded() && latLng) {
            return {
                center: new google.maps.LatLng(latLng.lat, latLng.lng),
                zoom: MAP_ZOOM
            };
        }
    }
});

function findLocationInformation(lngLat) {
    $.ajax({
        url: url,
        data: data,
        success: success,
        dataType: dataType
    });
}

function processPoints(geometry, callback, thisArg) {
    if (geometry instanceof google.maps.LatLng) {
        callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
        callback.call(thisArg, geometry.get());
    } else {
        geometry.getArray().forEach(function (g) {
            processPoints(g, callback, thisArg);
        });
    }
}

function printErrorModal(error) {
    framework7.modal({
        title: 'Error occur',
        text: '<div>' +
        '<div>Error while getting output from endpoint <br/>' + error.reason + '</div>' +
        '<div><pre>' + error.stack + '</pre></div>' +
        '</div>',
        buttons: [
            {
                text: 'Ok, got it',
                bold: true
            },
        ]
    })
    $('.modal').addClass('error')
}