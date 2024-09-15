const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

// Import functions
const { uberOrderWebhook } = require('./functions/uberOrderWebhook');

// Export functions
exports.uberOrderWebhook = uberOrderWebhook;

// You can add more function exports here as your project grows
// exports.anotherFunction = require('./anotherFile').anotherFunction;