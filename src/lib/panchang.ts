/**
 * Hindu Panchang Calculator
 * Calculates daily tithi, paksha, nakshatra, yoga, karana, rashi
 * Based on astronomical calculations using lunar/solar positions
 */

// ======= Tithi Data =======
const TITHIS = [
  { number: 1, english: 'Pratipada', hindi: 'प्रतिपदा', gujarati: 'પ્રતિપદા' },
  { number: 2, english: 'Dwitiya', hindi: 'द्वितीया', gujarati: 'દ્વિતીયા' },
  { number: 3, english: 'Tritiya', hindi: 'तृतीया', gujarati: 'તૃતીયા' },
  { number: 4, english: 'Chaturthi', hindi: 'चतुर्थी', gujarati: 'ચતુર્થી' },
  { number: 5, english: 'Panchami', hindi: 'पंचमी', gujarati: 'પંચમી' },
  { number: 6, english: 'Shashthi', hindi: 'षष्ठी', gujarati: 'ષષ્ઠી' },
  { number: 7, english: 'Saptami', hindi: 'सप्तमी', gujarati: 'સપ્તમી' },
  { number: 8, english: 'Ashtami', hindi: 'अष्टमी', gujarati: 'અષ્ટમી' },
  { number: 9, english: 'Navami', hindi: 'नवमी', gujarati: 'નવમી' },
  { number: 10, english: 'Dashami', hindi: 'दशमी', gujarati: 'દશમી' },
  { number: 11, english: 'Ekadashi', hindi: 'एकादशी', gujarati: 'એકાદશી' },
  { number: 12, english: 'Dwadashi', hindi: 'द्वादशी', gujarati: 'દ્વાદશી' },
  { number: 13, english: 'Trayodashi', hindi: 'त्रयोदशी', gujarati: 'ત્રયોદશી' },
  { number: 14, english: 'Chaturdashi', hindi: 'चतुर्दशी', gujarati: 'ચતુર્દશી' },
  { number: 15, english: 'Purnima', hindi: 'पूर्णिमा', gujarati: 'પૂર્ણિમા' },
  { number: 16, english: 'Pratipada', hindi: 'प्रतिपदा', gujarati: 'પ્રતિપદા' },
  { number: 17, english: 'Dwitiya', hindi: 'द्वितीया', gujarati: 'દ્વિતીયા' },
  { number: 18, english: 'Tritiya', hindi: 'तृतीया', gujarati: 'તૃતીયા' },
  { number: 19, english: 'Chaturthi', hindi: 'चतुर्थी', gujarati: 'ચતુર્થી' },
  { number: 20, english: 'Panchami', hindi: 'पंचमी', gujarati: 'પંચમી' },
  { number: 21, english: 'Shashthi', hindi: 'षष्ठी', gujarati: 'ષષ્ઠી' },
  { number: 22, english: 'Saptami', hindi: 'सप्तमी', gujarati: 'સપ્તમી' },
  { number: 23, english: 'Ashtami', hindi: 'अष्टमी', gujarati: 'અષ્ટમી' },
  { number: 24, english: 'Navami', hindi: 'नवमी', gujarati: 'નવમી' },
  { number: 25, english: 'Dashami', hindi: 'दशमी', gujarati: 'દશમી' },
  { number: 26, english: 'Ekadashi', hindi: 'एकादशी', gujarati: 'એકાદશી' },
  { number: 27, english: 'Dwadashi', hindi: 'द्वादशी', gujarati: 'દ્વાદશી' },
  { number: 28, english: 'Trayodashi', hindi: 'त्रयोदशी', gujarati: 'ત્રયોદશી' },
  { number: 29, english: 'Chaturdashi', hindi: 'चतुर्दशी', gujarati: 'ચતુર્દશી' },
  { number: 30, english: 'Amavasya', hindi: 'अमावस्या', gujarati: 'અમાવસ્યા' },
];

