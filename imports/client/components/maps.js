import "./maps.html";
import {framework7} from "../../../client/main";
import {ReactiveVar} from 'meteor/reactive-var'

var GJV = require("geojson-validation");

const MAP_ZOOM = 16;

Template.maps.events({
    'submit #endpointForm'(event){
        event.preventDefault();
        $('#submit-endpoint').prop('disabled', true);

        let template = Template.instance();
        let endpoint = document.getElementById('endpointInput').value;

        map = template.mapInstance.get();
        removePreviousData(map);

        $('#loader').toggle("slide");


        Meteor.call('callApi', endpoint, function (error, result) {
            if (!error) {
                if (validateGeoJson(result.data)) {
                    map.instance.data.addGeoJson(result.data);
                }
            } else {
                printErrorModal(error);
            }

            $('#loader').toggle("slide");
            $('#submit-endpoint').prop('disabled', false);
        });
    }
});

Template.maps.onCreated(function helloOnCreated() {
    var self = this;

    self.mapInstance = new ReactiveVar;

    GoogleMaps.ready('map', function (map) {
        var infowindow = new google.maps.InfoWindow();

        var noPoi = [
            {
                featureType: "poi",
                stylers: [
                    {visibility: "off"}
                ]
            }
        ];
        map.instance.setOptions({styles: noPoi, maxZoom: 16});

        var bounds = new google.maps.LatLngBounds();
        map.instance.data.addListener('addfeature', function (e) {

            processPoints(e.feature.getGeometry(), bounds.extend, bounds);
            map.instance.fitBounds(bounds);

            map.instance.data.addListener('click', function (event) {

                if (event.feature.getGeometry().getType() !== 'Polygon') {
                    var myHtml = "";

                    for (var prop in event.feature['f']) {
                        myHtml = myHtml.concat('<tr class="style-row"><th>' + prop + '</th><td>' + event.feature['f'][prop] + '</td></tr>');
                    }

                    infowindow.setContent('<table><tbody>' + myHtml + '</tbody></table>');
                    infowindow.setPosition(event.feature.getGeometry().get());
                    infowindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
                    infowindow.open(map, this);
                }
            });
        });

        self.mapInstance.set(map);
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

function removePreviousData(map) {
    if (map.instance.data) {
        map.instance.data.forEach(function (feature) {
            map.instance.data.remove(feature);
        });
    }
}

function validateGeoJson(data) {
    return GJV.valid(data, function (valid, errs) {
        if (!valid) {
            let error = {};
            error.stack = "";
            error.reason = "Invalid Geo Json";
            for (var err in errs) {
                error.stack = error.stack.concat("\n" + errs[err]);
            }
            printErrorModal(error);
        }
        return valid;
    });
}
