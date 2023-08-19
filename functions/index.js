/* eslint-disable max-len */
// These are the settings for sending emails to new users via Firebase.
// However, they won't work without the appropriate subscription, as my free account does not support this feature. */

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Postavke za Gmail vjerodajnice
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// Postavljanje transporta za slanje e-maila putem nodemailer-a
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;

  // Opcije e-maila
  const mailOptions = {
    from: "\"Moj Super Web\" <noreply@mojweb.com>",
    to: email,
    subject: "Dobrodošli!",
    text: "Hvala vam što ste se registrirali na našu web stranicu!",
  };

  // Šalje e-mail koristeći prethodno definirane opcije
  return mailTransport.sendMail(mailOptions)
      .then(() => {
        console.log("Email poslan na:", email);
        return null;
      })
      .catch((error) => {
        console.error("Došlo je do pogreške prilikom slanja e-maila:", error);
      });
});


