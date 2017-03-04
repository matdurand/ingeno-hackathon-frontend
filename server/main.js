import '/imports/startup/server/api';
import {Meteor} from "meteor/meteor";
import {Team} from '/imports/collection/Team';
import {TeamMember} from '/imports/collection/TeamMember';

let TEAM_01 = 'team_01';
let TEAM_02 = 'team_02';
let TEAM_03 = 'team_03';
let TEAM_04 = 'team_04';
let ADMIN = 'admin';

let teams = [
    {
        name: TEAM_01,
        users: [
            {
                username: 'Daniel',
                email: 'daniel.carmichael1@gmail.com',
                profile: {
                    name: 'Daniel'
                },
                password: 'changeme'
            },
            {
                username: 'Antoine',
                email: 'aslight21@outlook.com',
                profile: {
                    name: 'Antoine'
                },
                password: 'changeme'
            }
        ]
    },
    {
        name: TEAM_02,
        users: [
            {
                username: 'Julien',
                email: 'julien.marcil@studio133.ca',
                profile: {
                    name: 'Julien'
                },
                password: 'changeme'
            },
            {
                username: 'Mathieu',
                email: 'mathieu.durand@ingeno.ca',
                profile: {
                    name: 'Mathieu'
                },
                password: 'changeme'
            }
        ]
    },
    {
        name: TEAM_03,
        users: [
            {
                username: 'Yves',
                email: 'yvesgl@gmail.coom',
                profile: {
                    name: 'Yves'
                },
                password: 'changeme'
            },
            {
                username: 'Louis-Etienne',
                email: 'ledor473@hotmail.com',
                profile: {
                    name: 'Louis-Etienne'
                },
                password: 'changeme'
            }
        ]
    },
    {
        name: TEAM_04,
        users: [
            {
                username: 'Remy',
                email: 'remy.gendron@ingeno.ca',
                profile: {
                    name: 'Remy'
                },
                password: 'changeme'
            },
            {
                username: 'Guillaume',
                email: 'guillaume.duchesneau@ingeno.ca',
                profile: {
                    name: 'Guillaume'
                },
                password: 'changeme'
            }
        ]
    },
    {
        name: ADMIN,
        users: [
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
