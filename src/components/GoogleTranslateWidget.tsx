"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { DOMTranslator } from "@/components/DOMTranslator";
import { translateText } from "@/lib/translations";

type Language = "hi" | "gu" | "en";

const translations: Record<Language, Record<string, string>> = {
  hi: {
    Home: "होम",
    Services: "सेवाएं",
    Book: "बुक करें",
    Feedback: "प्रतिक्रिया",
    About: "हमारे बारे में",
    Online: "ऑनलाइन",
    "Online Consulting": "ऑनलाइन परामर्श",
    Login: "लॉगिन",
    "Login / Sign Up": "लॉगिन / साइन अप",
    "View Profile": "प्रोफ़ाइल देखें",
    "Begin Your Journey": "अपनी यात्रा शुरू करें",
    "View All Services": "सभी सेवाएं देखें",
    "Home Consultation": "घर पर परामर्श",
    "Online Meeting": "ऑनलाइन बैठक",
    "Book Now": "अभी बुक करें",
    "Sign In": "साइन इन करें",
    "Sign Up": "साइन अप करें",
    "Log Out": "लॉग आउट",
    Profile: "प्रोफ़ाइल",
    "Quick Links": "त्वरित लिंक",
    Contact: "संपर्क",
    Timing: "समय",
    "Full Name": "पूरा नाम",
    Phone: "फोन",
    Email: "ईमेल",
    Address: "पता",
    Gender: "लिंग",
    Date: "तिथि",
    Time: "समय",
    Place: "स्थान",
    Confirmed: "पुष्टि की गई",
    Pending: "लंबित",
    Cancelled: "रद्द",
    Terms: "नियम",
    Privacy: "गोपनीयता",
    "Refund Policy": "धनवापसी नीति",
    "Back to Home": "होम पर वापस जाएं",
    Settings: "सेटिंग्स",
    Dashboard: "डैशबोर्ड",
    Bookings: "बुकिंग",
    Users: "उपयोगकर्ता",
    "Save Changes": "परिवर्तन सहेजें",
    Close: "बंद करें",
    Submit: "जमा करें",
    Continue: "जारी रखें",
    Back: "पीछे",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    home: "घर पर",
    office: "कार्यालय",
    online: "ऑनलाइन",
    Rashifal: "राशिफल",
    Blog: "ब्लॉग",
    "Daily Horoscope": "दैनिक राशिफल",
    "Select Date": "तिथि चुनें",
    "Select Time": "समय चुनें",
    "Admin Portal": "एडमिन पोर्टल",
    "Secure access to Katyaayani Astrology management": "कात्यायनी ज्योतिष प्रबंधन की सुरक्षित पहुंच",
    "Admin Login": "एडमिन लॉगिन",
    "Verify Password": "पासवर्ड सत्यापित करें",
    "Two-Factor Authentication": "दो-कारक प्रमाणीकरण",
    "Enter your administrator email": "अपना एडमिन ईमेल दर्ज करें",
    "Enter your password to continue": "जारी रखने के लिए अपना पासवर्ड दर्ज करें",
    "Enter the 6-digit code sent to your Telegram/Email": "अपने टेलीग्राम/ईमेल पर भेजा गया 6-अंकीय कोड दर्ज करें",
    "Email Address": "ईमेल पता",
    Password: "पासवर्ड",
    "Please enter a valid email": "कृपया वैध ईमेल दर्ज करें",
    "Invalid credentials": "अमान्य क्रेडेंशियल",
    "An error occurred. Please try again.": "एक त्रुटि हुई। कृपया पुन: प्रयास करें।",
    "Invalid verification code": "अमान्य सत्यापन कोड",
    "Enter the 6-digit verification code": "6-अंकीय सत्यापन कोड दर्ज करें",
    "Submit OTP": "OTP जमा करें",
    "All rights reserved.": "सर्वाधिकार सुरक्षित।",
    "Reset Destiny": "पासवर्ड रीसेट करें",
    "Request Sent": "अनुरोध भेजा गया",
    "Our celestial guides will help you regain access to your spiritual account.": "हमारे खगोलीय मार्गदर्शक आपके खाते तक पहुंच पुनः प्राप्त करने में मदद करेंगे।",
    "Your request has been channeled to our admin team.": "आपका अनुरोध हमारी एडमिन टीम को भेज दिया गया है।",
    "Registered Email": "पंजीकृत ईमेल",
    "Phone Number": "फोन नंबर",
    "Verification Details (Optional)": "सत्यापन विवरण (वैकल्पिक)",
    "Submit Request": "अनुरोध जमा करें",
    "Back to Sign In": "साइन इन पर वापस जाएं",
    "Return to cosmic gateway": "कॉस्मिक गेटवे पर वापस जाएं",
    "Booking Successful!": "बुकिंग सफल!",
    "Your astrology consultation has been successfully booked.": "आपका ज्योतिष परामर्श सफलतापूर्वक बुक हो गया है।",
    "Details": "विवरण",
    "Go to Home": "होम पर जाएं",
    "Loading...": "लोड हो रहा है...",
    "Confirming payment...": "भुगतान की पुष्टि हो रही है...",
    "Loading booking details...": "बुकिंग विवरण लोड हो रहा है...",
    "Disclaimer": "अस्वीकरण",
    "All astrology-related information on this website is for guidance purposes only. For legal, financial, medical, or personal matters, professional advice should be sought.": "इस वेबसाइट पर सभी ज्योतिष-संबंधित जानकारी केवल मार्गदर्शन उद्देश्यों के लिए है। कानूनी, वित्तीय, चिकित्सा या व्यक्तिगत मामलों के लिए, पेशेवर सलाह लेनी चाहिए।",
    "Guarantee of Results": "परिणामों की गारंटी",
    "Astrological services do not guarantee future outcomes. Results may vary depending on individual circumstances and personal actions. Accordingly, and in line with the prescribed parameters, the achievement of specific results cannot be assured.": "ज्योतिषीय सेवाएं भविष्य के परिणामों की गारंटी नहीं देती हैं। परिणाम व्यक्तिगत परिस्थितियों और व्यक्तिगत कार्यों के आधार पर भिन्न हो सकते हैं। तदनुसार, और निर्धारित मापदंडों के अनुरूप, विशिष्ट परिणामों की प्राप्ति सुनिश्चित नहीं की जा सकती।",
    "Privacy Policy": "गोपनीयता नीति",
    "We respect your privacy and protect your personal information.": "हम आपकी गोपनीयता का सम्मान करते हैं और आपकी व्यक्तिगत जानकारी की सुरक्षा करते हैं।",
    "We collect details such as name, email, date, time, and place of birth only when you voluntarily provide them.": "हम नाम, ईमेल, जन्म तिथि, समय और स्थान जैसे विवरण केवल तभी एकत्र करते हैं जब आप स्वेच्छा से उन्हें प्रदान करते हैं।",
    "Information is used to provide astrology readings and personalized content.": "जानकारी का उपयोग ज्योतिष पाठन और व्यक्तिगत सामग्री प्रदान करने के लिए किया जाता है।",
    "Non-personal data (browser type, site usage) may be collected for analytics and improvement.": "गैर-व्यक्तिगत डेटा (ब्राउज़र प्रकार, साइट उपयोग) विश्लेषण और सुधार के लिए एकत्र किया जा सकता है।",
    "We do not sell, rent, or trade your personal data to third parties.": "हम आपके व्यक्तिगत डेटा को तीसरे पक्ष को बेचते, किराए पर देते या व्यापार नहीं करते हैं।",
    "Reasonable security measures are taken to protect your information.": "आपकी जानकारी की सुरक्षा के लिए उचित सुरक्षा उपाय किए जाते हैं।",
    "By using our website, you agree to this Privacy Policy.": "हमारी वेबसाइट का उपयोग करके, आप इस गोपनीयता नीति से सहमत होते हैं।",
    "Terms and Conditions": "नियम और शर्तें",
    "1. Services": "1. सेवाएं",
    "This website provides astrology services including birth chart analysis, horoscope reading, marriage matching, numerology, and consultations. These services are based on traditional beliefs and experience.": "यह वेबसाइट जन्म कुंडली विश्लेषण, राशिफल पठन, विवाह मिलान, अंक ज्योतिष और परामर्श सहित ज्योतिष सेवाएं प्रदान करती है। ये सेवाएं पारंपरिक मान्यताओं और अनुभव पर आधारित हैं।",
    "2. Acceptance of Terms": "2. शर्तों की स्वीकृति",
    "By using this website, you agree to these terms and conditions. If you do not agree, please do not use the website.": "इस वेबसाइट का उपयोग करके, आप इन नियमों और शर्तों से सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।",
    "3. Guarantee of Results": "3. परिणामों की गारंटी",
    "4. Refund Policy": "4. धनवापसी नीति",
    "Once a service or consultation is booked and completed, no refunds will be issued under any circumstances. The guidance provided is final and cannot be reversed. However, we may offer rescheduling at our discretion.": "एक बार सेवा या परामर्श बुक और पूर्ण होने के बाद, किसी भी परिस्थिति में धनवापसी जारी नहीं की जाएगी। प्रदान किया गया मार्गदर्शन अंतिम है और इसे उलटा नहीं किया जा सकता। हालांकि, हम अपने विवेक पर पुनर्निर्धारण की पेशकश कर सकते हैं।",
    "5. Age Requirement": "5. आयु आवश्यकता",
    "Our website and services are intended for users aged 18 years and above.": "हमारी वेबसाइट और सेवाएं 18 वर्ष और उससे अधिक आयु के उपयोगकर्ताओं के लिए हैं।",
    "Users under the age of 18 should not provide any personal information on this website.": "18 वर्ष से कम आयु के उपयोगकर्ताओं को इस वेबसाइट पर कोई व्यक्तिगत जानकारी नहीं देनी चाहिए।",
    "We do not knowingly collect personal data from children under 18.": "हम जानबूझकर 18 वर्ष से कम आयु के बच्चों से व्यक्तिगत डेटा एकत्र नहीं करते हैं।",
    "If we discover that such information has been provided, we will promptly delete it.": "यदि हमें पता चलता है कि ऐसी जानकारी प्रदान की गई है, तो हम इसे तुरंत हटा देंगे।",
    "By using this website, you confirm that you meet the minimum age requirement.": "इस वेबसाइट का उपयोग करके, आप पुष्टि करते हैं कि आप न्यूनतम आयु आवश्यकता को पूरा करते हैं।",
    "6. Required Birth Details Policy": "6. आवश्यक जन्म विवरण नीति",
    "To provide accurate and effective astrology consultation, it is mandatory for the client to share the following correct birth details:": "सटीक और प्रभावी ज्योतिष परामर्श प्रदान करने के लिए, ग्राहक के लिए निम्नलिखित सही जन्म विवरण साझा करना अनिवार्य है:",
    "Birth Date": "जन्म तिथि",
    "Birth Time": "जन्म समय",
    "Birth Place": "जन्म स्थान",
  },
  gu: {
    Home: "હોમ",
    Services: "સેવાઓ",
    Book: "બુક",
    Feedback: "પ્રતિભાવ",
    About: "વિશે",
    Online: "ઓનલાઇન",
    "Online Consulting": "ઓનલાઇન પરામર્શ",
    Login: "લોગિન",
    "Login / Sign Up": "લોગિન / સાઇન અપ",
    "View Profile": "પ્રોફાઇલ જુઓ",
    "Begin Your Journey": "તમારી યાત્રા શરૂ કરો",
    "View All Services": "બધી સેવાઓ જુઓ",
    "Home Consultation": "ઘરે પરામર્શ",
    "Online Meeting": "ઓનલાઈન મીટિંગ",
    "Book Now": "અત્યારે બુક કરો",
    "Sign In": "સાઇન ઇન કરો",
    "Sign Up": "સાઇન અપ કરો",
    "Log Out": "લોગ આઉટ",
    Profile: "પ્રોફાઇલ",
    "Quick Links": "ઝડપી લિંક્સ",
    Contact: "સંપર્ક",
    Timing: "સમય",
    "Full Name": "પૂરું નામ",
    Phone: "ફોન",
    Email: "ઈમેલ",
    Address: "સરનામું",
    Gender: "લિંગ",
    Date: "તારીખ",
    Time: "સમય",
    Place: "સ્થળ",
    Confirmed: "પુષ્ટિ",
    Pending: "બાકી",
    Cancelled: "રદ કરેલ",
    Terms: "શરતો",
    Privacy: "ગોપનીયતા",
    "Refund Policy": "રિફંડ નીતિ",
    "Back to Home": "હોમ પર પાછા જાઓ",
    Settings: "સેટિંગ્સ",
    Dashboard: "ડેશબોર્ડ",
    Bookings: "બુકિંગ",
    Users: "વપરાશકર્તાઓ",
    "Save Changes": "ફેરફારો સાચવો",
    Close: "બંધ કરો",
    Submit: "સબમિટ કરો",
    Continue: "ચાલુ રાખો",
    Back: "પાછા",
    male: "પુરુષ",
    female: "સ્ત્રી",
    other: "અન્ય",
    home: "ઘરે",
    office: "ઓફિસ",
    online: "ઓનલાઇન",
    Rashifal: "રાશિફળ",
    Blog: "બ્લોગ",
    "Daily Horoscope": "દૈનિક રાશિફળ",
    "Select Date": "તારીખ પસંદ કરો",
    "Select Time": "સમય પસંદ કરો",
    "Admin Portal": "એડમિન પોર્ટલ",
    "Secure access to Katyaayani Astrology management": "કાત્યાયની જ્યોતિષ મેનેજમેન્ટની સુરક્ષિત ઍક્સેસ",
    "Admin Login": "એડમિન લોગિન",
    "Verify Password": "પાસવર્ડ ચકાસો",
    "Two-Factor Authentication": "ટુ-ફેક્ટર ઓથેન્ટિકેશન",
    "Enter your administrator email": "તમારો એડમિન ઈમેલ દાખલ કરો",
    "Enter your password to continue": "ચાલુ રાખવા માટે તમારો પાસવર્ડ દાખલ કરો",
    "Enter the 6-digit code sent to your Telegram/Email": "તમારા ટેલિગ્રામ/ઈમેલ પર મોકલેલ 6-અંકનો કોડ દાખલ કરો",
    "Email Address": "ઈમેલ સરનામું",
    Password: "પાસવર્ડ",
    "Please enter a valid email": "કૃપા કરી માન્ય ઈમેલ દાખલ કરો",
    "Invalid credentials": "અમાન્ય ક્રેડેન્શિયલ્સ",
    "An error occurred. Please try again.": "એક ભૂલ થઈ. કૃપા કરી ફરીથી પ્રયાસ કરો.",
    "Invalid verification code": "અમાન્ય ચકાસણી કોડ",
    "Enter the 6-digit verification code": "6-અંકનો ચકાસણી કોડ દાખલ કરો",
    "Submit OTP": "OTP સબમિટ કરો",
    "All rights reserved.": "સર્વાધિકાર સુરક્ષિત.",
    "Reset Destiny": "પાસવર્ડ રીસેટ કરો",
    "Request Sent": "વિનંતી મોકલવામાં આવી",
    "Our celestial guides will help you regain access to your spiritual account.": "અમારા ખગોળીય માર્ગદર્શકો તમારા ખાતામાં ફરીથી ઍક્સેસ મેળવવામાં મદદ કરશે.",
    "Your request has been channeled to our admin team.": "તમારી વિનંતી અમારી એડમિન ટીમને મોકલવામાં આવી છે.",
    "Registered Email": "નોંધાયેલ ઈમેલ",
    "Phone Number": "ફોન નંબર",
    "Verification Details (Optional)": "ચકાસણી વિગતો (વૈકલ્પિક)",
    "Submit Request": "વિનંતી સબમિટ કરો",
    "Back to Sign In": "સાઇન ઇન પર પાછા જાઓ",
    "Return to cosmic gateway": "કોસ્મિક ગેટવે પર પાછા જાઓ",
    "Booking Successful!": "બુકિંગ સફળ!",
    "Your astrology consultation has been successfully booked.": "તમારું જ્યોતિષ પરામર્શ સફળતાપૂર્વક બુક થઈ ગયું છે.",
    "Details": "વિગતો",
    "Go to Home": "હોમ પર જાઓ",
    "Loading...": "લોડ થઈ રહ્યું છે...",
    "Confirming payment...": "પેમેન્ટ કન્ફર્મ થઈ રહ્યું છે...",
    "Loading booking details...": "બુકિંગ વિગતો લોડ થઈ રહ્યા છે...",
    "Disclaimer": "અસ્વીકરણ",
    "All astrology-related information on this website is for guidance purposes only. For legal, financial, medical, or personal matters, professional advice should be sought.": "આ વેબસાઇટ પરની તમામ જ્યોતિષ-સંબંધિત માહિતી માત્ર માર્ગદર્શન હેતુઓ માટે છે. કાનૂની, નાણાકીય, તબીબી અથવા વ્યક્તિગત બાબતો માટે, વ્યાવસાયિક સલાહ લેવી જોઈએ.",
    "Guarantee of Results": "પરિણામોની ગેરંટી",
    "Astrological services do not guarantee future outcomes. Results may vary depending on individual circumstances and personal actions. Accordingly, and in line with the prescribed parameters, the achievement of specific results cannot be assured.": "જ્યોતિષીય સેવાઓ ભવિષ્યના પરિણામોની ખાતરી આપતી નથી. પરિણામો વ્યક્તિગત સંજોગો અને વ્યક્તિગત ક્રિયાઓના આધારે બદલાઈ શકે છે. તદનુસાર, અને નિર્ધારિત પરિમાણો અનુસાર, ચોક્કસ પરિણામોની પ્રાપ્તિની ખાતરી આપી શકાતી નથી.",
    "Privacy Policy": "ગોપનીયતા નીતિ",
    "We respect your privacy and protect your personal information.": "અમે તમારી ગોપનીયતાનું સન્માન કરીએ છીએ અને તમારી વ્યક્તિગત માહિતીનું રક્ષણ કરીએ છીએ.",
    "We collect details such as name, email, date, time, and place of birth only when you voluntarily provide them.": "અમે નામ, ઈમેલ, જન્મ તારીખ, સમય અને સ્થળ જેવી વિગતો ફક્ત ત્યારે જ એકત્રિત કરીએ છીએ જ્યારે તમે સ્વેચ્છાએ તે આપો છો.",
    "Information is used to provide astrology readings and personalized content.": "માહિતીનો ઉપયોગ જ્યોતિષ વાંચન અને વ્યક્તિગત સામગ્રી પ્રદાન કરવા માટે થાય છે.",
    "Non-personal data (browser type, site usage) may be collected for analytics and improvement.": "બિન-વ્યક્તિગત ડેટા (બ્રાઉઝર પ્રકાર, સાઇટ વપરાશ) વિશ્લેષણ અને સુધારણા માટે એકત્રિત થઈ શકે છે.",
    "We do not sell, rent, or trade your personal data to third parties.": "અમે તમારો વ્યક્તિગત ડેટા તૃતીય પક્ષોને વેચતા, ભાડે આપતા કે વેપાર કરતા નથી.",
    "Reasonable security measures are taken to protect your information.": "તમારી માહિતીને સુરક્ષિત રાખવા માટે વાજબી સુરક્ષા પગલાં લેવામાં આવે છે.",
    "By using our website, you agree to this Privacy Policy.": "અમારી વેબસાઇટનો ઉપયોગ કરીને, તમે આ ગોપનીયતા નીતિ સાથે સંમત થાઓ છો.",
    "Terms and Conditions": "નિયમો અને શરતો",
    "1. Services": "1. સેવાઓ",
    "This website provides astrology services including birth chart analysis, horoscope reading, marriage matching, numerology, and consultations. These services are based on traditional beliefs and experience.": "આ વેબસાઇટ જન્મ કુંડળી વિશ્લેષણ, રાશિફળ વાંચન, લગ્ન મેળાપ, અંકશાસ્ત્ર અને પરામર્શ સહિત જ્યોતિષ સેવાઓ પ્રદાન કરે છે. આ સેવાઓ પરંપરાગત માન્યતાઓ અને અનુભવ પર આધારિત છે.",
    "2. Acceptance of Terms": "2. શરતોની સ્વીકૃતિ",
    "By using this website, you agree to these terms and conditions. If you do not agree, please do not use the website.": "આ વેબસાઇટનો ઉપયોગ કરીને, તમે આ નિયમો અને શરતો સાથે સંમત થાઓ છો. જો તમે સંમત નથી, તો કૃપા કરીને વેબસાઇટનો ઉપયોગ ન કરો.",
    "3. Guarantee of Results": "3. પરિણામોની ગેરંટી",
    "4. Refund Policy": "4. રિફંડ નીતિ",
    "Once a service or consultation is booked and completed, no refunds will be issued under any circumstances. The guidance provided is final and cannot be reversed. However, we may offer rescheduling at our discretion.": "એકવાર સેવા અથવા પરામર્શ બુક અને પૂર્ણ થયા પછી, કોઈપણ સંજોગોમાં રિફંડ આપવામાં આવશે નહીં. આપેલ માર્ગદર્શન અંતિમ છે અને તેને ઉલટાવી શકાતું નથી. જો કે, અમે અમારા વિવેકબુદ્ધિથી પુનઃ શેડ્યુલિંગ ઓફર કરી શકીએ છીએ.",
    "5. Age Requirement": "5. ઉંમરની જરૂરિયાત",
    "Our website and services are intended for users aged 18 years and above.": "અમારી વેબસાઇટ અને સેવાઓ 18 વર્ષ અને તેથી વધુ ઉંમરના વપરાશકર્તાઓ માટે છે.",
    "Users under the age of 18 should not provide any personal information on this website.": "18 વર્ષથી ઓછી ઉંમરના વપરાશકર્તાઓએ આ વેબસાઇટ પર કોઈ વ્યક્તિગત માહિતી આપવી જોઈએ નહીં.",
    "We do not knowingly collect personal data from children under 18.": "અમે જાણીજોઈને 18 વર્ષથી ઓછી ઉંમરના બાળકો પાસેથી વ્યક્તિગત ડેટા એકત્રિત કરતા નથી.",
    "If we discover that such information has been provided, we will promptly delete it.": "જો અમને ખબર પડે કે આવી માહિતી આપવામાં આવી છે, તો અમે તેને તાત્કાલિક કાઢી નાખીશું.",
    "By using this website, you confirm that you meet the minimum age requirement.": "આ વેબસાઇટનો ઉપયોગ કરીને, તમે પુષ્ટિ કરો છો કે તમે લઘુત્તમ ઉંમરની જરૂરિયાત પૂર્ણ કરો છો.",
    "6. Required Birth Details Policy": "6. જરૂરી જન્મ વિગતો નીતિ",
    "To provide accurate and effective astrology consultation, it is mandatory for the client to share the following correct birth details:": "સચોટ અને અસરકારક જ્યોતિષ પરામર્શ પ્રદાન કરવા માટે, ગ્રાહક માટે નીચેની સાચી જન્મ વિગતો શેર કરવી ફરજિયાત છે:",
    "Birth Date": "જન્મ તારીખ",
    "Birth Time": "જન્મ સમય",
    "Birth Place": "જન્મ સ્થળ",
  },
  en: {
    Home: "Home",
    Services: "Services",
    Book: "Book",
    Feedback: "Feedback",
    About: "About",
    Online: "Online",
    "Online Consulting": "Online Consulting",
    Login: "Login",
    "Login / Sign Up": "Login / Sign Up",
    "View Profile": "View Profile",
    "Begin Your Journey": "Begin Your Journey",
    "View All Services": "View All Services",
    "Home Consultation": "Home Consultation",
    "Online Meeting": "Online Meeting",
    "Book Now": "Book Now",
    "Sign In": "Sign In",
    "Sign Up": "Sign Up",
    "Log Out": "Log Out",
    Profile: "Profile",
    "Quick Links": "Quick Links",
    Contact: "Contact",
    Timing: "Timing",
    "Full Name": "Full Name",
    Phone: "Phone",
    Email: "Email",
    Address: "Address",
    Gender: "Gender",
    Date: "Date",
    Time: "Time",
    Place: "Place",
    Confirmed: "Confirmed",
    Pending: "Pending",
    Cancelled: "Cancelled",
    Terms: "Terms",
    Privacy: "Privacy",
    "Refund Policy": "Refund Policy",
    "Back to Home": "Back to Home",
    Settings: "Settings",
    Dashboard: "Dashboard",
    Bookings: "Bookings",
    Users: "Users",
    "Save Changes": "Save Changes",
    Close: "Close",
    Submit: "Submit",
    Continue: "Continue",
    Back: "Back",
    male: "Male",
    female: "Female",
    other: "Other",
    home: "Home",
    office: "Office",
    online: "Online",
    Rashifal: "Daily Horoscope",
    Blog: "Blog",
    "Daily Horoscope": "Daily Horoscope",
    "Select Date": "Select Date",
    "Select Time": "Select Time",
    "Admin Portal": "Admin Portal",
    "Secure access to Katyaayani Astrology management": "Secure access to Katyaayani Astrology management",
    "Admin Login": "Admin Login",
    "Verify Password": "Verify Password",
    "Two-Factor Authentication": "Two-Factor Authentication",
    "Enter your administrator email": "Enter your administrator email",
    "Enter your password to continue": "Enter your password to continue",
    "Enter the 6-digit code sent to your Telegram/Email": "Enter the 6-digit code sent to your Telegram/Email",
    "Email Address": "Email Address",
    Password: "Password",
    "Please enter a valid email": "Please enter a valid email",
    "Invalid credentials": "Invalid credentials",
    "An error occurred. Please try again.": "An error occurred. Please try again.",
    "Invalid verification code": "Invalid verification code",
    "Enter the 6-digit verification code": "Enter the 6-digit verification code",
    "Submit OTP": "Submit OTP",
    "All rights reserved.": "All rights reserved.",
    "Reset Destiny": "Reset Password",
    "Request Sent": "Request Sent",
    "Our celestial guides will help you regain access to your spiritual account.": "Our celestial guides will help you regain access to your spiritual account.",
    "Your request has been channeled to our admin team.": "Your request has been channeled to our admin team.",
    "Registered Email": "Registered Email",
    "Phone Number": "Phone Number",
    "Verification Details (Optional)": "Verification Details (Optional)",
    "Submit Request": "Submit Request",
    "Back to Sign In": "Back to Sign In",
    "Return to cosmic gateway": "Return to sign in",
    "Booking Successful!": "Booking Successful!",
    "Your astrology consultation has been successfully booked.": "Your astrology consultation has been successfully booked.",
    "Details": "Details",
    "Go to Home": "Go to Home",
    "Loading...": "Loading...",
    "Confirming payment...": "Confirming payment...",
    "Loading booking details...": "Loading booking details...",
    "Disclaimer": "Disclaimer",
    "All astrology-related information on this website is for guidance purposes only. For legal, financial, medical, or personal matters, professional advice should be sought.": "All astrology-related information on this website is for guidance purposes only. For legal, financial, medical, or personal matters, professional advice should be sought.",
    "Guarantee of Results": "Guarantee of Results",
    "Astrological services do not guarantee future outcomes. Results may vary depending on individual circumstances and personal actions. Accordingly, and in line with the prescribed parameters, the achievement of specific results cannot be assured.": "Astrological services do not guarantee future outcomes. Results may vary depending on individual circumstances and personal actions. Accordingly, and in line with the prescribed parameters, the achievement of specific results cannot be assured.",
    "Privacy Policy": "Privacy Policy",
    "We respect your privacy and protect your personal information.": "We respect your privacy and protect your personal information.",
    "We collect details such as name, email, date, time, and place of birth only when you voluntarily provide them.": "We collect details such as name, email, date, time, and place of birth only when you voluntarily provide them.",
    "Information is used to provide astrology readings and personalized content.": "Information is used to provide astrology readings and personalized content.",
    "Non-personal data (browser type, site usage) may be collected for analytics and improvement.": "Non-personal data (browser type, site usage) may be collected for analytics and improvement.",
    "We do not sell, rent, or trade your personal data to third parties.": "We do not sell, rent, or trade your personal data to third parties.",
    "Reasonable security measures are taken to protect your information.": "Reasonable security measures are taken to protect your information.",
    "By using our website, you agree to this Privacy Policy.": "By using our website, you agree to this Privacy Policy.",
    "Terms and Conditions": "Terms and Conditions",
    "1. Services": "1. Services",
    "This website provides astrology services including birth chart analysis, horoscope reading, marriage matching, numerology, and consultations. These services are based on traditional beliefs and experience.": "This website provides astrology services including birth chart analysis, horoscope reading, marriage matching, numerology, and consultations. These services are based on traditional beliefs and experience.",
    "2. Acceptance of Terms": "2. Acceptance of Terms",
    "By using this website, you agree to these terms and conditions. If you do not agree, please do not use the website.": "By using this website, you agree to these terms and conditions. If you do not agree, please do not use the website.",
    "3. Guarantee of Results": "3. Guarantee of Results",
    "4. Refund Policy": "4. Refund Policy",
    "Once a service or consultation is booked and completed, no refunds will be issued under any circumstances. The guidance provided is final and cannot be reversed. However, we may offer rescheduling at our discretion.": "Once a service or consultation is booked and completed, no refunds will be issued under any circumstances. The guidance provided is final and cannot be reversed. However, we may offer rescheduling at our discretion.",
    "5. Age Requirement": "5. Age Requirement",
    "Our website and services are intended for users aged 18 years and above.": "Our website and services are intended for users aged 18 years and above.",
    "Users under the age of 18 should not provide any personal information on this website.": "Users under the age of 18 should not provide any personal information on this website.",
    "We do not knowingly collect personal data from children under 18.": "We do not knowingly collect personal data from children under 18.",
    "If we discover that such information has been provided, we will promptly delete it.": "If we discover that such information has been provided, we will promptly delete it.",
    "By using this website, you confirm that you meet the minimum age requirement.": "By using this website, you confirm that you meet the minimum age requirement.",
    "6. Required Birth Details Policy": "6. Required Birth Details Policy",
    "To provide accurate and effective astrology consultation, it is mandatory for the client to share the following correct birth details:": "To provide accurate and effective astrology consultation, it is mandatory for the client to share the following correct birth details:",
    "Birth Date": "Birth Date",
    "Birth Time": "Birth Time",
    "Birth Place": "Birth Place",
  },
};

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const TranslationContext = createContext<TranslationContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function useTranslation() {
  return useContext(TranslationContext);
}

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("preferred-language") as Language;
    if (saved && (saved === "hi" || saved === "gu" || saved === "en")) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferred-language", lang);
  };

  const t = (key: string): string => {
    if (!key) return "";
    // ALWAYS use English during hydration (matching server render)
    // After mounting, we can use the selected language.
    const lang = isMounted ? language : "en";

      // Check inline translations first
      const langTranslations = translations[lang];
      if (langTranslations && langTranslations[key]) return langTranslations[key];
      // Fallback to comprehensive dictionary
      const dictResult = translateText(key, lang);
      if (dictResult) return dictResult;
      return key;
    };

    return (
      <TranslationContext.Provider
        value={{ language, setLanguage: handleSetLanguage, t }}
      >
        <DOMTranslator language={language} />
        {children}
      </TranslationContext.Provider>
    );
}

export default function GoogleTranslateWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "hi", label: "Hindi", flag: "IN" },
    { code: "gu", label: "Gujarati", flag: "IN" },
    { code: "en", label: "English", flag: "GB" },
  ];

  const currentLang =
    languages.find((l) => l.code === language) || languages[0];

  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-colors"
        >
          <Languages className="w-3 h-3" />
            <span className="text-sm">English</span>
          <ChevronDown className="w-2.5 h-2.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-colors"
      >
        <Languages className="w-3 h-3" />
        <span className="text-sm">{currentLang.label}</span>
        <ChevronDown
          className={`w-2.5 h-2.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white dark:bg-[#1a1a2e] border border-[#ff6b35]/30 rounded-md shadow-lg overflow-hidden z-50 min-w-[110px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-left text-sm hover:bg-[#ff6b35]/10 flex items-center gap-2 ${
                language === lang.code
                  ? "bg-[#ff6b35]/20 text-[#ff6b35]"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
