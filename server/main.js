import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    var Users = Meteor.users;

    if (Users.find().count() === 0) {
        Accounts.createUser({
            username: 'mathieu',
            email:'mathieu.durand@ingeno.ca',
            profile: {
                name: 'Mathieu',
            },
            password:'changeme'
        });
    }
});
