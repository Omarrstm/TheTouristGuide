import { Resend } from "resend";

export async function sendEmail(input: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "TheTouristGuide <onboarding@resend.dev>",
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
}
