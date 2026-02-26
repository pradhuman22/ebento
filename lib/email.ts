import nodemailer from "nodemailer";

const nodemailerUser = process.env.NODEMAILER_USER;
const nodemailerAppPassword = process.env.NODEMAILER_APP_PASSWORD;

if (!nodemailerUser) {
  const error = new Error(
    "Missing required environment variable: NODEMAILER_USER. Please set this variable in your environment configuration."
  );
  console.error(error.message);
  throw error;
}

if (!nodemailerAppPassword) {
  const error = new Error(
    "Missing required environment variable: NODEMAILER_APP_PASSWORD. Please set this variable in your environment configuration."
  );
  console.error(error.message);
  throw error;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: nodemailerUser,
    pass: nodemailerAppPassword,
  },
});

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) return "***@***";
  const maskedLocal = localPart.length > 0 ? `${localPart[0]}***` : "***";
  return `${maskedLocal}@${domain}`;
}

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  try {
    await transporter.sendMail({
      from: nodemailerUser,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Error sending email to ${maskEmail(to)}:`, error);
    throw new Error("Failed to send email. Please try again.");
  }
}
