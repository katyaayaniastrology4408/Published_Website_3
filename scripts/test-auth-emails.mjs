
import { sendWelcomeEmail, sendWelcomeBackEmail, sendLoginNotification } from './src/lib/email';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testEmails() {
  const testEmail = process.env.ADMIN_EMAIL || 'katyaayaniastrologer01@gmail.com';
  const testName = 'Test Seeker';

  console.log('Sending Welcome Email...');
  const res1 = await sendWelcomeEmail({ email: testEmail, name: testName });
  console.log('Welcome Email Result:', res1);

  console.log('Sending Welcome Back Email...');
  const res2 = await sendWelcomeBackEmail({ email: testEmail, name: testName });
  console.log('Welcome Back Email Result:', res2);

  console.log('Sending Login Notification...');
  const res3 = await sendLoginNotification({ email: testEmail, name: testName });
  console.log('Login Notification Result:', res3);
}

testEmails().catch(console.error);
