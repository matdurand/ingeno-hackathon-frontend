const MAP_ZOOM = 19;

Template.mainPage.onCreated(function helloOnCreated() {
    var self = this;
    var positionOverriden = false;

    GoogleMaps.ready('map', function(map) {
        var marker;

        var noPoi = [
            {
                featureType: "poi",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];
        map.instance.setOptions({styles: noPoi});

        // add a click event handler to the map object
        google.maps.event.addListener(map.instance, "click", function(event) {
            marker.setPosition(event.latLng);
            positionOverriden = true;
        });

        // Create and move the marker when latLng changes.
        self.autorun(function() {
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

Template.mainPage.helpers({
    geolocationError: function() {
        var error = Geolocation.error();
        return error && error.message;
    },
    mapOptions: function() {
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