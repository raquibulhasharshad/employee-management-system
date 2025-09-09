import { Request, Response } from "express";
import nodemailer from "nodemailer";

const sendMail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { toEmails, subject, body } = req.body;

    if (!toEmails || !subject || !body) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // e.g., company@gmail.com
        pass: process.env.MAIL_PASS, // Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: Array.isArray(toEmails) ? toEmails.join(", ") : toEmails,
      subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Mail sent successfully" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ message: "Failed to send mail" });
  }
};

export default { sendMail };
