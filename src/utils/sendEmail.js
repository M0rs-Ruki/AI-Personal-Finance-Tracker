import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({path: './.env'})

export const sendEmail = async ({ from, subject, message, name }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: from, 
      to: process.env.EMAIL_RECEIVER,
      subject: subject || 'New Message from Contact Form',
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${from}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { success: false, error };
  }
};
