// Alternative implementation using dynamic imports
interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send an email using Resend (with dynamic import)
 */
export async function sendEmailAlt(params: EmailParams) {
  try {
    // Dynamically import Resend to avoid build-time issues
    const { Resend } = await import('resend');
    
    const apiKey = process.env.RESEND_API_KEY || '';
    const resend = new Resend(apiKey);
    
    const { to, subject, html, from, replyTo } = params;
    const fromEmail = from || process.env.EMAIL_FROM || 'bookings@dacosta-music.com';
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      reply_to: replyTo,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    throw new Error(error.message || 'Failed to send email');
  }
}

/**
 * Send a contact form submission email (alternative implementation)
 */
export async function sendContactFormEmailAlt(formData: { 
  name: string; 
  email: string; 
  subject: string; 
  message: string; 
}) {
  const { name, email, subject, message } = formData;
  
  // Email to the site owner/admin
  const adminHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;
  
  // Confirmation email to the sender
  const userHtml = `
    <h2>Thank you for contacting Da Costa Music</h2>
    <p>Dear ${name},</p>
    <p>We have received your message and will get back to you as soon as possible.</p>
    <p>Here's a copy of your message:</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <p>Best regards,</p>
    <p>Da Costa Music Team</p>
  `;
  
  // Send email to admin
  const adminEmail = await sendEmailAlt({
    to: process.env.ADMIN_EMAIL || 'admin@dacosta-music.com',
    subject: `New Contact Form: ${subject}`,
    html: adminHtml,
    replyTo: email
  });
  
  // Send confirmation email to user
  const userEmail = await sendEmailAlt({
    to: email,
    subject: 'Thank you for contacting Da Costa Music',
    html: userHtml
  });
  
  return { adminEmail, userEmail };
} 