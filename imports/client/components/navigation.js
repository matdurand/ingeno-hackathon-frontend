import "./navigation.html";
import {TEAM_ROUTE, MAIN_ROUTE} from "../routes/routes";

Template.navigation.helpers({
    teamRoute: () => TEAM_ROUTE,
    mainRoute: () => MAIN_ROUTE,
    routePercentage: () => {
        FlowRouter.watchPathChange();
        let currentRoute = FlowRouter.current().route.name;
        return currentRoute === MAIN_ROUTE ? 0 : 100;
        //On s'entend que c'est dégueulasse et qu'on change ça dès qu'on a plus que 2 routes...
    }
});

Template.navigation.events({
    'click .tab-link-hack'(event){
        $('.tab-link-hack').removeClass('active');
        $(event.currentTarget).addClass('active');
    }
});