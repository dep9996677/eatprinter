const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.uberOrderWebhook = functions.https.onRequest(async (req, res) => {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    res.status(405).json({ code: 'ERROR', message: 'Method Not Allowed' });
    return;
  }

  try {
    // Get the order data from the request body
    const orderData = req.body;

    // Validate the order data (you may want to add more validation)
    if (!orderData || typeof orderData !== 'object') {
      res.status(400).json({ code: 'ERROR', message: 'Invalid order data' });
      return;
    }

    // Add a timestamp to the order data
    orderData.timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Save the order data to the 'uberEatsOrder' collection
    const writeResult = await admin.firestore().collection('uberEatsOrder').add(orderData);

    // Send a success response with the document ID and a success code
    res.status(200).json({ 
      code: 'SUCCESS',
      message: ``,
      orderId: writeResult.id
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ 
      code: 'ERROR',
      message: 'Error saving order',
      error: error.message
    });
  }
});