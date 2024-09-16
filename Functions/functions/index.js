const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

// Import functions
const { uberNotificationWebhook} = require('./functions/uberNotificationWebhook');

// Export functions
exports.uberNotificationWebhook = uberNotificationWebhook;

// You can add more function exports here as your project grows
// exports.anotherFunction = require('./anotherFile').anotherFunction;