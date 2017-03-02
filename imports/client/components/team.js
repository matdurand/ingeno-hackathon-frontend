import "./team.html";
import {Team} from "/imports/collection/Team"
import {TeamMember} from "/imports/collection/TeamMember"

Template.team.onCreated(function () {
    Meteor.subscribe('team');
    this.memberHandle = Meteor.subscribe('teamMember');
});

Template.team.helpers({
    teams: ()=> {
        var self = Template.instance();
        if (self.memberHandle.ready()) {
            let currentUser = TeamMember.findOne({"member.userId": Meteor.userId()});
            if (currentUser.isAdmin) {
                return Team.find({});
            } else {
                return Team.find({userIds: Meteor.userId()});
            }
        }
    },
    members: function (memberIds) {
        var self = Template.instance();
        if (self.memberHandle.ready()) {
            return TeamMember.find({"member.userId": {$in: memberIds}});
        }
    },
    teamCollection() {
        return Team;
    }
});