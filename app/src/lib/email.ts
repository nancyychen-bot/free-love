import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail(to: string, subject: string, text: string) {
  if (!resend) return; // Skip in dev without key
  try {
    await resend.emails.send({
      from: 'Free Love <noreply@updates.freelove.app>',
      to,
      subject,
      text,
    });
  } catch (e) {
    console.error('Email failed:', e);
  }
}
