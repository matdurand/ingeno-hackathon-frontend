import "./maps.html";
import {framework7} from "../../../client/main";
import {ReactiveVar} from 'meteor/reactive-var';
import {Team} from '/imports/collection/Team';
import {TeamMember} from '/imports/collection/TeamMember';

var GJV = require("geojson-validation");

const MAP_ZOOM = 16;

Template.maps.events({
    'submit #endpointForm'(event){
        event.preventDefault();
        $('#submit-endpoint').prop('disabled', true);

        let template = Template.instance();
        let endpoint = document.getElementById('endpoint-select').value;
        let route = document.getElementById('route-select').value;
        let param = document.getElementById('param-input').value;

        let url = endpoint + route + param;
        map = template.mapInstance.get();
        removePreviousData(map);

        $('#loader').toggle("slide");


        Meteor.call('callApi', url, function (error, result) {
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
    Meteor.subscribe('team');
    this.memberHandle = Meteor.subscribe('teamMember');
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
    mapOptions: function () {
        // Initialize the map once we have the latLng.
        if (GoogleMaps.loaded()) {
            return {
                center: new google.maps.LatLng(46.813485, -71.225486),
                zoom: MAP_ZOOM
            };
        }
    },
    teams: function () {
        var self = Template.instance();
        if (self.memberHandle.ready()) {
            let currentUser = TeamMember.findOne({"member.userId": Meteor.userId()});
            if (currentUser.isAdmin) {
                return Team.find({});
            } else {
                return Team.find({userIds: Meteor.userId()});
            }
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
        title: 'An error occur',
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
