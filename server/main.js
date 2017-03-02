import '/imports/startup/server/api';
import {Meteor} from "meteor/meteor";
import {Team} from '/imports/collection/Team';
import {TeamMember} from '/imports/collection/TeamMember';

let TEAM_01 = 'team_01';
let TEAM_02 = 'team_02';
let TEAM_03 = 'team_03';
let TEAM_04 = 'team_04';
let TEAM_05 = 'team_05';
let ADMIN = 'admin';

let teams = [
    {
        name: TEAM_01,
        users: [
            {
                username: 'dummy1',
                email: 'dummy.1@ingeno.ca',
                profile: {
                    name: 'dummy1'
                },
                password: 'changeme'
            }
        ]
    },
    {
        name: TEAM_02,
        users: [
            {
                username: 'dummy2',
                email: 'dummy.2@ingeno.ca',
                profile: {
                    name: 'dummy2'
                },
                password: 'changeme'
            }
        ]
    },
    {
        name: TEAM_03,
        users: [
            {
                username: 'dummy3',
                email: 'dummy.3@ingeno.ca',
                profile: {
                    name: 'dummy3'
                },
                password: 'changeme'
            }
        ]
    },
    {
        name: TEAM_04,
        users: [
            {
                username: 'dummy4',
                email: 'dummy.4@ingeno.ca',
                profile: {
                    name: 'dummy4'
                },
                password: 'changeme'
            }
        ]
    },
    {
        name: TEAM_05,
        users: [
            {
                username: 'dummy5',
                email: 'dummy.5@ingeno.ca',
                profile: {
                    name: 'dummy5'
                },
                password: 'changeme'
            }
        ]
    },
    {
        name: ADMIN,
        users: [
            {
                username: 'mathieu',
                email: 'mathieu.durand@ingeno.ca',
                profile: {
                    name: 'Mathieu',
                    team: ADMIN
                },
                password: 'changeme'
            },
            {
                username: 'maxim',
                email: 'maxim.chouinard@ingeno.ca',
                profile: {
                    name: 'Maxim',
                    team: ADMIN
                },
                password: 'changeme'
            }
        ]
    }
];


Meteor.startup(() => {
    var Users = Meteor.users;

    for (var team in teams) {
        if (Team.find({name: teams[team].name}).count() === 0) {
            var userIds = [];
            var createdTeam = {}

            createdTeam.name = teams[team].name;

            for (var user in teams[team].users) {
                if (Users.find({username: teams[team].users[user].username}).count() === 0) {
                    var userId = Accounts.createUser(teams[team].users[user]);
                    userIds.push(userId);
                    TeamMember.insert({
                        member: {name: teams[team].users[user].username, userId: userId},
                        isAdmin: (teams[team].name == ADMIN)
                    });
                }
            }

            createdTeam.userIds = userIds;
            Team.insert(createdTeam);
        }
    }
});
