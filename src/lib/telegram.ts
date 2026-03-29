
export async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  if (!botToken || !chatId) {
    console.warn("Telegram bot token or chat ID missing");
    return { success: false, error: "Missing configuration" };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Telegram API error:", data);
      return { success: false, error: data.description || "Failed to send message" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Telegram send exception:", error);
    return { success: false, error: "Exception while sending telegram message" };
  }
}
