import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const Team = new Mongo.Collection('team');
/*
 Team.allow({
 insert: function (userId, doc) {
 return true;
 }

 });*/

TeamSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    endpoint: {
        type: String,
        label: "Endpoint",
        optional: true
    },
    userIds: {
        type: [String],
        optional: true,
        autoform: {
            type: "hidden"
        }
    }
});

Team.attachSchema(TeamSchema);