// ======= Nakshatra Data =======
const NAKSHATRAS = [
  { english: 'Ashwini', hindi: 'अश्विनी', gujarati: 'અશ્વિની' },
  { english: 'Bharani', hindi: 'भरणी', gujarati: 'ભરણી' },
  { english: 'Krittika', hindi: 'कृत्तिका', gujarati: 'કૃત્તિકા' },
  { english: 'Rohini', hindi: 'रोहिणी', gujarati: 'રોહિણી' },
  { english: 'Mrigashira', hindi: 'मृगशिरा', gujarati: 'મૃગશિરા' },
  { english: 'Ardra', hindi: 'आर्द्रा', gujarati: 'આર્દ્રા' },
  { english: 'Punarvasu', hindi: 'पुनर्वसु', gujarati: 'પુનર્વસુ' },
  { english: 'Pushya', hindi: 'पुष्य', gujarati: 'પુષ્ય' },
  { english: 'Ashlesha', hindi: 'आश्लेषा', gujarati: 'આશ્લેષા' },
  { english: 'Magha', hindi: 'मघा', gujarati: 'મઘા' },
  { english: 'Purva Phalguni', hindi: 'पूर्वा फाल्गुनी', gujarati: 'પૂર્વા ફાલ્ગુની' },
  { english: 'Uttara Phalguni', hindi: 'उत्तरा फाल्गुनी', gujarati: 'ઉત્તરા ફાલ્ગુની' },
  { english: 'Hasta', hindi: 'हस्त', gujarati: 'હસ્ત' },
  { english: 'Chitra', hindi: 'चित्रा', gujarati: 'ચિત્રા' },
  { english: 'Swati', hindi: 'स्वाति', gujarati: 'સ્વાતિ' },
  { english: 'Vishakha', hindi: 'विशाखा', gujarati: 'વિશાખા' },
  { english: 'Anuradha', hindi: 'अनुराधा', gujarati: 'અનુરાધા' },
  { english: 'Jyeshtha', hindi: 'ज्येष्ठा', gujarati: 'જ્યેષ્ઠા' },
  { english: 'Mula', hindi: 'मूल', gujarati: 'મૂળ' },
  { english: 'Purva Ashadha', hindi: 'पूर्वाषाढ़ा', gujarati: 'પૂર્વાષાઢા' },
  { english: 'Uttara Ashadha', hindi: 'उत्तराषाढ़ा', gujarati: 'ઉત્તરાષાઢા' },
  { english: 'Shravana', hindi: 'श्रवण', gujarati: 'શ્રવણ' },
  { english: 'Dhanishtha', hindi: 'धनिष्ठा', gujarati: 'ધનિષ્ઠા' },
  { english: 'Shatabhisha', hindi: 'शतभिषा', gujarati: 'શતભિષા' },
  { english: 'Purva Bhadrapada', hindi: 'पूर्वा भाद्रपदा', gujarati: 'પૂર્વા ભાદ્રપદા' },
  { english: 'Uttara Bhadrapada', hindi: 'उत्तरा भाद्रपदा', gujarati: 'ઉત્તરા ભાદ્રપદા' },
  { english: 'Revati', hindi: 'रेवती', gujarati: 'રેવતી' },
];

