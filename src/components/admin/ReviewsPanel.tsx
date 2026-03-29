import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, Trash2, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Review = {
  id: string;
  name: string;
  rating: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  created_at: string;
};

export default function ReviewsPanel({ isDark, t, setSuccess, setError }: any) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        }
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError(t("Failed to load reviews"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
          setSuccess(t(`Review ${status} successfully`));
        }
      } else {
        setError(t("Failed to update status"));
      }
    } catch (err) {
      console.error("Update status error:", err);
      setError(t("An error occurred"));
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !currentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews(reviews.map(r => r.id === id ? { ...r, is_featured: !currentStatus } : r));
          setSuccess(t(currentStatus ? "Removed from featured" : "Marked as featured"));
        }
      }
    } catch (err) {
      console.error("Toggle featured error:", err);
      setError(t("An error occurred"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("Are you sure you want to delete this review?"))) return;
    
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews(reviews.filter(r => r.id !== id));
          setSuccess(t("Review deleted successfully"));
        }
      }
    } catch (err) {
      console.error("Delete review error:", err);
      setError(t("An error occurred"));
    }
  };

  const handleInitializeDb = async () => {
    if (!confirm(t("This will create missing database tables. Continue?"))) return;
    setIsInitializing(true);
    try {
      const res = await fetch("/api/admin/setup-db");
      const data = await res.json();
      if (data.success) {
        setSuccess(t("Database initialized successfully!"));
        fetchReviews();
      } else {
        setError(data.error || t("Failed to initialize database"));
      }
    } catch (err) {
      console.error("DB Initialization error:", err);
      setError(t("An error occurred during initialization"));
    } finally {
      setIsInitializing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardContent className="p-10 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const filteredReviews = reviews.filter(r => filterMode === 'all' || r.status === filterMode);

  return (
    <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
      <CardHeader className="flex flex-row items-center justify-between border-b border-[#ff6b35]/10 pb-4">
        <div>
          <CardTitle className="text-xl font-bold font-[family-name:var(--font-cinzel)] text-[#ff6b35] flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> 
            {t("Review & Rating Management")}
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleInitializeDb}
            disabled={isInitializing}
            className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
          >
            {isInitializing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
            {t("Initialize DB")}
          </Button>
          {['all', 'pending', 'approved', 'rejected'].map(mode => (
            <Button
              key={mode}
              variant={filterMode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMode(mode as any)}
              className={filterMode === mode ? 'bg-[#ff6b35] hover:bg-[#ff8c5e]' : ''}
            >
              {t(mode.charAt(0).toUpperCase() + mode.slice(1))}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <p className="text-muted-foreground">{t("No reviews found or table missing.")}</p>
            <Button 
                onClick={handleInitializeDb} 
                disabled={isInitializing}
                variant="outline"
                className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/5"
            >
                {isInitializing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                {t("Setup Reviews Table")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map(review => (
              <div key={review.id} className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start ${isDark ? 'bg-[#1a1a2e] border-white/10' : 'bg-[#fffaf5] border-[#ff6b35]/20'}`}>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg">{review.name}</h4>
                    <div className="flex items-center text-amber-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    {review.status === 'pending' && <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>}
                    {review.status === 'approved' && <Badge variant="outline" className="text-green-500 border-green-500">Approved</Badge>}
                    {review.status === 'rejected' && <Badge variant="outline" className="text-red-500 border-red-500">Rejected</Badge>}
                    {review.is_featured && <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>}
                  </div>
                  <p className="text-sm opacity-80">{review.message}</p>
                  <p className="text-xs opacity-50">{format(new Date(review.created_at), "dd MMM yyyy, hh:mm a")}</p>
                </div>
                
                <div className="flex flex-col gap-2 min-w-[140px]">
                  {review.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateStatus(review.id, 'approved')} className="bg-green-500 hover:bg-green-600 flex-1">
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateStatus(review.id, 'rejected')} variant="destructive" className="flex-1">
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}

                  {review.status === 'approved' && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5">
                      <Label className="text-xs cursor-pointer">Featured</Label>
                      <Switch 
                        checked={review.is_featured} 
                        onCheckedChange={() => handleToggleFeatured(review.id, review.is_featured)} 
                      />
                    </div>
                  )}

                  {review.status !== 'pending' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdateStatus(review.id, review.status === 'approved' ? 'rejected' : 'approved')}
                      className={review.status === 'approved' ? "text-red-500" : "text-green-500"}
                    >
                      {review.status === 'approved' ? "Move to Rejected" : "Move to Approved"}
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" onClick={() => handleDelete(review.id)} className="text-red-500 hover:bg-red-500/10 hover:text-red-600">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
