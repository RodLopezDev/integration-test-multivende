const dns = require("dns");
const emails = require("./email.json");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidMail(mail) {
  return emailRegex.test(mail);
}

async function verifyEmailDomain(email) {
  const domain = email.split("@")[1];
  const dnsPromises = dns.promises;
  try {
    const records = await dnsPromises.resolveMx(domain);
    return [email, records.length > 0];
  } catch (error) {
    return [email, false];
  }
}

async function main() {
  // Email no validos
  const validMails = emails.filter(isValidMail);
  console.log("VALID MAILS", validMails);

  console.log("EMAILS WITH VALID DOMAIN");
  const emailsWithValidation = await Promise.all(
    validMails.map(async (mail) => await verifyEmailDomain(mail))
  );
  const emailWithValidDomain = emailsWithValidation
    .filter(([, isValid]) => !!isValid)
    .map(([email]) => email);
  console.log("VALID MAILS AND DOMAIN", emailWithValidDomain);
}

main();
