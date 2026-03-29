export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Poll every 5 minutes to check for scheduled emails
    setInterval(async () => {
      try {
        const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        await fetch(`${base}/api/cron/send-scheduled`);
      } catch {}
    }, 5 * 60 * 1000);
  }
}
