// Safe JSON parsing utility for fetch responses
// Prevents "Unexpected end of JSON input" errors from empty/non-JSON responses
export async function safeJson(res: Response): Promise<any> {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : { success: false };
  } catch {
    return { success: false };
  }
}
