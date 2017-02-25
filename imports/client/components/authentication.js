import "./authentication.html";
import {framework7} from "../../../client/main";

Template.authentication.events({
    'click #authenticateButton'(event){
        event.preventDefault();
        let email = document.getElementById('emailInput').value;
        let password = document.getElementById('passwordInput').value;
        Meteor.loginWithPassword(email, password, (error) => {
            if (error) {
                framework7.alert('Wrong credentials', 'Error');
            } else {
                FlowRouter.go('/');
            }
        });
    }
});