import {HTTP} from 'meteor/http'

Meteor.startup(function () {
    Meteor.methods({
        'callApi': function (endpoint, callback) {
            var options = {
                timeout: 30000,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS'
                }
            };

            try {
                return HTTP.call("GET", endpoint, options, callback);
            } catch (e) {
                throw new Meteor.Error(500, e.toString(), 'the document is not found');
            }
        },
    });
});