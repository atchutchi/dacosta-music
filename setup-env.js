const fs = require('fs');
const path = require('path');

// Function to generate random string for CSRF secret
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Configuration
const envFile = '.env.local';
const envVars = {
  // Supabase environment variables
  NEXT_PUBLIC_SUPABASE_URL: 'https://your-supabase-project-url.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-supabase-anon-key',
  
  // CSRF environment variables - should match what you set in middleware.ts
  CSRF_SECRET: 'your-csrf-secret-a-random-string-min-32-chars',
  
  // EmailJS environment variables for server-side (deprecated)
  EMAILJS_SERVICE_ID: 'your-emailjs-service-id',
  EMAILJS_TEMPLATE_ID: 'your-emailjs-template-id',
  EMAILJS_PUBLIC_KEY: 'your-emailjs-public-key',
  EMAILJS_PRIVATE_KEY: 'your-emailjs-private-key',
  
  // EmailJS environment variables for client-side (browser)
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: 'service_io7khql',
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: 'template_9p1cubl',
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: 'fAaxEO9MexrnI9ypq',
  
  // Admin email for contact form
  ADMIN_EMAIL: 'admin@dacosta-music.com',
  EMAIL_FROM: 'bookings@dacosta-music.com',
  CONTACT_EMAIL: 'contact@dacosta-music.com',
};

// Create or update .env.local file
try {
  // Check if file exists and read it
  let existingContent = '';
  try {
    existingContent = fs.readFileSync(path.join(process.cwd(), envFile), 'utf8');
  } catch (err) {
    // File doesn't exist, will create a new one
  }

  // Process existing environment variables
  const existingVars = {};
  if (existingContent) {
    existingContent.split('\n').forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          existingVars[key.trim()] = value.trim();
        }
      }
    });
  }

  // Merge with new variables, preserving existing ones
  const mergedVars = { ...envVars, ...existingVars };
  
  // Create new content
  let newContent = '';
  Object.entries(mergedVars).forEach(([key, value]) => {
    newContent += `${key}=${value}\n`;
  });

  // Write to file
  fs.writeFileSync(path.join(process.cwd(), envFile), newContent);
  console.log(`✅ Environment variables have been set up in ${envFile}`);
} catch (error) {
  console.error('❌ Error setting up environment variables:', error);
  process.exit(1);
} 