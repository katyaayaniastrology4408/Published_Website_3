import { useState, useEffect } from 'react';

export interface OfferSettings {
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  original_price: number;
  offer_price: number;
  title: string;
  urgency_text: string;
  popup_text: string;
  max_slots: number;
  used_slots: number;
  payment_link: string | null;
}

export function useOffer() {
  const [offer, setOffer] = useState<OfferSettings | null>(null);
  const [isOfferValid, setIsOfferValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We append a timestamp to the URL to bypass Next.js client caching
    fetch(`/api/admin/offer?t=${new Date().getTime()}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData && resData.data) {
          const data = resData.data;
          if (data.is_active) {
            const now = new Date();
            const start = data.start_date ? new Date(data.start_date) : null;
            const end = data.end_date ? new Date(data.end_date) : null;

            if ((!start || now >= start) && (!end || now <= end) && (data.used_slots < data.max_slots)) {
              setOffer(data);
              setIsOfferValid(true);
            } else {
              setIsOfferValid(false);
            }
          } else {
            setIsOfferValid(false);
          }
        } else {
          setIsOfferValid(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch offer:", err);
        setIsOfferValid(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePaymentRedirect = () => {
    if (offer?.payment_link) {
      // Use window.parent.postMessage pattern as seen in other components for cross-origin safety if needed,
      // but a direct window.open or location.href is usually what's expected for external booking links.
      window.open(offer.payment_link, '_blank', 'noopener,noreferrer');
    }
  };

  return { offer, isOfferValid, loading, handlePaymentRedirect };
}
