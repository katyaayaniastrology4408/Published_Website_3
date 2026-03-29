"use client";
import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Upload, 
  ImageIcon, 
  Loader2, 
    Globe, 
    Search,
    ExternalLink,
    Edit3,
    Check,
    CheckCircle2,
    AlertCircle,
    Sparkles
  } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
  created_at: string;
  source_table?: string;
  source_id?: string;
}

export default function GalleryPanel({ isDark, t }: { isDark: boolean; t: (key: string) => string }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [searchQuery, setSearchTerm] = useState("");
  
  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
    file: null as File | null
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('gallery')
        .update({
          title: editForm.title,
          description: editForm.description
        })
        .eq('id', id);

      if (error) throw error;

      setImages(images.map(img => img.id === id ? { ...img, ...editForm } : img));
      setEditingId(null);
      setSuccess("Image updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update image");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.file) {
      setError("Please select an image");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      const file = newImage.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery/${Date.now()}.${fileExt}`;

      // 1. Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-uploads') // Using existing bucket
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-uploads')
        .getPublicUrl(fileName);

      // 3. Save to database
      const { data: dbData, error: dbError } = await supabase
        .from('gallery')
        .insert({
          image_url: publicUrl,
          title: newImage.title,
          description: newImage.description
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setImages([dbData, ...images]);
      setNewImage({ title: "", description: "", file: null });
      setSuccess("Image uploaded successfully!");
      
      // 4. Trigger indexing automatically
      handleIndex(publicUrl);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      setImages(images.filter(img => img.id !== id));
      setSuccess("Image removed from gallery");
    } catch (err) {
      console.error(err);
      setError("Failed to delete image");
    }
  };

  const handleIndex = async (url?: string) => {
    setIsIndexing(true);
    try {
      const res = await fetch('/api/admin/sitemap/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          urls: [url || window.location.origin + '/gallery'] 
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Indexing request sent to Google and Bing!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsIndexing(false);
    }
  };

  const filteredImages = images.filter(img => 
    img.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    img.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">
            {t("Pictures Gallery")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("Manage website pictures for Google & Bing Images indexing")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleIndex()} 
            disabled={isIndexing}
            className="border-[#ff6b35]/20 text-[#ff6b35]"
          >
            {isIndexing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
            {t("Re-index Gallery")}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
          <CardHeader>
            <CardTitle className="text-[#ff6b35] flex items-center gap-2">
              <Plus className="w-5 h-5" /> {t("Upload New Picture")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("Picture Title")}</Label>
                <Input 
                  placeholder="e.g. Ancient Vedic Temple" 
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("Description (SEO Alt Text)")}</Label>
                <Input 
                  placeholder="Describe the picture for Google search..." 
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("Select Image")}</Label>
                <div className="border-2 border-dashed border-[#ff6b35]/20 rounded-xl p-6 text-center hover:bg-[#ff6b35]/5 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setNewImage({ ...newImage, file: e.target.files?.[0] || null })}
                  />
                  {newImage.file ? (
                    <div className="flex items-center justify-center gap-2 text-[#ff6b35]">
                      <CheckCircle2 className="w-8 h-8" />
                      <span className="text-sm font-bold truncate max-w-[150px]">{newImage.file.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{t("Click or drag to upload (Max 5MB)")}</p>
                    </div>
                  )}
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#ff6b35] text-white hover:bg-[#ff6b35]/90 h-12 font-bold"
                disabled={isUploading || !newImage.file}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                {t("Upload to Gallery")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        <Card className={`lg:col-span-2 ${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> {t("Current Pictures")}
                </CardTitle>
                <CardDescription>{images.length} {t("images indexed")}</CardDescription>
              </div>
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input 
                  placeholder={t("Search...")} 
                  value={searchQuery}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-8 h-8 text-xs ${isDark ? 'bg-white/5 border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'}`}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#ff6b35]" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground italic">
                {searchQuery ? t("No matching pictures found.") : t("No pictures in gallery yet.")}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredImages.map((img) => (
                    <motion.div 
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-[#ff6b35]/10 bg-black/5"
                    >
                      <img 
                        src={img.image_url} 
                        alt={img.description} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                          <div className="flex justify-between items-start">
                            {img.source_table ? (
                              <div className="bg-[#ff6b35] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <Sparkles className="w-2 h-2" /> {t("AUTO")}
                              </div>
                            ) : <div></div>}
                            <div className="flex gap-1">
                              <button 
                                onClick={() => {
                                  setEditingId(img.id);
                                  setEditForm({ title: img.title || "", description: img.description || "" });
                                }}
                                className="p-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                                <button 
                                  onClick={() => handleDelete(img.id, img.image_url)}
                                  className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(img.image_url);
                                    setSuccess("Image URL copied to clipboard!");
                                  }}
                                  className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                  title="Copy URL"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                          </div>
                          
                          {editingId === img.id ? (
                            <div className="space-y-1 bg-black/40 p-2 rounded-lg backdrop-blur-sm border border-white/10" onClick={(e) => e.stopPropagation()}>
                              <Input 
                                size={1}
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="h-6 text-[10px] bg-white/20 border-white/20 text-white placeholder:text-white/50"
                                placeholder="Title"
                              />
                              <Input 
                                size={1}
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="h-6 text-[10px] bg-white/20 border-white/20 text-white placeholder:text-white/50"
                                placeholder="Description"
                              />
                              <div className="flex gap-1 pt-1">
                                <Button 
                                  size="sm" 
                                  className="h-6 flex-1 text-[8px] bg-green-500 hover:bg-green-600 text-white"
                                  onClick={() => handleUpdate(img.id)}
                                  disabled={isSaving}
                                >
                                  {isSaving ? <Loader2 className="w-2 h-2 animate-spin" /> : <Check className="w-2 h-2 mr-1" />}
                                  {t("Save")}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-6 flex-1 text-[8px] bg-white/10 hover:bg-white/20 text-white"
                                  onClick={() => setEditingId(null)}
                                >
                                  {t("Cancel")}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-white">
                              <p className="text-xs font-bold truncate">{img.title || "Untitled"}</p>
                              <p className="text-[10px] opacity-70 line-clamp-2">{img.description}</p>
                            </div>
                          )}
                        </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
