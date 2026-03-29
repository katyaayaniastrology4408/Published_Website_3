import https from 'https';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eochjxjoyibtjawzgauk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2hqeGpveWlidGphd3pnYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE5MjUyNywiZXhwIjoyMDg1NzY4NTI3fQ.9uJ4vHwOZwBfDjzJmgOV6BbrhQi9f0B9CKCRAgjFbQc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Download image from the project uploads
const imageUrl = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/82257351-6e7a-48cd-a2d1-b2ac49e135b9/image-1772510842171.png';

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      console.log('Download status:', res.statusCode);
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Downloading image...');
    const imageBuffer = await downloadImage(imageUrl);
    console.log('Downloaded', imageBuffer.length, 'bytes');

    const fileName = 'holika-dahan-2026.jpg';
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return;
    }

    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
    console.log('Image uploaded successfully!');
    console.log('Public URL:', urlData.publicUrl);

    // Now insert the blog post
    const blogPost = {
      title: 'Holika Dahan 2026: Shubh Muhurat, Katha and the Night of Triumph',
      title_gujarati: 'હોળીકા દહન 2026: શુભ મુહૂર્ત, કથા અને વિજયની રાત',
      title_hindi: 'होलिका दहन 2026: शुभ मुहूर्त, कथा और विजय की रात',
      slug: 'holika-dahan-2026-shubh-muhurat-katha',
      excerpt: 'Holika Dahan falls on March 2, 2026. Discover the sacred muhurat timings (6:43 PM – 8:15 PM and 11:00 PM – 12:51 AM), the ancient story behind it, and how to perform this ritual correctly.',
      excerpt_gujarati: 'હોળીકા દહન 2 માર્ચ 2026 ના રોજ છે. શુભ મુહૂર્ત (સાંજે 6:43 – 8:15 અને રાત્રે 11:00 – 12:51) અને આ પ્રાચીન કથા વિશે જાણો.',
      excerpt_hindi: 'होलिका दहन 2 मार्च 2026 को है। शुभ मुहूर्त (शाम 6:43 – 8:15 और रात 11:00 – 12:51) और इस प्राचीन कथा के बारे में जानें।',
      content: `
<p class="lead">The sky turns amber. The air fills with the scent of camphor and flowers. Families gather around the sacred pyre. Tonight is <strong>Holika Dahan</strong> — the night when fire swallows darkness, and devotion conquers evil. In 2026, this sacred night arrives on <strong>Monday, 2nd March</strong>.</p>

<h2>The Story That Echoes Through Millennia</h2>

<p>Long ago, in the kingdom of Hiranyakashipu — a demon king who had grown so arrogant that he demanded to be worshipped as God — lived a young boy named <strong>Prahlad</strong>. Born into the royal household, Prahlad refused to worship his father. With every breath, he chanted the name of <em>Lord Vishnu</em>.</p>

<p>Furious, Hiranyakashipu tried to kill his own son. Swords could not touch him. Elephants could not crush him. Poisons could not harm him. The boy simply smiled — his faith like an unbreakable shield.</p>

<p>Finally, the demon king turned to his sister <strong>Holika</strong>. She possessed a divine cloak — a gift that made her immune to fire. Hiranyakashipu's plan was simple and cruel: Holika would sit in a great bonfire, holding Prahlad in her lap. The boy would burn. The cloak would protect her.</p>

<p>The pyre was lit. The flames rose high. But then — something extraordinary happened.</p>

<p>The divine cloak, given as a blessing for righteous deeds, flew from Holika and wrapped itself around Prahlad. <strong>The fire consumed Holika. The boy walked out unharmed.</strong></p>

<p>That night, the universe declared its eternal truth: <em>No power on earth can extinguish true devotion.</em></p>

<p>We light the fire every year to remember this. To burn away our own demons — our fear, our ego, our hatred. And to let faith lead us forward.</p>

<h2>Holika Dahan 2026 — Date & Time</h2>

<p><strong>Date:</strong> Monday, 2nd March 2026</p>
<p><strong>Purnima Tithi Begins:</strong> 12th Falgun, Vikram Samvat 2082</p>

<h2>Shubh Muhurat for Holika Dahan 2026</h2>

<p>Timing is everything in Vedic rituals. Performing Holika Dahan within the sacred muhurat ensures the ritual carries its full spiritual power. This year, there are two auspicious windows:</p>

<div class="muhurat-box">
  <h3>🔥 Muhurat 1 (Evening)</h3>
  <p><strong>6:43 PM – 8:15 PM</strong></p>
  <p>This is the primary muhurat — the most auspicious time when Pradosh Kaal begins. The sky is transitioning from dusk to night, which symbolizes the victory of light.</p>
</div>

<div class="muhurat-box">
  <h3>🌙 Muhurat 2 (Night)</h3>
  <p><strong>11:00 PM – 12:51 AM</strong></p>
  <p>For those who miss the evening window, this is a highly auspicious night muhurat. The midnight energy carries a deep spiritual charge, especially for those who wish to perform extended prayers.</p>
</div>

<h2>How to Perform Holika Dahan — Step by Step</h2>

<ol>
  <li><strong>Purify yourself:</strong> Take a bath before sunset. Wear clean, preferably traditional clothes.</li>
  <li><strong>Gather the materials:</strong> Cow dung cakes, wood, coconut, raw cotton thread, turmeric, kumkum, flowers, wheat stalks, and uncooked grains.</li>
  <li><strong>Set up the pyre:</strong> In an open space, arrange the wood and cow dung cakes. Place a small idol or image of Prahlad near the pyre.</li>
  <li><strong>Offer prayers:</strong> Do Puja to Lord Vishnu and Lord Narasimha. Chant <em>Om Namo Bhagavate Vasudevaya</em>.</li>
  <li><strong>Wrap the thread:</strong> Walk around the pyre three to seven times, wrapping the raw cotton thread around it as you go. This symbolizes binding evil.</li>
  <li><strong>Light the fire:</strong> At the exact muhurat time, light the pyre facing East or North.</li>
  <li><strong>Offer into the fire:</strong> Offer coconut, grains, and flowers into the flames while chanting prayers.</li>
  <li><strong>Receive the blessings:</strong> After the fire dies down, the ash is considered sacred. Apply a small amount on your forehead as a blessing.</li>
</ol>

<h2>What Does Holika Dahan Teach Us?</h2>

<p>In the modern world, we face our own Hiranyakashipus — pride, greed, envy, and doubt. We carry our own Holikas — those things that seem powerful but burn when dharma stands firm.</p>

<p>Holika Dahan is not just a ritual. It is a reminder that <strong>faith is fireproof</strong>. That devotion, when pure, cannot be destroyed by any force.</p>

<p>As you watch the flames rise this year on the night of March 2, 2026 — offer into them all that weighs you down. Your worries. Your past. Your fear.</p>

<p>Let it burn. Let it go. And step into Holi — the festival of colours and new beginnings — with a heart made lighter.</p>

<h2>Blessings from Katyaayani Astrologer</h2>

<p>May the sacred fire of Holika Dahan illuminate your path. May Lord Vishnu's grace surround your family. May this Purnima bring health, prosperity, and the joy of victory over all challenges.</p>

<p><em>— Rudram Joshi, Katyaayani Astrologer</em></p>
      `,
      content_gujarati: `
<p class="lead">આકાશ ભૂખરું બની જાય છે. હવામાં કપૂર અને ફૂલોની સુગંધ ફેલાય છે. પરિવારો પવિત્ર ચિતા ફરતે ભેગા થાય છે. આ રાત છે <strong>હોળીકા દહન</strong> — જ્યારે અગ્નિ અંધકારને ગળી જાય છે, અને ભક્તિ અનિષ્ટ પર વિજય પ્રાપ્ત કરે છે. 2026 માં, આ પવિત્ર રાત <strong>સોમવાર, 2 માર્ચ</strong>ના રોજ આવે છે.</p>

<h2>હજારો વર્ષ જૂની કથા</h2>

<p>ઘણા સમય પહેલા, હિરણ્યકશ્યપ — એક રાક્ષસ રાજા — ના રાજ્યમાં <strong>પ્રહ્‍લાદ</strong> નામનો એક નાનો છોકરો રહેતો હતો. પ્રહ્‍લાદ <em>ભગવાન વિષ્ણુ</em>નો ભક્ત હતો. ક્રોધિત રાજાએ પ્રહ્‍લાદ ને ઘણી રીતે મારવાનો પ્રયાસ કર્યો — પરંતુ ભક્તિ ઢાલ બની ગઈ.</p>

<p>છેવટે, રાજાએ પોતાની બહેન <strong>હોળીકા</strong>ની મદદ લીધી. હોળીકા પાસે એક દૈવી ચાદર હતી જે અગ્નિ સામે રક્ષણ આપતી. તે પ્રહ્‍લાદ ને ગોળામાં લઈ ચિતા પર બેઠી — ઇરાદો હતો પ્રહ્‍લાદ ને ભસ્મ કરવાનો.</p>

<p>ચિતા પ્રગટી. જ્વાળાઓ ઊઠી. પણ ચમત્કાર થયો — ચાદર ઊડી ગઈ અને <strong>હોળીકા ભસ્મ થઈ ગઈ. પ્રહ્‍લાદ સહી-સલામત બહાર આવ્યો.</strong></p>

<p>ત્યારથી આ અગ્નિ ઊઠે છે દર વર્ષ — આપણા અહંકારને, ભયને, ઈર્ષ્યાને બાળવા. ભક્તિ હંમેશા જીતે છે.</p>

<h2>હોળીકા દહન 2026 — તારીખ અને સમય</h2>
<p><strong>તારીખ:</strong> સોમવાર, 2 માર્ચ 2026</p>

<h2>શુભ મુહૂર્ત</h2>

<div class="muhurat-box">
  <h3>🔥 મુહૂર્ત 1 (સાંજ)</h3>
  <p><strong>સાંજે 6:43 – 8:15</strong></p>
  <p>પ્રદોષ કાળ — સૌથી ઉત્તમ સમય. આ સમયે અગ્નિ પ્રગટાવવો સૌથી ફળદાયી છે.</p>
</div>

<div class="muhurat-box">
  <h3>🌙 મુહૂર્ત 2 (રાત્રે)</h3>
  <p><strong>રાત્રે 11:00 – 12:51</strong></p>
  <p>જે સ્વજનો સાંજ ચૂકી જાય, તેઓ આ રાત્રે ના ઉત્તમ મુહૂર્ત નો ઉપયોગ કરી શકે છે.</p>
</div>

<h2>કાત્યાયની જ્યોતિષ ના આશીર્વાદ</h2>
<p>આ હોળી આ.ફ, તમારા પરિવારને ભગવાન વિષ્ણુ ની કૃપા, સ્વાસ્થ્ય, સમૃદ્ધિ અને સર્વ સંકટ પર વિજય અર્પે.</p>
<p><em>— રુદ્રમ જોશી, કાત્યાયની જ્યોતિષ</em></p>
      `,
      content_hindi: `
<p class="lead">आसमान नारंगी हो जाता है। हवा में कपूर और फूलों की खुशबू फैल जाती है। परिवार पवित्र चिता के आसपास इकट्ठे होते हैं। यह रात है <strong>होलिका दहन</strong> की — जब अग्नि अंधकार को निगल जाती है और भक्ति बुराई पर विजय पाती है। 2026 में यह पवित्र रात <strong>सोमवार, 2 मार्च</strong> को आती है।</p>

<h2>वह कहानी जो युगों से गूँजती है</h2>

<p>बहुत समय पहले, हिरण्यकशिपु — एक अहंकारी राक्षस राजा — के राज्य में <strong>प्रह्लाद</strong> नाम का एक छोटा बालक रहता था। वह <em>भगवान विष्णु</em> का परम भक्त था। क्रोधित राजा ने अपने पुत्र को मारने के अनेक प्रयास किए — परंतु भक्ति हर बार ढाल बन गई।</p>

<p>अंततः, राजा ने अपनी बहन <strong>होलिका</strong> की सहायता ली। होलिका के पास एक दिव्य वस्त्र था जो उसे अग्नि से बचाता था। वह प्रह्लाद को गोद में लेकर चिता पर बैठ गई।</p>

<p>चिता जली। लपटें उठीं। लेकिन — दिव्य वस्त्र उड़कर प्रह्लाद के चारों ओर लिपट गया। <strong>होलिका भस्म हो गई। प्रह्लाद सुरक्षित बाहर आया।</strong></p>

<p>उस रात ब्रह्मांड ने अपना शाश्वत सत्य घोषित किया: <em>कोई भी शक्ति सच्ची भक्ति को नष्ट नहीं कर सकती।</em></p>

<h2>होलिका दहन 2026 — तिथि और समय</h2>
<p><strong>तिथि:</strong> सोमवार, 2 मार्च 2026</p>

<h2>शुभ मुहूर्त</h2>

<div class="muhurat-box">
  <h3>🔥 मुहूर्त 1 (सायंकाल)</h3>
  <p><strong>शाम 6:43 बजे – रात 8:15 बजे</strong></p>
  <p>यह प्रदोष काल है — होलिका दहन के लिए सर्वोत्तम समय।</p>
</div>

<div class="muhurat-box">
  <h3>🌙 मुहूर्त 2 (रात्रि)</h3>
  <p><strong>रात 11:00 बजे – 12:51 बजे</strong></p>
  <p>जो लोग पहला मुहूर्त चूक जाएं, वे इस रात्रि मुहूर्त का उपयोग कर सकते हैं।</p>
</div>

<h2>काात्यायनी ज्योतिष की ओर से आशीर्वाद</h2>
<p>यह होलिका दहन आपके परिवार को भगवान विष्णु की कृपा, स्वास्थ्य, समृद्धि और सभी बाधाओं पर विजय प्रदान करे।</p>
<p><em>— रुद्रम जोशी, काात्यायनी ज्योतिष</em></p>
      `,
      featured_image: '', // Will be updated after upload
      category: 'festivals',
      tags: ['holika dahan', 'holi 2026', 'muhurat', 'festival', 'vedic astrology'],
      author_name: 'Rudram Joshi',
      is_published: true,
      published_at: new Date('2026-03-02').toISOString(),
      meta_title: 'Holika Dahan 2026: Shubh Muhurat (6:43 PM & 11 PM), Katha & Puja Vidhi',
      meta_description: 'Holika Dahan 2026 date is March 2. Shubh Muhurat: 6:43 PM to 8:15 PM and 11:00 PM to 12:51 AM. Read the sacred story of Prahlad and Holika, puja vidhi, and blessings from Katyaayani Astrologer.',
    };

    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .upsert({ ...blogPost, featured_image: urlData.publicUrl }, { onConflict: 'slug' })
      .select()
      .single();

    if (postError) {
      console.error('Blog post error:', postError);
    } else {
      console.log('Blog post created/updated successfully!');
      console.log('Post ID:', post.id);
      console.log('Slug:', post.slug);
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
