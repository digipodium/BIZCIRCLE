const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async ({ to, candidateName, senderName, verificationLink }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BizCircle <onboarding@resend.dev>',
      to: [to],
      subject: `✅ Confirm Your Referral on BizCircle`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2563eb;">Referral Confirmation</h2>
          <p>Hi <strong>${candidateName}</strong>,</p>
          <p><strong>${senderName}</strong> has referred you to a professional circle on BizCircle.</p>
          <p>To help us maintain a high-quality networking ecosystem, please verify that you were indeed referred for this opportunity by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify My Referral</a>
          </div>
          <p style="color: #64748b; font-size: 0.875rem;">This link is valid for 30 days. If you didn't expect this email, you can safely ignore it.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #94a3b8; font-size: 0.75rem; text-align: center;">Team BizCircle</p>
        </div>
      `,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Mailer utility error (Verification):', err);
    throw err;
  }
};

const sendReferralReceivedEmail = async ({ to, receiverName, senderName, candidateName }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BizCircle <onboarding@resend.dev>',
      to: [to],
      subject: `🎯 New Referral Shared With You!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2563eb;">New Referral Received</h2>
          <p>Hi <strong>${receiverName}</strong>,</p>
          <p>Good news! <strong>${senderName}</strong> has just shared a new referral with you.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px; margin: 20px 0; border: 1px solid #e2e8f0;">
             <p style="margin: 0; font-size: 0.9rem; color: #475569;">Candidate Name:</p>
             <p style="margin: 5px 0 0 0; font-weight: bold; color: #1e293b;">${candidateName}</p>
          </div>
          <p>Login to your BizCircle dashboard to view the full details and candidate context.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/referrals" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View in Dashboard</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #94a3b8; font-size: 0.75rem; text-align: center;">Team BizCircle</p>
        </div>
      `,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Mailer utility error (Received):', err);
    throw err;
  }
};

module.exports = { sendVerificationEmail, sendReferralReceivedEmail };
