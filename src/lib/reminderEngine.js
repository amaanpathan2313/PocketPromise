import emailjs from '@emailjs/browser';
import { getTemplate, getNextLanguageIndex } from './messages';
import { db, doc, updateDoc, Timestamp } from './firebase';

/**
 * Send a reminder email using EmailJS.
 * In production, this would be handled by Firebase Cloud Functions + Twilio/Resend.
 * This client-side version is for demo/testing purposes.
 */
export async function sendReminderEmail(loan, lenderName) {
  const template = getTemplate(loan.reminderLanguageIndex || 0);

  const templateParams = {
    to_email: loan.borrowerEmail,
    to_name: loan.borrowerName,
    from_name: lenderName,
    subject: template.subject(loan.borrowerName, loan.amount, lenderName),
    message: template.body(loan.borrowerName, loan.amount, lenderName),
  };

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    // Update loan's reminder state in Firestore
    const loanRef = doc(db, 'loans', loan.id);
    await updateDoc(loanRef, {
      reminderLanguageIndex: getNextLanguageIndex(loan.reminderLanguageIndex || 0),
      lastReminderSentAt: Timestamp.now(),
      reminderCount: (loan.reminderCount || 0) + 1,
    });

    return { success: true, lang: template.label };
  } catch (error) {
    console.error('Failed to send reminder:', error);
    return { success: false, error };
  }
}

/**
 * Check if a loan is overdue.
 */
export function isOverdue(loan) {
  if (loan.status === 'paid') return false;
  const promiseDate = loan.promiseDate?.toDate ? loan.promiseDate.toDate() : new Date(loan.promiseDate);
  return new Date() > promiseDate;
}

/**
 * Check if 3 hours have passed since the last reminder.
 */
export function shouldSendReminder(loan) {
  if (!isOverdue(loan)) return false;
  if (!loan.lastReminderSentAt) return true;

  const lastSent = loan.lastReminderSentAt?.toDate
    ? loan.lastReminderSentAt.toDate()
    : new Date(loan.lastReminderSentAt);
  const threeHoursMs = 3 * 60 * 60 * 1000;
  return Date.now() - lastSent.getTime() >= threeHoursMs;
}
