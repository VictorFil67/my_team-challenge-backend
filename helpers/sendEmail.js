import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  // console.log("first");
  const email = { ...data, from: UKR_NET_EMAIL };
  // console.log("second");
  // console.log(transport.sendMail(email));
  return transport.sendMail(email);
};

export default sendEmail;
