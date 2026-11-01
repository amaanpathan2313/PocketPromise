/**
 * Send SMS using Twilio.
 *
 * To use this, install the Twilio SDK in your functions directory:
 *   cd functions && npm install twilio
 *
 * Set the credentials as environment config:
 *   firebase functions:config:set twilio.account_sid="AC..." twilio.auth_token="..." twilio.phone_number="+1..."
 *
 * Or use Firebase Functions v2 secrets.
 */

// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Send a reminder SMS.
 * @param {object} options
 * @param {string} options.to - Recipient phone number (with country code, e.g. +919876543210)
 * @param {string} options.message - SMS message body
 */
async function sendSMS({ to, message }) {
  // === OPTION 1: Using Twilio (recommended) ===
  // Uncomment and install: npm install twilio
  //
  // const twilio = require('twilio');
  // const client = twilio(
  //   process.env.TWILIO_ACCOUNT_SID,
  //   process.env.TWILIO_AUTH_TOKEN
  // );
  //
  // const result = await client.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: to,
  // });
  //
  // return result.sid;

  // === OPTION 2: Using MSG91 (great for India) ===
  // Uncomment and install: npm install axios
  //
  // const axios = require('axios');
  // await axios.post('https://api.msg91.com/api/v5/flow/', {
  //   // MSG91 config
  // }, {
  //   headers: { authkey: process.env.MSG91_AUTH_KEY }
  // });

  // === PLACEHOLDER: Log to console ===
  console.log(`[SMS] To: ${to}`);
  console.log(`[SMS] Message: ${message}`);
  console.log('---');

  // Remove this placeholder and uncomment one of the options above
  // after installing the respective package and setting API keys.
}

module.exports = { sendSMS };
