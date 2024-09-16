const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

// Your client secret from Uber. In a real-world scenario, this should be stored securely,
// such as in Firebase Config or Secret Manager.
const CLIENT_SECRET = 'mbfqUYM_DnpJB-_8yhGvCMkDOwSzNky1_eBXbU1E';

function validateSignature(body, signature) {
  const hmac = crypto.createHmac('sha256', CLIENT_SECRET);
  const computedSignature = hmac.update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature));
}

exports.uberNotificationWebhook = functions.https.onRequest(async (req, res) => {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Validate the Uber signature
  const signature = req.get('X-Uber-Signature');
  if (!signature) {
    res.status(401).send('Missing signature');
    return;
  }

  const rawBody = JSON.stringify(req.body);
  if (!validateSignature(rawBody, signature)) {
    res.status(401).send('Invalid signature');
    return;
  }

  try {
    // Get the notification data from the request body
    const notificationData = req.body;

    // Add a timestamp to the notification data
    notificationData.timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Save the notification data to the 'uberNotification' collection
    await admin.firestore().collection('uberNotification').add(notificationData);

    // Send an empty response with 200 status code for success
    res.status(200).send();
  } catch (error) {
    console.error('Error saving notification:', error);
    // For errors, we'll still send an empty response with a 500 status code
    res.status(500).send();
  }
});