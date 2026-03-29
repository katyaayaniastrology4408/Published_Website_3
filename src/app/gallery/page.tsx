import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { getSeoMetadata, generateSchemaMarkup } from "@/lib/seo";
import Link from "next/link";
import { ImageIcon, ChevronRight, Home } from "lucide-react";

import Image from "next/image";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function generateMetadata(): Promise<Metadata> {
  return await getSeoMetadata("/gallery");
}

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function GalleryPage() {
  const supabase = getSupabase();
  const { data: images } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const schema = generateSchemaMarkup("/gallery");

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-[#0a0a0f] text-[#2d1810] dark:text-[#f5f0e8] pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
          <Link href="/" className="hover:text-[#ff6b35] transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 opacity-30" />
          <span className="text-[#ff6b35]">Pictures Gallery</span>
        </nav>

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <ImageIcon className="w-3 h-3" /> Visual Wisdom
          </div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-black text-[#ff6b35] mb-4 tracking-tight">
            Sacred Gallery
          </h1>
          <div className="w-24 h-1 bg-[#ff6b35] mx-auto mb-6 rounded-full opacity-30"></div>
          <p className="max-w-2xl mx-auto text-muted-foreground text-sm md:text-base leading-relaxed italic">
            Explore our collection of sacred Vedic, spiritual, and astrological pictures curated by Katyaayani Astrologer.
          </p>
        </header>

        {/* Image Grid */}
        {!images || images.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-[#ff6b35]/10 rounded-3xl">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground italic">No pictures have been added to the gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {images.map((img) => (
              <article 
                key={img.id}
                className="group relative flex flex-col bg-white dark:bg-[#12121a] rounded-3xl overflow-hidden border border-[#ff6b35]/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                  <div className="aspect-[4/5] overflow-hidden bg-black/5 relative">
                    <Image
                      src={img.image_url} 
                      alt={img.description || img.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Overlay for better readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                
                <div className="p-6">
                  <h2 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#ff6b35] mb-2 group-hover:translate-x-1 transition-transform">
                    {img.title || "Untitiled Visual"}
                  </h2>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {img.description}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-[#ff6b35]/5 flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/50">
                      {new Date(img.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                    <button className="text-[10px] font-black uppercase text-[#ff6b35] hover:tracking-widest transition-all">
                      View Full
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer Banner */}
        <div className="mt-20 p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-[#ff6b35] to-[#ff8c5e] text-white text-center shadow-2xl shadow-[#ff6b35]/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-black mb-4 relative z-10">
            Seeking Personalized Guidance?
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8 relative z-10">
            Ancient wisdom tailored for your modern life. Book a consultation with Katyaayani Astrologer today.
          </p>
          <Link 
            href="/booking" 
            className="inline-flex items-center gap-2 bg-white text-[#ff6b35] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10"
          >
            Book Consultation <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
