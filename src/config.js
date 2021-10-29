const config = {
    apiUrl: process.env.REACT_APP_DASHBOARD_BASE_URL,
    pageLimitOption1: 10,
    pageLimitOption2: 100,
    pageLimitTotalDefaultValue: 1000,
    pageUnlimitValue: 100000,
    marginPagesDisplayed: 1,
    pageRangeDisplayed: 3,
    roleItems: [
        {"name": "user"},
        {"name": "admin"}
    ],
    templateVenueRoleItem: {
        "venueId": 0,
        "role": "",
        "venueShow": false,
        "venueName": "",
        "roleName": "",
        "roleShow": false
    },
    settingsVenueInit: {
        headerColor: "#0000",
        textColor: "#0000"
    }
};
export default config;