// ======= Yoga Data =======
const YOGAS = [
  { english: 'Vishkumbha', hindi: 'विष्कुम्भ', gujarati: 'વિષ્કુમ્ભ' },
  { english: 'Priti', hindi: 'प्रीति', gujarati: 'પ્રીતિ' },
  { english: 'Ayushman', hindi: 'आयुष्मान', gujarati: 'આયુષ્માન' },
  { english: 'Saubhagya', hindi: 'सौभाग्य', gujarati: 'સૌભાગ્ય' },
  { english: 'Shobhana', hindi: 'शोभन', gujarati: 'શોભન' },
  { english: 'Atiganda', hindi: 'अतिगण्ड', gujarati: 'અતિગંડ' },
  { english: 'Sukarma', hindi: 'सुकर्मा', gujarati: 'સુકર્મા' },
  { english: 'Dhriti', hindi: 'धृति', gujarati: 'ધૃતિ' },
  { english: 'Shula', hindi: 'शूल', gujarati: 'શૂલ' },
  { english: 'Ganda', hindi: 'गण्ड', gujarati: 'ગંડ' },
  { english: 'Vriddhi', hindi: 'वृद्धि', gujarati: 'વૃદ્ધિ' },
  { english: 'Dhruva', hindi: 'ध्रुव', gujarati: 'ધ્રુવ' },
  { english: 'Vyaghata', hindi: 'व्याघात', gujarati: 'વ્યાઘાત' },
  { english: 'Harshana', hindi: 'हर्षण', gujarati: 'હર્ષણ' },
  { english: 'Vajra', hindi: 'वज्र', gujarati: 'વજ્ર' },
  { english: 'Siddhi', hindi: 'सिद्धि', gujarati: 'સિદ્ધિ' },
  { english: 'Vyatipata', hindi: 'व्यतीपात', gujarati: 'વ્યતીપાત' },
  { english: 'Variyana', hindi: 'वरीयान', gujarati: 'વરીયાન' },
  { english: 'Parigha', hindi: 'परिघ', gujarati: 'પરિઘ' },
  { english: 'Shiva', hindi: 'शिव', gujarati: 'શિવ' },
  { english: 'Siddha', hindi: 'सिद्ध', gujarati: 'સિદ્ધ' },
  { english: 'Sadhya', hindi: 'साध्य', gujarati: 'સાધ્ય' },
  { english: 'Shubha', hindi: 'शुभ', gujarati: 'શુભ' },
  { english: 'Shukla', hindi: 'शुक्ल', gujarati: 'શુક્લ' },
  { english: 'Brahma', hindi: 'ब्रह्म', gujarati: 'બ્રહ્મ' },
  { english: 'Indra', hindi: 'इन्द्र', gujarati: 'ઇન્દ્ર' },
  { english: 'Vaidhriti', hindi: 'वैधृति', gujarati: 'વૈધૃતિ' },
];

// ======= Karana Data =======
const KARANAS = [
  { english: 'Bava', hindi: 'बव', gujarati: 'બવ' },
  { english: 'Balava', hindi: 'बालव', gujarati: 'બાલવ' },
  { english: 'Kaulava', hindi: 'कौलव', gujarati: 'કૌલવ' },
  { english: 'Taitila', hindi: 'तैतिल', gujarati: 'તૈતિલ' },
  { english: 'Garaja', hindi: 'गरज', gujarati: 'ગરજ' },
  { english: 'Vanija', hindi: 'वणिज', gujarati: 'વણિજ' },
  { english: 'Vishti', hindi: 'विष्टि', gujarati: 'વિષ્ટિ' },
  { english: 'Shakuni', hindi: 'शकुनि', gujarati: 'શકુની' },
  { english: 'Chatushpada', hindi: 'चतुष्पद', gujarati: 'ચતુષ્પદ' },
  { english: 'Nagava', hindi: 'नागव', gujarati: 'નાગવ' },
  { english: 'Kimstughna', hindi: 'किंस्तुघ्न', gujarati: 'કિંસ્તુઘ્ન' },
];

// ======= Rashi Data =======
const RASHIS = [
  { english: 'Aries (Mesh)', hindi: 'मेष', gujarati: 'મેષ' },
  { english: 'Taurus (Vrishabh)', hindi: 'वृषभ', gujarati: 'વૃષભ' },
  { english: 'Gemini (Mithun)', hindi: 'मिथुन', gujarati: 'મિથુન' },
  { english: 'Cancer (Kark)', hindi: 'कर्क', gujarati: 'કર્ક' },
  { english: 'Leo (Simha)', hindi: 'सिंह', gujarati: 'સિંહ' },
  { english: 'Virgo (Kanya)', hindi: 'कन्या', gujarati: 'કન્યા' },
  { english: 'Libra (Tula)', hindi: 'तुला', gujarati: 'તુલા' },
  { english: 'Scorpio (Vrishchik)', hindi: 'वृश्चिक', gujarati: 'વૃશ્ચિક' },
  { english: 'Sagittarius (Dhanu)', hindi: 'धनु', gujarati: 'ધનુ' },
  { english: 'Capricorn (Makar)', hindi: 'मकर', gujarati: 'મકર' },
  { english: 'Aquarius (Kumbh)', hindi: 'कुंभ', gujarati: 'કુંભ' },
  { english: 'Pisces (Meen)', hindi: 'मीन', gujarati: 'મીન' },
];

