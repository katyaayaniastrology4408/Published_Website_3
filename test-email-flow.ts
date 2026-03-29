import { sendEmail } from './src/lib/email.config';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  console.log('Testing email flow...');
  const result = await sendEmail({
    to: 'test@example.com',
    subject: 'Production Flow Test',
    html: '<h1>Test</h1>'
  });
  console.log('Result:', result);
}

test();
