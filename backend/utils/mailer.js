const nodemailer = require('nodemailer');

// ─── Transporter ─────────────────────────────────────────────────────────────
// Uses Gmail SMTP via App Password.
// In development without credentials set, emails are skipped gracefully.
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
      process.env.EMAIL_PASS === 'your_gmail_app_password_here') {
    return null; // no-op mode
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,  // Gmail App Password, NOT your account password
    },
  });
};

const FROM = `BizCircle <${process.env.EMAIL_USER || 'bizcircleteam@gmail.com'}>`;

// ─── Verification Email ───────────────────────────────────────────────────────
const sendVerificationEmail = async ({ to, candidateName, senderName, verificationLink }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('⚠️  Email skipped (EMAIL_PASS not configured). Verification link:', verificationLink);
    return;
  }

  await transporter.sendMail({
    from: FROM,
    to,
    subject: '✅ Confirm Your Referral on BizCircle',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;
                  border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb;">Referral Confirmation</h2>
        <p>Hi <strong>${candidateName}</strong>,</p>
        <p><strong>${senderName}</strong> has referred you to a professional circle on BizCircle.</p>
        <p>Please verify that you were referred for this opportunity by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}"
             style="background-color: #2563eb; color: white; padding: 12px 24px;
                    text-decoration: none; border-radius: 8px; font-weight: bold;
                    display: inline-block;">
            Verify My Referral
          </a>
        </div>
        <p style="color: #64748b; font-size: 0.875rem;">
          This link is valid for 30 days. If you didn't expect this email, you can safely ignore it.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 0.75rem; text-align: center;">Team BizCircle</p>
      </div>
    `,
  });
};

// ─── Referral Received Email ──────────────────────────────────────────────────
const sendReferralReceivedEmail = async ({ to, receiverName, senderName, candidateName }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('⚠️  Email skipped (EMAIL_PASS not configured). Receiver:', to);
    return;
  }

  const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/referrals`;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: '🎯 New Referral Shared With You on BizCircle',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;
                  border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb;">New Referral Received</h2>
        <p>Hi <strong>${receiverName}</strong>,</p>
        <p><strong>${senderName}</strong> has just shared a new referral with you.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px;
                    margin: 20px 0; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 0.9rem; color: #475569;">Candidate Name:</p>
          <p style="margin: 5px 0 0 0; font-weight: bold; color: #1e293b;">${candidateName}</p>
        </div>
        <p>Log in to your BizCircle dashboard to view the full details.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}"
             style="background-color: #2563eb; color: white; padding: 12px 24px;
                    text-decoration: none; border-radius: 8px; font-weight: bold;
                    display: inline-block;">
            View in Dashboard
          </a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 0.75rem; text-align: center;">Team BizCircle</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendReferralReceivedEmail };
