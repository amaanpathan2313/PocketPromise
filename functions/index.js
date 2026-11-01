const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();

// Import helpers
const { sendEmail } = require('./sendEmail');
const { sendSMS } = require('./sendSMS');

// Multilingual message templates
const templates = [
  {
    lang: 'English',
    subject: (name, amount, lender) => `Reminder: ₹${amount} due to ${lender}`,
    body: (name, amount, lender) =>
      `Hey ${name}, this is a friendly reminder that you borrowed ₹${amount} from ${lender} and promised to return it. Please pay it back at the earliest. Thank you!`,
    sms: (name, amount, lender) =>
      `Hey ${name}, you owe ₹${amount} to ${lender}. Please pay back as promised. - LendReminder`,
  },
  {
    lang: 'Hindi',
    subject: (name, amount, lender) => `रिमाइंडर: ${lender} को ₹${amount} वापस करें`,
    body: (name, amount, lender) =>
      `नमस्ते ${name}, कृपया ${lender} से लिए गए ₹${amount} रुपये जल्द से जल्द वापस करें। आपने वादा किया था। धन्यवाद!`,
    sms: (name, amount, lender) =>
      `नमस्ते ${name}, कृपया ${lender} को ₹${amount} वापस करें। - LendReminder`,
  },
  {
    lang: 'Marathi',
    subject: (name, amount, lender) => `स्मरणपत्र: ${lender} ला ₹${amount} परत करा`,
    body: (name, amount, lender) =>
      `नमस्कार ${name}, कृपया तुम्ही ${lender} कडून घेतलेले ₹${amount} रुपये लवकरात लवकर परत करा. धन्यवाद!`,
    sms: (name, amount, lender) =>
      `नमस्कार ${name}, कृपया ${lender} ला ₹${amount} परत करा. - LendReminder`,
  },
];

/**
 * Scheduled Cloud Function — runs every 3 hours.
 * Queries all overdue, unpaid loans and sends email + SMS reminders
 * cycling through English → Hindi → Marathi.
 */
exports.sendReminders = onSchedule('every 3 hours', async (event) => {
  const now = Timestamp.now();

  try {
    // Query all loans where status is NOT 'paid' and promiseDate is in the past
    const snapshot = await db
      .collection('loans')
      .where('status', 'in', ['active', 'overdue'])
      .get();

    if (snapshot.empty) {
      console.log('No overdue loans found.');
      return;
    }

    const overdueLoans = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const promiseDate = data.promiseDate?.toDate ? data.promiseDate.toDate() : new Date(data.promiseDate);

      // Only process if the promise date has passed
      if (new Date() > promiseDate) {
        // Check if 3 hours have passed since last reminder
        let shouldSend = true;
        if (data.lastReminderSentAt) {
          const lastSent = data.lastReminderSentAt.toDate();
          const threeHoursMs = 3 * 60 * 60 * 1000;
          shouldSend = Date.now() - lastSent.getTime() >= threeHoursMs;
        }

        if (shouldSend) {
          overdueLoans.push({ id: doc.id, ...data });
        }
      }
    });

    console.log(`Found ${overdueLoans.length} loans needing reminders.`);

    // Process each overdue loan
    const promises = overdueLoans.map(async (loan) => {
      const langIndex = (loan.reminderLanguageIndex || 0) % templates.length;
      const template = templates[langIndex];

      const borrowerName = loan.borrowerName;
      const amount = loan.amount;
      const lenderName = loan.lenderName || 'the lender';

      // Send email
      try {
        await sendEmail({
          to: loan.borrowerEmail,
          subject: template.subject(borrowerName, amount, lenderName),
          body: template.body(borrowerName, amount, lenderName),
        });
        console.log(`Email sent to ${loan.borrowerEmail} in ${template.lang}`);
      } catch (err) {
        console.error(`Email failed for ${loan.borrowerEmail}:`, err.message);
      }

      // Send SMS
      try {
        await sendSMS({
          to: loan.borrowerPhone,
          message: template.sms(borrowerName, amount, lenderName),
        });
        console.log(`SMS sent to ${loan.borrowerPhone} in ${template.lang}`);
      } catch (err) {
        console.error(`SMS failed for ${loan.borrowerPhone}:`, err.message);
      }

      // Update Firestore
      await db.collection('loans').doc(loan.id).update({
        status: 'overdue',
        reminderLanguageIndex: (langIndex + 1) % templates.length,
        lastReminderSentAt: now,
        reminderCount: (loan.reminderCount || 0) + 1,
      });
    });

    await Promise.all(promises);
    console.log('All reminders processed successfully.');
  } catch (error) {
    console.error('Reminder cron failed:', error);
  }
});
