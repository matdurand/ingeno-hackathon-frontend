export const TEAM_ROUTE = 'team-route';
export const MAIN_ROUTE = 'main-route';

FlowRouter.route('/', {
    name: MAIN_ROUTE,
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function (params, queryParams) {
        BlazeLayout.render('mainPage', {
            page: 'maps',
            data: {}
        });
    }
});

FlowRouter.route('/team', {
    name: TEAM_ROUTE,
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function (params, queryParams) {
        BlazeLayout.render('mainPage', {
            page: 'team',
            data: {}
        });
    }
});