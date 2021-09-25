const nodemailer = require("nodemailer");

require("dotenv").config();

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "tagetes2021@meta.ua",
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (data) => {
  try {
    const email = { ...data, from: "tagetes2021@meta.ua" };
    await transporter.sendMail(email);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmail;
