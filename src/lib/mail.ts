import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || '"Lumiora Consultations" <noreply@lumiora.com>';

  if (!host || !user || !pass) {
    console.warn("⚠️ SMTP credentials are NOT fully configured in environment variables.");
    console.log(`✉️ Mock Email Log:\nTo: ${to}\nSubject: ${subject}\nBody preview: ${html.substring(0, 300)}...`);
    
    throw new Error(
      "SMTP configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and ADMIN_EMAIL in your backend .env file to verify real email delivery."
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html
    });
    return true;
  } catch (error: any) {
    console.error("❌ Failed to send email via SMTP:", error);
    throw new Error(`Email delivery failed: ${error.message || error}`);
  }
}

// ─── EMAIL TEMPLATES ────────────────────────────────────────────────────────

const emailLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lumiora Consultations</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .header { background: #3b82f6; padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 16px; }
    .footer { text-align: center; padding: 24px; font-size: 12px; color: #64748b; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff !important; font-weight: bold; text-decoration: none; border-radius: 8px; margin-top: 16px; box-shadow: 0 2px 4px rgb(59 130 246 / 0.3); }
    .btn:hover { background-color: #2563eb; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: bold; border-radius: 9999px; text-transform: uppercase; }
    .badge-pending { background-color: #fef3c7; color: #d97706; }
    .badge-approved { background-color: #d1fae5; color: #059669; }
    .badge-rejected { background-color: #fee2e2; color: #dc2626; }
    .badge-rescheduled { background-color: #dbeafe; color: #2563eb; }
    .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .details-row { display: flex; margin-bottom: 8px; font-size: 14px; }
    .details-row:last-child { margin-bottom: 0; }
    .details-label { font-weight: bold; width: 120px; color: #64748b; }
    .details-value { color: #0f172a; flex: 1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Lumiora</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Lumiora. All rights reserved.<br>
      San Francisco, CA 94105
    </div>
  </div>
</body>
</html>
`;

export function getAdminNotificationEmail(booking: {
  id: string;
  name: string;
  email: string;
  company: string;
  date: string;
  time: string;
  notes: string;
  baseUrl: string;
}) {
  const adminUrl = `${booking.baseUrl}/admin`;
  return emailLayout(`
    <h2 style="margin-top: 0; font-size: 20px; font-weight: 800; color: #0f172a;">New Consultation Booking Request</h2>
    <p>A client has requested a free consultation. Please review and respond in the admin panel.</p>
    
    <div class="details-box">
      <div class="details-row">
        <span class="details-label">Client Name:</span>
        <span class="details-value">${booking.name}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Email:</span>
        <span class="details-value">${booking.email}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Company:</span>
        <span class="details-value">${booking.company || "N/A"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Requested Date:</span>
        <span class="details-value">${booking.date}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Requested Time:</span>
        <span class="details-value">${booking.time}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Notes:</span>
        <span class="details-value">${booking.notes || "None"}</span>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${adminUrl}" class="btn">Open Admin Dashboard</a>
    </div>
  `);
}

export function getUserPendingEmail(booking: {
  name: string;
  date: string;
  time: string;
  id: string;
  baseUrl: string;
}) {
  const statusUrl = `${booking.baseUrl}/book-consultation/status/${booking.id}`;
  return emailLayout(`
    <h2 style="margin-top: 0; font-size: 20px; font-weight: 800; color: #0f172a;">Booking Request Received</h2>
    <p>Hi ${booking.name},</p>
    <p>Thank you for requesting a free consultation with Lumiora. Your request is currently <span class="badge badge-pending">Pending Approval</span> by our team.</p>
    <p>We will review your requested time slot and send a confirmation or rescheduling proposal shortly.</p>
    
    <div class="details-box">
      <div class="details-row">
        <span class="details-label">Requested Date:</span>
        <span class="details-value">${booking.date}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Requested Time:</span>
        <span class="details-value">${booking.time}</span>
      </div>
    </div>

    <p>You can check the status of your request at any time using the link below:</p>
    <div style="text-align: center;">
      <a href="${statusUrl}" class="btn">Check Booking Status</a>
    </div>
  `);
}

export function getUserApprovedEmail(booking: {
  name: string;
  date: string;
  time: string;
  meetingLink: string;
}) {
  return emailLayout(`
    <h2 style="margin-top: 0; font-size: 20px; font-weight: 800; color: #0f172a;">Consultation Confirmed! 🎉</h2>
    <p>Hi ${booking.name},</p>
    <p>We are excited to confirm your 30-minute free consultation request. Your status is now <span class="badge badge-approved">Approved</span>.</p>
    
    <div class="details-box">
      <div class="details-row">
        <span class="details-label">Date:</span>
        <span class="details-value">${booking.date}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Time:</span>
        <span class="details-value">${booking.time}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Format:</span>
        <span class="details-value">Google Meet / Zoom Video Call</span>
      </div>
    </div>

    <p>Please use the button below to join the meeting at the scheduled time:</p>
    <div style="text-align: center;">
      <a href="${booking.meetingLink}" class="btn" target="_blank">Join Meeting</a>
    </div>
    <p style="font-size: 13px; color: #64748b; margin-top: 12px; text-align: center;">
      Or use this link directly: <a href="${booking.meetingLink}">${booking.meetingLink}</a>
    </p>
  `);
}

export function getUserRejectedEmail(booking: {
  name: string;
  date: string;
  time: string;
  baseUrl: string;
}) {
  const newBookingUrl = `${booking.baseUrl}/book-consultation`;
  return emailLayout(`
    <h2 style="margin-top: 0; font-size: 20px; font-weight: 800; color: #0f172a;">Booking Request Declined</h2>
    <p>Hi ${booking.name},</p>
    <p>Thank you for your interest in scheduling a consultation with Lumiora.</p>
    <p>Unfortunately, our team is unavailable at your requested time: <strong>${booking.date} at ${booking.time}</strong>, and we are unable to approve this request.</p>
    <p>We welcome you to try scheduling another time slot that fits your schedule.</p>
    
    <div style="text-align: center;">
      <a href="${newBookingUrl}" class="btn">Select a New Time Slot</a>
    </div>
  `);
}

export function getUserRescheduledEmail(booking: {
  name: string;
  originalDate: string;
  originalTime: string;
  suggestedDate: string;
  suggestedTime: string;
  id: string;
  baseUrl: string;
}) {
  const statusUrl = `${booking.baseUrl}/book-consultation/status/${booking.id}`;
  return emailLayout(`
    <h2 style="margin-top: 0; font-size: 20px; font-weight: 800; color: #0f172a;">Rescheduling Suggestion</h2>
    <p>Hi ${booking.name},</p>
    <p>Thank you for your consultation request. Unfortunately, our team is not available on <strong>${booking.originalDate} at ${booking.originalTime}</strong>.</p>
    <p>However, we would love to connect with you and have suggested a new time slot: <span class="badge badge-rescheduled">Rescheduled Proposal</span></p>
    
    <div class="details-box">
      <div class="details-row">
        <span class="details-label">Suggested Date:</span>
        <span class="details-value">${booking.suggestedDate}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Suggested Time:</span>
        <span class="details-value">${booking.suggestedTime}</span>
      </div>
    </div>

    <p>Please review this suggested time slot and let us know if it works for you by accepting or declining the proposal:</p>
    <div style="text-align: center;">
      <a href="${statusUrl}" class="btn">Review Suggested Time</a>
    </div>
  `);
}
