import * as emailjs from '@emailjs/nodejs';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactFormEmail(data: ContactFormData): Promise<void> {
  const { name, email, subject, message } = data;
  
  try {
    // Initialize with EmailJS credentials
    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    });

    // Prepare template parameters
    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message,
      reply_to: email,
      to_email: process.env.CONTACT_EMAIL || 'admin@dacosta-music.com',
    };

    // Send the email using EmailJS
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID as string,
      process.env.EMAILJS_TEMPLATE_ID as string,
      templateParams
    );
    
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
} 