import nodeMailer from "nodemailer";
import { NextResponse } from "next/server";

// Function to send email
const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  try {
    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// GET request handler
export async function GET() {
  try {
    const message = `Email chal raha hai kiya?`;
    const email = "mohammad.78600@outlook.com";
    const subject = `emailtest`;

    const response = await sendEmail({
      email: email,
      subject: subject,
      message,
    });

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    } else {
      return NextResponse.json(
        { success: false, error: response.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
