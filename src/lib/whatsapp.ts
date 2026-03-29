export const getWhatsAppLink = (booking: any, type: 'new' | 'cancelled' | 'updated' | 'admin_cancelled' | 'payment_success' | 'payment_failed', lang: 'en' | 'gu' = 'en') => {
  const messages = {
    en: {
      new: `Namaste ${booking.full_name}, we have received your booking for ${booking.service_type} on ${booking.booking_date} at ${booking.booking_time}. Please complete payment to confirm.`,
      cancelled: `Namaste ${booking.full_name}, your booking for ${booking.service_type} has been cancelled.`,
      updated: `Namaste ${booking.full_name}, your booking for ${booking.service_type} has been updated to ${booking.booking_date} at ${booking.booking_time}.`,
      admin_cancelled: `Namaste ${booking.full_name}, unfortunately your booking for ${booking.service_type} on ${booking.booking_date} has been cancelled by the administrator.`,
      payment_success: `Namaste ${booking.full_name}, your payment for ${booking.service_type} is successful. Your booking is confirmed for ${booking.booking_date} at ${booking.booking_time}.`,
      payment_failed: `Namaste ${booking.full_name}, payment for your booking ${booking.service_type} failed. Please try again.`
    },
    gu: {
      new: `નમસ્તે ${booking.full_name}, અમને ${booking.service_type} માટે તમારી બુકિંગ વિનંતી મળી છે જે ${booking.booking_date} એ ${booking.booking_time} વાગ્યે છે. બુકિંગ કન્ફર્મ કરવા માટે કૃપા કરીને પેમેન્ટ પૂર્ણ કરો.`,
      cancelled: `નમસ્તે ${booking.full_name}, ${booking.service_type} માટેનું તમારું બુકિંગ તમારી વિનંતી મુજબ રદ કરવામાં આવ્યું છે.`,
      updated: `નમસ્તે ${booking.full_name}, તમારા બુકિંગની વિગતો અપડેટ કરવામાં આવી છે. નવો સમય: ${booking.booking_date} એ ${booking.booking_time} વાગ્યે.`,
      admin_cancelled: `નમસ્તે ${booking.full_name}, દિલગીર છીએ કે ${booking.service_type} માટેનું તમારું બુકિંગ એડમિન દ્વારા રદ કરવામાં આવ્યું છે.`,
      payment_success: `નમસ્તે ${booking.full_name}, તમારું પેમેન્ટ સફળ રહ્યું છે. તમારું બુકિંગ કન્ફર્મ થઈ ગયું છે.`,
      payment_failed: `નમસ્તે ${booking.full_name}, તમારું પેમેન્ટ નિષ્ફળ ગયું છે. કૃપા કરીને ફરી પ્રયાસ કરો.`
    }
  };

  const message = messages[lang][type];
  const phone = booking.phone.replace(/\D/g, '');
  const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
  
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};
