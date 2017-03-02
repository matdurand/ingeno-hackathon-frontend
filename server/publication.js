import {Team} from '/imports/collection/Team'
import {TeamMember} from '/imports/collection/TeamMember'

Meteor.startup(() => {
    Meteor.publish('users', function () {
        return Meteor.users.find();
    });

    Meteor.publish('team', function () {
        return Team.find();
    });

    Meteor.publish('teamMember', function () {
        return TeamMember.find();
    });
});