// ======= Hindu Month Data =======
const HINDU_MONTHS = [
  { english: 'Chaitra', hindi: 'चैत्र', gujarati: 'ચૈત્ર' },
  { english: 'Vaishakha', hindi: 'वैशाख', gujarati: 'વૈશાખ' },
  { english: 'Jyeshtha', hindi: 'ज्येष्ठ', gujarati: 'જ્યેષ્ઠ' },
  { english: 'Ashadha', hindi: 'आषाढ़', gujarati: 'અષાઢ' },
  { english: 'Shravana', hindi: 'श्रावण', gujarati: 'શ્રાવણ' },
  { english: 'Bhadrapada', hindi: 'भाद्रपद', gujarati: 'ભાદ્રપદ' },
  { english: 'Ashwin', hindi: 'आश्विन', gujarati: 'આશ્વિન' },
  { english: 'Kartik', hindi: 'कार्तिक', gujarati: 'કાર્તિક' },
  { english: 'Margashirsha', hindi: 'मार्गशीर्ष', gujarati: 'માર્ગશીર્ષ' },
  { english: 'Pausha', hindi: 'पौष', gujarati: 'પૌષ' },
  { english: 'Magha', hindi: 'माघ', gujarati: 'માઘ' },
  { english: 'Phalguna', hindi: 'फाल्गुन', gujarati: 'ફાલ્ગુન' },
];

// ======= Vaara (Day) Data =======
const VAARAS = [
  { english: 'Sunday (Ravivaar)', hindi: 'रविवार', gujarati: 'રવિવાર' },
  { english: 'Monday (Somvaar)', hindi: 'सोमवार', gujarati: 'સોમવાર' },
  { english: 'Tuesday (Mangalvaar)', hindi: 'मंगलवार', gujarati: 'મંગળવાર' },
  { english: 'Wednesday (Budhvaar)', hindi: 'बुधवार', gujarati: 'બુધવાર' },
  { english: 'Thursday (Guruvaar)', hindi: 'गुरुवार', gujarati: 'ગુરુવાર' },
  { english: 'Friday (Shukravaar)', hindi: 'शुक्रवार', gujarati: 'શુક્રવાર' },
  { english: 'Saturday (Shanivaar)', hindi: 'शनिवार', gujarati: 'શનિવાર' },
];

// ======= Astronomical Calculations =======

function toJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const h = date.getUTCHours();
  const min = date.getUTCMinutes();
  const s = date.getUTCSeconds();
  
  let year = y;
  let month = m;
  if (m <= 2) {
    year -= 1;
    month += 12;
  }
  
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  
  const jd0h = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + d + B - 1524.5;
  return jd0h + (h + min / 60 + s / 3600) / 24;
}

// Lahiri Ayanamsha (more accurate polynomial)
function getLahiriAyanamsha(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000
  // Lahiri ayanamsha at J2000 = 23° 51' 25.53" ≈ 23.85709167°
  // Precession rate is approx 50.29" per year
  const years = T * 100;
  return 23.85709167 + (50.290966 * years) / 3600;
}

function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // Mean longitude
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    // Mean anomaly
    const Mdeg = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const M = Mdeg * Math.PI / 180;
  
  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
    + 0.000289 * Math.sin(3 * M);
  
  let sunLong = L0 + C;
  // Normalize to 0-360
  sunLong = ((sunLong % 360) + 360) % 360;
  return sunLong;
}

