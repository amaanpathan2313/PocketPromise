/**
 * Multilingual reminder message templates.
 * Cycles: English → Hindi → Marathi → repeat
 */

const templates = [
  // English
  {
    lang: 'en',
    label: 'English',
    subject: (borrowerName, amount, lenderName) =>
      `Reminder: ₹${amount} due to ${lenderName}`,
    body: (borrowerName, amount, lenderName) =>
      `Hey ${borrowerName}, this is a friendly reminder that you borrowed ₹${amount} from ${lenderName} and promised to return it. Please pay it back at the earliest. Thank you!`,
    sms: (borrowerName, amount, lenderName) =>
      `Hey ${borrowerName}, you owe ₹${amount} to ${lenderName}. Please pay back as promised. - LendReminder`,
  },
  // Hindi
  {
    lang: 'hi',
    label: 'हिंदी',
    subject: (borrowerName, amount, lenderName) =>
      `रिमाइंडर: ${lenderName} को ₹${amount} वापस करें`,
    body: (borrowerName, amount, lenderName) =>
      `नमस्ते ${borrowerName}, कृपया ${lenderName} से लिए गए ₹${amount} रुपये जल्द से जल्द वापस करें। आपने वादा किया था कि आप पैसे लौटाएंगे। धन्यवाद!`,
    sms: (borrowerName, amount, lenderName) =>
      `नमस्ते ${borrowerName}, कृपया ${lenderName} को ₹${amount} वापस करें। - LendReminder`,
  },
  // Marathi
  {
    lang: 'mr',
    label: 'मराठी',
    subject: (borrowerName, amount, lenderName) =>
      `स्मरणपत्र: ${lenderName} ला ₹${amount} परत करा`,
    body: (borrowerName, amount, lenderName) =>
      `नमस्कार ${borrowerName}, कृपया तुम्ही ${lenderName} कडून घेतलेले ₹${amount} रुपये लवकरात लवकर परत करा. तुम्ही वचन दिले होते की तुम्ही पैसे परत कराल. धन्यवाद!`,
    sms: (borrowerName, amount, lenderName) =>
      `नमस्कार ${borrowerName}, कृपया ${lenderName} ला ₹${amount} परत करा. - LendReminder`,
  },
];

/**
 * Get the message template for a given language index.
 * @param {number} index - 0, 1, or 2 (cycles automatically)
 * @returns {object} Template object with subject, body, sms functions
 */
export function getTemplate(index) {
  return templates[index % templates.length];
}

/**
 * Get the next language index in the cycle.
 * @param {number} currentIndex
 * @returns {number}
 */
export function getNextLanguageIndex(currentIndex) {
  return (currentIndex + 1) % templates.length;
}

export default templates;
