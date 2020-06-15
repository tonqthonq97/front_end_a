// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    busAPI: 'lwDNzkXxI42r2YyoqwCZ5wZ9B8dyZ5KU',
    googleMapApiKey: 'AIzaSyDW9tFSqG2mA0ym2NluRBVGZ6tPr8xbwRM',
    // APIEndpoint: 'http://127.0.0.1:3000',
    APIEndpoint: 'http://150.95.112.109',
    // APIEndpoint: 'http://103.18.7.212:1228',
    APIUrls: {
        // busList: 'https://client-api.quanlyxe.vn/v3/tracking/getvehicles',
        // busDetail: 'https://client-api.quanlyxe.vn/v3/tracking/getvehiclestatuses',
        busList: 'api/bus',
        login: 'login',
        changePassword: 'api/change-password',
        forgetPassword: 'forgot-pass/parents',
        parent: 'api/parent',
        contacts: 'api/contacts',
        absence: 'api/absence',
        absenceHistory: 'api/absence/history',
        pickup: 'api/pickup',
        faqCategories: 'api/faq-types',
        faqQuestions: 'api/faqs',
        surveys: 'api/surveys',
        surveyQuestions: 'api/surveys/question',
        surveySubmit: 'api/surveys/survey_log',
        school: 'api/school',
        schedule: 'api/schedule',
        notifications: 'api/notifications',
        newNotifications: 'api/notifications/new',
        markNewestNotification: 'api/notification/current_read',
        markReadNotification: 'api/notification/read',
        saveUser: 'api/token_device'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