// Full Meeus Chapter 47 Moon longitude (~1 arcmin accuracy)
// Each term: [D, M, Mp, F, sinCoeff] (coefficients in 1e-6 degrees)
const MOON_LON_TERMS: [number, number, number, number, number][] = [
  [0,0,1,0,6288774],[2,0,-1,0,1274027],[2,0,0,0,658314],[0,0,2,0,213618],
  [0,1,0,0,-185116],[0,0,0,2,-114332],[2,0,-2,0,58793],[2,-1,-1,0,57066],
  [2,0,1,0,53322],[2,-1,0,0,45758],[0,1,-1,0,-40923],[1,0,0,0,-34720],
  [0,1,1,0,-30383],[2,0,0,-2,15327],[0,0,1,2,-12528],[0,0,1,-2,10980],
  [4,0,-1,0,10675],[0,0,3,0,10034],[4,0,-2,0,8548],[2,1,-1,0,-7888],
  [2,1,0,0,-6766],[1,0,-1,0,-5163],[1,1,0,0,4987],[2,-1,1,0,4036],
  [2,0,2,0,3994],[4,0,0,0,3861],[2,0,-3,0,3665],[0,1,-2,0,-2689],
  [2,0,-1,2,-2602],[2,-1,-2,0,2390],[1,0,1,0,-2348],[2,-2,0,0,2236],
  [0,1,2,0,-2120],[0,2,0,0,-2069],[2,-2,-1,0,2048],[2,0,1,-2,-1773],
  [2,0,0,2,-1595],[4,-1,-1,0,1215],[0,0,2,2,-1110],[3,0,-1,0,-892],
  [2,1,1,0,-810],[4,-1,-2,0,759],[0,2,-1,0,-713],[2,2,-1,0,-700],
  [2,1,-2,0,691],[2,-1,0,-2,596],[4,0,1,0,549],[0,0,4,0,537],
  [4,-1,0,0,520],[1,0,-2,0,-487],[2,1,0,-2,-399],[0,0,2,-2,-381],
  [1,1,1,0,351],[3,0,-2,0,-340],[4,0,-3,0,330],[2,-1,2,0,327],
  [0,2,1,0,-323],[1,1,-1,0,299],[2,0,3,0,294],
];

function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  // Mean longitude (Lp), mean elongation (D), sun mean anomaly (M),
  // moon mean anomaly (Mp), argument of latitude (F)
    const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000;
    const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000;
    const M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000;
    const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000;
    const F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000;

  // Additives (A1, A2, A3)
  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.290 * T;
  const A3 = 313.45 + 481266.484 * T;

  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;
  const rad = Math.PI / 180;

  const Drad = D * rad, Mrad = M * rad, Mprad = Mp * rad, Frad = F * rad;

  let sigmaL = 0;
  for (const [d, m, mp, f, sl] of MOON_LON_TERMS) {
    const arg = d * Drad + m * Mrad + mp * Mprad + f * Frad;
    let coeff = sl;
    // Apply eccentricity correction for terms involving M
    if (Math.abs(m) === 1) coeff *= E;
    else if (Math.abs(m) === 2) coeff *= E2;
    sigmaL += coeff * Math.sin(arg);
  }

  // Additives to sigmaL
  sigmaL += 3958 * Math.sin(A1 * rad)
          + 1962 * Math.sin((Lp - F) * rad)
          + 318  * Math.sin(A2 * rad);

  let moonLong = Lp + sigmaL / 1000000;
  moonLong = ((moonLong % 360) + 360) % 360;
  return moonLong;
}

// ======= Transition Time Finder =======

/**
 * Binary-search forward from `startDate` (up to ~3 days) to find when
 * an index function returns a different value.  Returns IST time string "HH:MM"
 * and IST date "YYYY-MM-DD" of the transition, or null if no change found.
 */
