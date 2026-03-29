import { Metadata } from 'next';
import ReviewsPageClient from './ReviewsPageClient';

export const metadata: Metadata = {
  title: 'Client Reviews & Testimonials | Katyaayani Astrologer',
  description: 'Read real reviews and testimonials from our clients worldwide. See how Katyaayani Astrologer has helped them with accurate Vedic astrology guidance.',
};

export default function ReviewsPage() {
  return <ReviewsPageClient />;
}
