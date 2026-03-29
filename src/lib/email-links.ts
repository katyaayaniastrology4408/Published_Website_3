// Client-safe email link utilities (no Node.js dependencies)

export const getMailtoLink = (booking: any, type: string) => {
  const subjectMap: any = {
    admin_cancelled: `Important: Booking Update for ${booking.booking_date} - Katyaayani Astrologer`,
    updated: `Booking Rescheduled: ${booking.booking_date} - Katyaayani Astrologer`,
    reschedule_draft: `Appointment Date Unavailable – Kindly Reschedule`,
    password_reset_draft: `Password Reset Details`,
  };

  const bodyMap: any = {
    admin_cancelled: `Namaste ${booking.full_name},\n\nUnfortunately, our astrologer is unavailable on ${booking.booking_date}. Your booking for ${booking.service_type} has been cancelled.\n\nPlease visit our website to book another slot or contact us for rescheduling.\n\nRegards,\nKatyaayani Astrologer`,
    updated: `Namaste ${booking.full_name},\n\nYour booking for ${booking.service_type} has been updated to ${booking.booking_date} at ${booking.booking_time}.\n\nRegards,\nKatyaayani Astrologer`,
    reschedule_draft: `Dear Sir/Madam,

Thank you for your booking.

Please note that I am currently busy and the selected appointment date and time have already been blocked.

Client Name: ${booking.full_name}

Booked Appointment Details:
Date: ${booking.booking_date}
Time: ${booking.booking_time}

Birth Details (Required for Consultation):
Date of Birth: ${booking.date_of_birth || ''}
Time of Birth: ${booking.time_of_birth || ''}
Place of Birth: ${booking.place_of_birth || ''}

I kindly request you to reschedule your appointment to an available date and time.

While making the payment, please ensure that you clearly mention the payment reference number for confirmation.

For any assistance regarding rescheduling, feel free to contact us.

Thank you for your understanding and cooperation.

Warm regards,
Katyaayani Astrologer`,
    password_reset_draft: `Dear Sir/Madam,

Greetings from Katyaayani Astrologer.

As per your request, we have reset your account password. Please find your updated login details below:

Login Email ID: ${booking.email}
New Password: ${booking.password || ''}

For security reasons, we strongly recommend that you change your password immediately after logging in.

If you face any issues while logging in or need further assistance, please feel free to contact us. We will be happy to help you.

Thank you for your cooperation.

Warm regards,
Katyaayani Astrologer`,
  };

  const subject = encodeURIComponent(subjectMap[type] || 'Booking Update');
  const body = encodeURIComponent(bodyMap[type] || 'Hello, your booking has been updated.');
  
  return `mailto:${booking.email}?subject=${subject}&body=${body}`;
};

export const getGmailLink = (booking: any, type: string) => {
  const subjectMap: any = {
    admin_cancelled: `Important: Booking Update for ${booking.booking_date} - Katyaayani Astrologer`,
    updated: `Booking Rescheduled: ${booking.booking_date} - Katyaayani Astrologer`,
    reschedule_draft: `Appointment Date Unavailable – Kindly Reschedule`,
    password_reset_draft: `Password Reset Details`,
  };

  const bodyMap: any = {
    admin_cancelled: `Namaste ${booking.full_name},\n\nUnfortunately, our astrologer is unavailable on ${booking.booking_date}. Your booking for ${booking.service_type} has been cancelled.\n\nPlease visit our website to book another slot or contact us for rescheduling.\n\nRegards,\nKatyaayani Astrologer`,
    updated: `Namaste ${booking.full_name},\n\nYour booking for ${booking.service_type} has been updated to ${booking.booking_date} at ${booking.booking_time}.\n\nRegards,\nKatyaayani Astrologer`,
    reschedule_draft: `Dear Sir/Madam,

Thank you for your booking.

Please note that I am currently busy and the selected appointment date and time have already been blocked.

Client Name: ${booking.full_name}

Booked Appointment Details:
Date: ${booking.booking_date}
Time: ${booking.booking_time}

Birth Details (Required for Consultation):
Date of Birth: ${booking.date_of_birth || ''}
Time of Birth: ${booking.time_of_birth || ''}
Place of Birth: ${booking.place_of_birth || ''}

I kindly request you to reschedule your appointment to an available date and time.

While making the payment, please ensure that you clearly mention the payment reference number for confirmation.

For any assistance regarding rescheduling, feel free to contact us.

Thank you for your understanding and cooperation.

Warm regards,
Katyaayani Astrologer`,
    password_reset_draft: `Dear Sir/Madam,

Greetings from Katyaayani Astrologer.

As per your request, we have reset your account password. Please find your updated login details below:

Login Email ID: ${booking.email}
New Password: ${booking.password || ''}

For security reasons, we strongly recommend that you change your password immediately after logging in.

If you face any issues while logging in or need further assistance, please feel free to contact us. We will be happy to help you.

Thank you for your cooperation.

Warm regards,
Katyaayani Astrologer`,
  };

  const subject = encodeURIComponent(subjectMap[type] || 'Booking Update');
  const body = encodeURIComponent(bodyMap[type] || 'Hello, your booking has been updated.');
  
  return `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${booking.email}&su=${subject}&body=${body}`;
};