function findTransitionTime(
  startDate: Date,
  currentIndex: number,
  getIndex: (jd: number) => number,
  maxHours: number = 72,
  stepMinutes: number = 30
): { time: string; date: string } | null {
  const startMs = startDate.getTime();

  // 1. Coarse scan: find the first step where index changes
  let lo = 0;
  let hi = 0;
  const maxSteps = Math.ceil((maxHours * 60) / stepMinutes);
  for (let i = 1; i <= maxSteps; i++) {
    const ms = startMs + i * stepMinutes * 60 * 1000;
    const jd = toJulianDay(new Date(ms));
    const idx = getIndex(jd);
    if (idx !== currentIndex) {
      lo = (i - 1) * stepMinutes * 60 * 1000;
      hi = i * stepMinutes * 60 * 1000;
      break;
    }
  }
  if (hi === 0) return null; // no transition found

  // 2. Binary search to ~1 minute precision
  while (hi - lo > 60 * 1000) {
    const mid = Math.floor((lo + hi) / 2);
    const ms = startMs + mid;
    const jd = toJulianDay(new Date(ms));
    const idx = getIndex(jd);
    if (idx === currentIndex) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  // Transition happens at startMs + hi
  const transitionDate = new Date(startMs + hi);
  // Convert to IST
  const istMs = transitionDate.getTime() + 5.5 * 60 * 60 * 1000;
  const istTransition = new Date(istMs);
  const hours = istTransition.getUTCHours();
  const mins = istTransition.getUTCMinutes();
  const y = istTransition.getUTCFullYear();
  const m = String(istTransition.getUTCMonth() + 1).padStart(2, '0');
  const d = String(istTransition.getUTCDate()).padStart(2, '0');

  return {
    time: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
    date: `${y}-${m}-${d}`,
  };
}

// ======= Panchang Calculation =======

export interface PanchangData {
  date: string;
  vaara: { english: string; hindi: string; gujarati: string };
  tithi: {
    number: number;
    english: string;
    hindi: string;
    gujarati: string;
  };
  paksha: { english: string; hindi: string; gujarati: string };
  nakshatra: { english: string; hindi: string; gujarati: string };
  yoga: { english: string; hindi: string; gujarati: string };
  karana: { english: string; hindi: string; gujarati: string };
  moonRashi: { english: string; hindi: string; gujarati: string };
  sunRashi: { english: string; hindi: string; gujarati: string };
  hinduMonth: { english: string; hindi: string; gujarati: string };
  sunrise: string;
  sunset: string;
  tithiEnd?: { time: string; date: string } | null;
  nakshatraEnd?: { time: string; date: string } | null;
  yogaEnd?: { time: string; date: string } | null;
  karanaEnd?: { time: string; date: string } | null;
  moonRashiEnd?: { time: string; date: string } | null;
  sunRashiEnd?: { time: string; date: string } | null;
}

export function calculatePanchang(date: Date): PanchangData {
  // toJulianDay now uses UTC methods, so just pass the date directly
  const jd = toJulianDay(date);
  const ayanamsha = getLahiriAyanamsha(jd);

  // Compute IST date for vaara (day) and display date: IST = UTC + 5:30
  const istMs = date.getTime() + 5.5 * 60 * 60 * 1000;
  const istDate = new Date(istMs);
  
  const sunLongTropical = getSunLongitude(jd);
  const moonLongTropical = getMoonLongitude(jd);
  
  // Convert to sidereal (Vedic) longitudes
  const sunLong = ((sunLongTropical - ayanamsha) % 360 + 360) % 360;
  const moonLong = ((moonLongTropical - ayanamsha) % 360 + 360) % 360;
  
  // Tithi: Each tithi = 12 degrees of angular distance between moon and sun
  // Use tropical longitudes for tithi (tithi is based on actual angular distance)
    const elongation = ((moonLongTropical - sunLongTropical) % 360 + 360) % 360;
  const tithiIndex = Math.floor(elongation / 12);
  const tithiData = TITHIS[tithiIndex % 30];
  
  // Paksha: Shukla (bright/waxing) for tithi 1-15, Krishna (dark/waning) for 16-30
  const isShukla = tithiIndex < 15;
  const paksha = isShukla
    ? { english: 'Shukla Paksha (Bright Half)', hindi: 'शुक्ल पक्ष', gujarati: 'શુક્લ પક્ષ (સુદ)' }
    : { english: 'Krishna Paksha (Dark Half)', hindi: 'कृष्ण पक्ष', gujarati: 'કૃષ્ણ પક્ષ (વદ)' };
  
  // Nakshatra: Each = 13°20' of sidereal moon longitude
  const nakshatraIndex = Math.floor(moonLong / (360 / 27));
  const nakshatraData = NAKSHATRAS[nakshatraIndex % 27];
  
  // Yoga: (sidereal sun + sidereal moon) / (360/27)
  const yogaDeg = ((sunLong + moonLong) % 360 + 360) % 360;
  const yogaIndex = Math.floor(yogaDeg / (360 / 27));
  const yogaData = YOGAS[yogaIndex % 27];
  
  // Karana: half of tithi, 2 karanas per tithi
  const karanaIndex = Math.floor(elongation / 6) % 11;
  const karanaData = KARANAS[karanaIndex];
  
  // Moon Rashi (sidereal zodiac sign of moon): each = 30 degrees
  const moonRashiIndex = isNaN(moonLong) ? 0 : Math.floor(moonLong / 30);
  const moonRashiData = RASHIS[moonRashiIndex % 12] || RASHIS[0];
  
  // Sun Rashi (sidereal)
  const sunRashiIndex = isNaN(sunLong) ? 0 : Math.floor(sunLong / 30);
  const sunRashiData = RASHIS[sunRashiIndex % 12] || RASHIS[0];
  
  // Hindu month based on sidereal sun's position
  const hinduMonthIndex = isNaN(sunRashiIndex) ? 0 : ((sunRashiIndex + 1) % 12);
  const hinduMonthData = HINDU_MONTHS[hinduMonthIndex] || HINDU_MONTHS[0];
  
    // Vaara (day of week) - use UTC methods on istDate (which has IST offset baked in)
      const dayOfWeek = istDate.getUTCDay();
    const vaaraData = VAARAS[dayOfWeek];
    
    // ======= NOAA Sunrise/Sunset for Ahmedabad (23.03°N, 72.58°E) =======
  const lat = 23.03;
  const lng = 72.58;
  const latRad = lat * Math.PI / 180;
  
    // Julian century from J2000.0 (use noon IST = 06:30 UTC as reference)
    const istNoon = new Date(Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate(), 6, 30, 0));
  const jdNoon = toJulianDay(istNoon);
  const T2 = (jdNoon - 2451545.0) / 36525.0;
  
  // NOAA solar calculations
  const geomMeanLongSun = ((280.46646 + T2 * (36000.76983 + 0.0003032 * T2)) % 360 + 360) % 360;
  const geomMeanAnomSun = 357.52911 + T2 * (35999.05029 - 0.0001537 * T2);
  const eccentEarthOrbit = 0.016708634 - T2 * (0.000042037 + 0.0000001267 * T2);
  const sunEqOfCtr = Math.sin(geomMeanAnomSun * Math.PI / 180) * (1.914602 - T2 * (0.004817 + 0.000014 * T2))
    + Math.sin(2 * geomMeanAnomSun * Math.PI / 180) * (0.019993 - 0.000101 * T2)
    + Math.sin(3 * geomMeanAnomSun * Math.PI / 180) * 0.000289;
  const sunTrueLong = geomMeanLongSun + sunEqOfCtr;
  const sunAppLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * T2) * Math.PI / 180);
  const meanObliqEcliptic = 23 + (26 + ((21.448 - T2 * (46.815 + T2 * (0.00059 - T2 * 0.001813)))) / 60) / 60;
  const obliqCorr = meanObliqEcliptic + 0.00256 * Math.cos((125.04 - 1934.136 * T2) * Math.PI / 180);
  const sunDeclin = Math.asin(Math.sin(obliqCorr * Math.PI / 180) * Math.sin(sunAppLong * Math.PI / 180));
  
  const varY = Math.tan((obliqCorr / 2) * Math.PI / 180) * Math.tan((obliqCorr / 2) * Math.PI / 180);
  const eqOfTime = 4 * (180 / Math.PI) * (
    varY * Math.sin(2 * geomMeanLongSun * Math.PI / 180)
    - 2 * eccentEarthOrbit * Math.sin(geomMeanAnomSun * Math.PI / 180)
    + 4 * eccentEarthOrbit * varY * Math.sin(geomMeanAnomSun * Math.PI / 180) * Math.cos(2 * geomMeanLongSun * Math.PI / 180)
    - 0.5 * varY * varY * Math.sin(4 * geomMeanLongSun * Math.PI / 180)
    - 1.25 * eccentEarthOrbit * eccentEarthOrbit * Math.sin(2 * geomMeanAnomSun * Math.PI / 180)
  );
  
  // Hour angle for sunrise (with refraction correction -0.833°)
  const cosHASunrise = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(latRad) * Math.sin(sunDeclin)) / (Math.cos(latRad) * Math.cos(sunDeclin));
  const haSunrise = Math.acos(Math.max(-1, Math.min(1, cosHASunrise))) * 180 / Math.PI;
  
  // Solar noon in minutes from midnight UTC
  const solarNoonUTC = (720 - 4 * lng - eqOfTime);
  // Convert to IST (UTC + 330 minutes)
  const solarNoonIST = solarNoonUTC + 330;
  const sunriseMinIST = solarNoonIST - haSunrise * 4;
  const sunsetMinIST = solarNoonIST + haSunrise * 4;
  const sunriseHour = sunriseMinIST / 60;
  const sunsetHour = sunsetMinIST / 60;
  
  const formatTime = (h: number) => {
    const hours = Math.floor(h);
    const mins = Math.round((h - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
    // Format IST date as YYYY-MM-DD (use UTC methods since istDate has IST offset)
      const istYear = istDate.getUTCFullYear();
      const istMonth = String(istDate.getUTCMonth() + 1).padStart(2, '0');
      const istDay = String(istDate.getUTCDate()).padStart(2, '0');

    // ======= Compute end/transition times for each element =======
    const getTithiIndex = (jd2: number) => {
      const sl = getSunLongitude(jd2);
      const ml = getMoonLongitude(jd2);
      const elong = ((ml - sl) % 360 + 360) % 360;
      return Math.floor(elong / 12) % 30;
    };
    const getNakshatraIndex = (jd2: number) => {
      const ay = getLahiriAyanamsha(jd2);
      const ml = ((getMoonLongitude(jd2) - ay) % 360 + 360) % 360;
      return Math.floor(ml / (360 / 27)) % 27;
    };
    const getYogaIndex = (jd2: number) => {
      const ay = getLahiriAyanamsha(jd2);
      const sl2 = ((getSunLongitude(jd2) - ay) % 360 + 360) % 360;
      const ml2 = ((getMoonLongitude(jd2) - ay) % 360 + 360) % 360;
      const yd = ((sl2 + ml2) % 360 + 360) % 360;
      return Math.floor(yd / (360 / 27)) % 27;
    };
    const getKaranaIndex = (jd2: number) => {
      const sl = getSunLongitude(jd2);
      const ml = getMoonLongitude(jd2);
      const elong = ((ml - sl) % 360 + 360) % 360;
      return Math.floor(elong / 6) % 11;
    };
    const getMoonRashiIndex = (jd2: number) => {
      const ay = getLahiriAyanamsha(jd2);
      const ml = ((getMoonLongitude(jd2) - ay) % 360 + 360) % 360;
      return Math.floor(ml / 30) % 12;
    };
    const getSunRashiIndex = (jd2: number) => {
      const ay = getLahiriAyanamsha(jd2);
      const sl2 = ((getSunLongitude(jd2) - ay) % 360 + 360) % 360;
      return Math.floor(sl2 / 30) % 12;
    };

    const tithiEnd = findTransitionTime(date, tithiIndex % 30, getTithiIndex, 48, 20);
    const nakshatraEnd = findTransitionTime(date, nakshatraIndex % 27, getNakshatraIndex, 48, 20);
    const yogaEnd = findTransitionTime(date, yogaIndex % 27, getYogaIndex, 48, 20);
    const karanaEnd = findTransitionTime(date, karanaIndex, getKaranaIndex, 24, 10);
    const moonRashiEnd = findTransitionTime(date, moonRashiIndex % 12, getMoonRashiIndex, 72, 60);
    // Sun rashi changes very slowly (~30 days), use large step
    const sunRashiEnd = findTransitionTime(date, sunRashiIndex % 12, getSunRashiIndex, 720, 360);

    return {
        date: `${istYear}-${istMonth}-${istDay}`,
      vaara: vaaraData,
      tithi: tithiData,
      paksha,
      nakshatra: nakshatraData,
      yoga: yogaData,
      karana: karanaData,
      moonRashi: moonRashiData,
      sunRashi: sunRashiData,
      hinduMonth: hinduMonthData,
      sunrise: formatTime(sunriseHour),
      sunset: formatTime(sunsetHour),
      tithiEnd,
      nakshatraEnd,
      yogaEnd,
      karanaEnd,
      moonRashiEnd,
      sunRashiEnd,
    };
}
