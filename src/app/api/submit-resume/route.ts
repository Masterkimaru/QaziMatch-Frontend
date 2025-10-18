import { NextRequest } from "next/server";
import { createTransport } from "nodemailer";
//import { readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { writeFile } from "fs/promises";

export const maxDuration = 60; // seconds (for Vercel serverless function timeout)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fullName = formData.get("fullName")?.toString() || "";
    const notes = formData.get("notes")?.toString() || "";
    const file = formData.get("cv") as File | null;

    const userEmail = formData.get("userEmail")?.toString(); // optional: if you collect email

    if (!fullName || !file) {
      return Response.json({ error: "Full name and CV are required." }, { status: 400 });
    }

    // Optional: validate userEmail if you require it
    if (!userEmail || !userEmail.includes("@")) {
      return Response.json({ error: "Valid email is required for confirmation." }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to temp file (Nodemailer needs a path or buffer)
    const tempPath = join(tmpdir(), file.name);
    await writeFile(tempPath, buffer);

    // Configure Nodemailer
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 1. Email to company
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Resume Submission from ${fullName}`,
      text: `Name: ${fullName}\nEmail: ${userEmail}\nNotes: ${notes || "None"}`,
      attachments: [
        {
          filename: file.name,
          path: tempPath,
        },
      ],
    });

    // 2. Confirmation email to user
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: "We’ve Received Your Resume – QaziMatch",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4a5568;">Thank You, ${fullName}!</h2>
          <p>We’ve successfully received your resume and notes.</p>
          <p>Someone from the QaziMatch team will review your submission and contact you within 24 hours.</p>
          <p>If you have urgent questions, feel free to reply to this email.</p>
          <hr style="margin: 20px 0;" />
          <p style="color: #718096; font-size: 0.9em;">
            Best regards,<br/>
            <strong>The QaziMatch Team</strong>
          </p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Submission error:", error);
    return Response.json({ error: "Failed to submit resume. Please try again." }, { status: 500 });
  }
}