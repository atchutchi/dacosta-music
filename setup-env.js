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
  // Resend API Key - add your key here or use the one provided
  RESEND_API_KEY: 're_8rPftMfG_MZbhekKFggGqgUgLvWc2am6H',
  
  // Email to use as sender - change to your verified sender
  EMAIL_FROM: 'bookings@dacosta-music.com',
  
  // Email to receive admin notifications - change to your email
  ADMIN_EMAIL: 'admin@dacosta-music.com',
  
  // CSRF Secret for security
  CSRF_SECRET: generateRandomString(64),
  
  // Bit.io API Keys for different artists
  NEXT_PUBLIC_BIT_APP_ID_CAIRO: '46869fabf38284e834ea2fe5359ac6a3',
  // Will add these later:
  // NEXT_PUBLIC_BIT_APP_ID_ENOO_NAPA: '',
  // NEXT_PUBLIC_BIT_APP_ID_DA_CAPO: '',
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
  
  // Add or update the new Resend API key
  mergedVars.RESEND_API_KEY = envVars.RESEND_API_KEY;
  
  // Add or update the Bit.io API keys
  mergedVars.NEXT_PUBLIC_BIT_APP_ID_CAIRO = envVars.NEXT_PUBLIC_BIT_APP_ID_CAIRO;
  
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