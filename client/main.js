import "framework7";
import {AccountsTemplates} from "meteor/useraccounts:core";
import "../imports/startup/client/index";

export let framework7 = new Framework7({
    router: false,
    swipePanel: 'right',
    swipePanelOnlyClose: true,
    material: true
});

export const LOGIN_PATH = '/sign-in';
export const LOGIN_ROUTE = 'sign-in';

AccountsTemplates.configure({

    // Behavior
    enablePasswordChange: false,
    sendVerificationEmail: false,
    lowercaseUsername: true,

    // Appearance
    forbidClientAccountCreation: true,
    showForgotPasswordLink: false,
    showLabels: false,

    // Validation
    continuousValidation: true,
    positiveValidation: false,
});

AccountsTemplates.configure({
    defaultLayout: 'authentication',
    defaultLayoutRegions: {},
    defaultContentRegion: 'main'
});

AccountsTemplates.configureRoute('signIn', {
    name: LOGIN_ROUTE,
    path: LOGIN_PATH
});

FlowRouter.route('/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function (params, queryParams) {
        BlazeLayout.render('mainPage', {});
    }
});

FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn]);

Meteor.startup(function () {
    GoogleMaps.load({v: '3', key: 'AIzaSyBmJo4kpsfwT0d63NQNomMtEk3P6l8Edo8', libraries: ''});
});

BlazeLayout.setRoot('body');