export const getWhatsAppLink = (booking: any, type: 'new' | 'cancelled' | 'updated' | 'admin_cancelled' | 'payment_success' | 'payment_failed' | 'confirmed' | 'completed', lang: 'gu' | 'en' = 'en') => {
  const whatsappMessageMap = {
    new: {
      en: `Namaste ${booking.full_name}, we have received your booking for ${booking.service_type} on ${booking.booking_date} at ${booking.booking_time}. Please complete payment to confirm.`,
      gu: `નમસ્તે ${booking.full_name}, અમને ${booking.booking_date} ના રોજ ${booking.booking_time} વાગ્યે ${booking.service_type} માટે તમારું બુકિંગ મળ્યું છે. કૃપા કરીને પુષ્ટિ કરવા માટે ચુકવણી પૂર્ણ કરો.`
    },
    cancelled: {
      en: `Namaste ${booking.full_name}, your booking for ${booking.service_type} has been cancelled.`,
      gu: `નમસ્તે ${booking.full_name}, ${booking.service_type} માટેનું તમારું બુકિંગ રદ કરવામાં આવ્યું છે.`
    },
    updated: {
      en: `Namaste ${booking.full_name}, your booking for ${booking.service_type} has been updated to ${booking.booking_date} at ${booking.booking_time}.`,
      gu: `નમસ્તે ${booking.full_name}, ${booking.service_type} માટેનું તમારું બુકિંગ ${booking.booking_date} ના રોજ ${booking.booking_time} વાગ્યે અપડેટ કરવામાં આવ્યું છે.`
    },
    admin_cancelled: {
      en: `Namaste ${booking.full_name}, unfortunately your booking for ${booking.service_type} on ${booking.booking_date} has been cancelled by the administrator as they are busy or travelling.`,
      gu: `નમસ્તે ${booking.full_name}, કમનસીબે ${booking.booking_date} ના રોજ ${booking.service_type} માટેનું તમારું બુકિંગ એડમિનિસ્ટ્રેટર દ્વારા રદ કરવામાં આવ્યું છે કારણ કે તેઓ વ્યસ્ત છે અથવા મુસાફરી કરી રહ્યા છે.`
    },
    payment_success: {
      en: `Namaste ${booking.full_name}, your payment for ${booking.service_type} is successful. Your booking is confirmed for ${booking.booking_date} at ${booking.booking_time}.`,
      gu: `નમસ્તે ${booking.full_name}, ${booking.service_type} માટે તમારી ચુકવણી સફળ રહી છે. તમારું બુકિંગ ${booking.booking_date} ના રોજ ${booking.booking_time} વાગ્યે કન્ફર્મ થયું છે.`
    },
    payment_failed: {
      en: `Namaste ${booking.full_name}, payment for your booking ${booking.service_type} failed. Please try again.`,
      gu: `નમસ્તે ${booking.full_name}, ${booking.service_type} માટે તમારી ચુકવણી નિષ્ફળ ગઈ. કૃપા કરીને ફરી પ્રયાસ કરો.`
    },
    confirmed: {
      en: `Namaste ${booking.full_name}, your booking for ${booking.service_type} is confirmed for ${booking.booking_date} at ${booking.booking_time}.`,
      gu: `નમસ્તે ${booking.full_name}, ${booking.service_type} માટે તમારું બુકિંગ ${booking.booking_date} ના રોજ ${booking.booking_time} વાગ્યે કન્ફર્મ થયું છે.`
    },
    completed: {
      en: `Namaste ${booking.full_name}, your consultation for ${booking.service_type} is completed. Thank you!`,
      gu: `નમસ્તે ${booking.full_name}, ${booking.service_type} માટે તમારું પરામર્શ પૂર્ણ થયું છે. આભાર!`
    }
  };

  const message = whatsappMessageMap[type][lang];
  const phone = (booking.phone || '').replace(/\D/g, '');
  const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
  
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};
