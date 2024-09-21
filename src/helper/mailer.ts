import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const Email = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: string;
  userId: number;
}) => {
  function mail(emailType: string, hashToken: string) {
    emailType = emailType.trim();
    console.log("Email Type being passed:", emailType);
    if (emailType == "VERIFY") {
      return `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${process.env.DOMAIN}/verifyemail?token=${hashToken}">Verify Email</a>
      `;
    } else if (emailType === "RESET") {
      return `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.DOMAIN}/reset-password?token=${hashToken}">Reset Password</a>
      `;
    } else if (emailType !== "VERIFY" && emailType !== "RESET") {
      throw new Error(`Invalid email type: ${emailType}`);
    } else {
      throw new Error("Invalid email type");
    }
  }

  try {
    const hashToken = await bcryptjs.hash(userId.toString(), 10);
    console.log(hashToken);
    const emailContent = mail(emailType, hashToken);
    console.log("Email content generated:", emailContent);
    emailType = emailType.trim();

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
      const updatedUser = await User.findById(userId);
      console.log("Updated user after VERIFY token:", updatedUser);
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "651747e7b68c6e", // doi
        pass: "62f687add96c50", // odi
      },
    });

    const mailOption = {
      from: "hello@gmail.com", // sender address
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: mail(emailType, hashToken),
    };

    const mailResponse = await transport.sendMail(mailOption);
    return mailResponse;
  } catch (error: any) {
    console.error("Error details:", error);
    throw new Error(error.message); // Rethrow the error so it returns 500
  }
};
