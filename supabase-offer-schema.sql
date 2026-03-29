-- 1. Create the offer_settings table
CREATE TABLE IF NOT EXISTS offer_settings (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    original_price NUMERIC DEFAULT 501,
    offer_price NUMERIC DEFAULT 501,
    title TEXT DEFAULT 'First 50 Users Special Offer',
    urgency_text TEXT DEFAULT 'Only 50 Slots Available',
    popup_text TEXT DEFAULT '🎉 First 50 Users Offer – Book Now at ₹501 Only!',
    max_slots INTEGER DEFAULT 50,
    used_slots INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Insert initial configuration (Active for 6 months)
INSERT INTO offer_settings (id, is_active, title, urgency_text, popup_text, max_slots, used_slots, original_price, offer_price, start_date, end_date)
SELECT 1, true, 'First 50 Users Special Offer', 'Only 50 Slots Available', '🎉 First 50 Users Offer – Book Now at ₹501 Only!', 50, 0, 501, 501, NOW(), NOW() + INTERVAL '6 months'
WHERE NOT EXISTS (SELECT 1 FROM offer_settings WHERE id = 1);
