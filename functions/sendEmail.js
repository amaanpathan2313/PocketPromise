/**
 * Send email using Resend API.
 *
 * To use this, install the Resend SDK in your functions directory:
 *   cd functions && npm install resend
 *
 * Set the API key as a Firebase environment config:
 *   firebase functions:config:set resend.api_key="re_YOUR_KEY"
 *
 * Or use Firebase Functions v2 secrets.
 */

// const { Resend } = require('resend');
// const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send a reminder email.
 * @param {object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.body - Email body text
 */
async function sendEmail({ to, subject, body }) {
  // === OPTION 1: Using Resend (recommended) ===
  // Uncomment and install: npm install resend
  //
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // const { data, error } = await resend.emails.send({
  //   from: 'LendReminder <noreply@yourdomain.com>',
  //   to: [to],
  //   subject: subject,
  //   text: body,
  // });
  //
  // if (error) throw new Error(error.message);
  // return data;

  // === OPTION 2: Using SendGrid ===
  // Uncomment and install: npm install @sendgrid/mail
  //
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  //
  // await sgMail.send({
  //   to,
  //   from: 'noreply@yourdomain.com',
  //   subject,
  //   text: body,
  // });

  // === PLACEHOLDER: Log to console ===
  console.log(`[EMAIL] To: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body: ${body}`);
  console.log('---');

  // Remove this placeholder and uncomment one of the options above
  // after installing the respective package and setting API keys.
}

module.exports = { sendEmail };
