const BREVO_API_URL = 'https://api.brevo.com/v3';

function getApiKey() {
  return process.env.BREVO_API_KEY || '';
}

async function brevoFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BREVO_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': getApiKey(),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(`Brevo API error: ${res.status}`);
    (error as any).status = res.status;
    (error as any).body = data;
    throw error;
  }

  return data;
}

// Add contact to Brevo list
export async function addContactToList({
  email,
  firstName,
  lastName,
  listIds = [2],
  attributes = {},
}: {
  email: string;
  firstName?: string;
  lastName?: string;
  listIds?: number[];
  attributes?: Record<string, string | number | boolean>;
}) {
  const contactAttributes: Record<string, any> = { ...attributes };
  if (firstName) contactAttributes.FIRSTNAME = firstName;
  if (lastName) contactAttributes.LASTNAME = lastName;

  try {
    await brevoFetch('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email,
        listIds,
        attributes: contactAttributes,
      }),
    });
    return { success: true };
  } catch (error: any) {
    // If contact already exists, update it
    if (error?.status === 400 && error?.body?.code === 'duplicate_parameter') {
      await brevoFetch(`/contacts/${encodeURIComponent(email)}`, {
        method: 'PUT',
        body: JSON.stringify({
          listIds,
          attributes: contactAttributes,
        }),
      });
      return { success: true, updated: true };
    }
    console.error('Error adding contact to Brevo:', error);
    throw error;
  }
}

// Send newsletter campaign
export async function sendNewsletterCampaign({
  name,
  subject,
  htmlContent,
  listIds,
  senderName = 'Katyaayani Astrologer',
  senderEmail = 'katyaayaniastrologer01@gmail.com',
  scheduledAt,
}: {
  name: string;
  subject: string;
  htmlContent: string;
  listIds: number[];
  senderName?: string;
  senderEmail?: string;
  scheduledAt?: Date;
}) {
  const body: any = {
    name,
    subject,
    sender: { name: senderName, email: senderEmail },
    htmlContent,
    recipients: { listIds },
  };

  if (scheduledAt) {
    body.scheduledAt = scheduledAt.toISOString();
  }

  const data = await brevoFetch('/emailCampaigns', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return { success: true, campaignId: data?.id };
}
