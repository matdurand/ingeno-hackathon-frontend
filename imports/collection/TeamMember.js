import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const TeamMember = new Mongo.Collection('teamMember');

Member = new SimpleSchema({
    name: {
        type: String
    },
    userId: {
        type: String
    }
});

MemberSchema = new SimpleSchema({
    member: {
        type: Member,
        label: "Member"
    },
    isAdmin: {
        type: Boolean,
        label: "isAdmin"
    }
});

TeamMember.attachSchema(MemberSchema);