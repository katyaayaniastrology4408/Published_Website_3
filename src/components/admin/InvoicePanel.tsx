"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safeJson } from "@/lib/safe-json";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Download, Eye, Trash2, FileText, User, Mail, Phone, MapPin, IndianRupee, X } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

interface Invoice {
  id: string;
  invoice_number: string;
  booking_id: string | null;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  service_type: string;
  service_description: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  notes: string;
  disclaimer: string;
  status: string;
  created_at: string;
}

const COMPANY = {
  name: "Katyaayani Astrologer",
  tagline: "Vedic Astrology & Spiritual Guidance",
  address: "Ahmedabad, Gujarat, India",
  email: "katyaayaniastrologer01@gmail.com",
  phone: "+91 XXXXXXXXXX",
  website: "www.katyaayaniastrologer.com",
  gstin: "",
};

const DEFAULT_DISCLAIMER = "This is a computer-generated invoice and does not require a signature. All consultations are subject to our terms and conditions. No refunds after the consultation has been completed. The information provided during consultation is for guidance purposes only.";

export default function InvoicePanel({ isDark, setSuccess, setError }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    user_name: "", user_email: "", user_phone: "", user_address: "",
    service_type: "Home Consultation (Outside 6.5km)", service_description: "",
      amount: "2101", notes: "", disclaimer: DEFAULT_DISCLAIMER,
  });

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/admin/invoices");
      const data = await safeJson(res);
      if (data.success) setInvoices(data.data || []);
    } catch {
      setError("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleCreate = async () => {
    if (!form.user_name || !form.user_email || !form.service_type || !form.amount) {
      setError("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
        const amt = parseFloat(form.amount) || 0;
        const res = await fetch("/api/admin/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            amount: amt,
            tax_amount: 0,
            total_amount: amt,
          }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess("Invoice created successfully!");
        setShowForm(false);
          setForm({ user_name: "", user_email: "", user_phone: "", user_address: "", service_type: "Home Consultation (Outside 6.5km)", service_description: "", amount: "2101", notes: "", disclaimer: DEFAULT_DISCLAIMER });
        fetchInvoices();
      } else {
        setError(data.error || "Failed to create invoice");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    try {
      const res = await fetch(`/api/admin/invoices?id=${id}`, { method: "DELETE" });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess("Invoice deleted");
        fetchInvoices();
      }
    } catch {
      setError("Failed to delete");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess(`Invoice marked as ${status}`);
        fetchInvoices();
        if (previewInvoice?.id === id) setPreviewInvoice({ ...previewInvoice, status });
      }
    } catch {
      setError("Failed to update");
    }
  };

  const downloadInvoice = (invoice: Invoice) => {
    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem("katyaayani_invoices") || "[]");
    const exists = stored.findIndex((i: any) => i.id === invoice.id);
    if (exists >= 0) stored[exists] = invoice; else stored.push(invoice);
    localStorage.setItem("katyaayani_invoices", JSON.stringify(stored));

    // Generate HTML for print/download
    const html = generateInvoiceHTML(invoice);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); }, 500);
    }
  };

  const generateInvoiceHTML = (inv: Invoice) => `
<!DOCTYPE html>
<html><head><title>Invoice ${inv.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a2e; background: #fff; }
  .invoice-box { max-width: 800px; margin: auto; border: 2px solid #e8e8e8; border-radius: 16px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
  .header h1 { font-size: 28px; font-weight: 900; }
  .header .tagline { font-size: 12px; opacity: 0.8; margin-top: 4px; }
  .header .inv-num { text-align: right; }
  .header .inv-num h2 { font-size: 14px; font-weight: 700; letter-spacing: 1px; }
  .header .inv-num .num { font-size: 20px; font-weight: 900; margin-top: 4px; }
  .header .inv-num .date { font-size: 12px; opacity: 0.8; margin-top: 8px; }
  .body { padding: 30px; }
  .info-row { display: flex; justify-content: space-between; gap: 30px; margin-bottom: 30px; }
  .info-box { flex: 1; }
  .info-box h3 { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #d97706; margin-bottom: 10px; }
  .info-box p { font-size: 13px; line-height: 1.8; color: #444; }
  .info-box .name { font-weight: 700; font-size: 15px; color: #1a1a2e; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #fef3c7; padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #92400e; border-bottom: 2px solid #fbbf24; }
  td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
  .amount-col { text-align: right; }
  .total-section { display: flex; justify-content: flex-end; margin: 20px 0; }
  .total-box { width: 280px; }
  .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
  .total-row.grand { border-top: 2px solid #d97706; padding-top: 12px; margin-top: 4px; font-size: 18px; font-weight: 900; color: #d97706; }
  .notes { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 16px; margin: 20px 0; }
  .notes h4 { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #92400e; margin-bottom: 8px; }
  .notes p { font-size: 12px; line-height: 1.6; color: #666; }
  .disclaimer { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 20px 0; }
  .disclaimer h4 { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 8px; }
  .disclaimer p { font-size: 11px; line-height: 1.6; color: #9ca3af; }
  .footer { text-align: center; padding: 20px 30px; border-top: 1px solid #e8e8e8; background: #fafafa; }
  .footer p { font-size: 11px; color: #999; }
  .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .status.paid { background: #dcfce7; color: #16a34a; }
  .status.sent { background: #dbeafe; color: #2563eb; }
  .status.draft { background: #f3f4f6; color: #6b7280; }
  .status.cancelled { background: #fee2e2; color: #dc2626; }
  @media print { body { padding: 0; } .invoice-box { border: none; } }
</style></head><body>
<div class="invoice-box">
  <div class="header">
    <div>
      <h1>${COMPANY.name}</h1>
      <div class="tagline">${COMPANY.tagline}</div>
    </div>
    <div class="inv-num">
      <h2>INVOICE</h2>
      <div class="num">${inv.invoice_number}</div>
      <div class="date">${new Date(inv.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
      <div style="margin-top:8px"><span class="status ${inv.status}">${inv.status.toUpperCase()}</span></div>
    </div>
  </div>
  <div class="body">
    <div class="info-row">
      <div class="info-box">
        <h3>Bill From</h3>
        <p class="name">${COMPANY.name}</p>
        <p>${COMPANY.address}</p>
        <p>${COMPANY.email}</p>
        <p>${COMPANY.website}</p>
      </div>
      <div class="info-box">
        <h3>Bill To</h3>
        <p class="name">${inv.user_name}</p>
        <p>${inv.user_email}</p>
        ${inv.user_phone ? `<p>${inv.user_phone}</p>` : ''}
        ${inv.user_address ? `<p>${inv.user_address}</p>` : ''}
      </div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Service</th><th>Description</th><th class="amount-col">Amount</th></tr></thead>
      <tbody>
        <tr>
          <td>1</td>
          <td style="font-weight:600">${inv.service_type}</td>
          <td>${inv.service_description || '-'}</td>
          <td class="amount-col" style="font-weight:600">&#8377;${Number(inv.amount).toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>
      <div class="total-section">
        <div class="total-box">
          <div class="total-row grand"><span>Total</span><span>&#8377;${Number(inv.total_amount).toLocaleString('en-IN')}</span></div>
        </div>
      </div>
    ${inv.notes ? `<div class="notes"><h4>Notes</h4><p>${inv.notes}</p></div>` : ''}
    ${inv.disclaimer ? `<div class="disclaimer"><h4>Disclaimer</h4><p>${inv.disclaimer}</p></div>` : ''}
  </div>
  <div class="footer">
    <p>Thank you for choosing ${COMPANY.name} | ${COMPANY.website}</p>
  </div>
</div>
</body></html>`;

  const statusColor = (s: string) => s === "paid" ? "bg-green-500/20 text-green-400" : s === "sent" ? "bg-blue-500/20 text-blue-400" : s === "cancelled" ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black">Invoices</h2>
          <p className="text-sm opacity-50">{invoices.length} total invoices</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-10 font-bold">
          <Plus className="w-4 h-4 mr-2" /> Create Invoice
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className={`${isDark ? "bg-[#12121a] border-white/10" : ""}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">New Invoice</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1"><User className="w-3 h-3 inline mr-1" />User Name *</label>
                <Input value={form.user_name} onChange={e => setForm(p => ({ ...p, user_name: e.target.value }))} placeholder="Full name" className={`rounded-xl ${isDark ? "bg-[#0a0a0f] border-white/10" : ""}`} />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1"><Mail className="w-3 h-3 inline mr-1" />Email *</label>
                <Input value={form.user_email} onChange={e => setForm(p => ({ ...p, user_email: e.target.value }))} placeholder="Email" className={`rounded-xl ${isDark ? "bg-[#0a0a0f] border-white/10" : ""}`} />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1"><Phone className="w-3 h-3 inline mr-1" />Phone</label>
                <Input value={form.user_phone} onChange={e => setForm(p => ({ ...p, user_phone: e.target.value }))} placeholder="Phone" className={`rounded-xl ${isDark ? "bg-[#0a0a0f] border-white/10" : ""}`} />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1"><MapPin className="w-3 h-3 inline mr-1" />Address</label>
                <Input value={form.user_address} onChange={e => setForm(p => ({ ...p, user_address: e.target.value }))} placeholder="Address" className={`rounded-xl ${isDark ? "bg-[#0a0a0f] border-white/10" : ""}`} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <label className="text-xs font-bold opacity-50 block mb-1">Service Type *</label>
                  <select value={form.service_type} onChange={e => {
                    const val = e.target.value;
                    const priceMap: Record<string, string> = {
                      "Home Consultation (Outside 6.5km)": "2101",
                      "Home Consultation (Within 6.5km)": "1101",
                      "Office Consultation": "501",
                    };
                    setForm(p => ({ ...p, service_type: val, amount: priceMap[val] || p.amount }));
                  }} className={`w-full h-10 px-3 rounded-xl border text-sm ${isDark ? "bg-[#0a0a0f] border-white/10 text-white" : "bg-white border-gray-200"}`}>
                    <option>Home Consultation (Outside 6.5km)</option>
                    <option>Home Consultation (Within 6.5km)</option>
                    <option>Office Consultation</option>
                  </select>
                </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Service Description</label>
                <Input value={form.service_description} onChange={e => setForm(p => ({ ...p, service_description: e.target.value }))} placeholder="Description" className={`rounded-xl ${isDark ? "bg-[#0a0a0f] border-white/10" : ""}`} />
              </div>
            </div>
            <div>
                <label className="text-xs font-bold opacity-50 block mb-1"><IndianRupee className="w-3 h-3 inline mr-1" />Amount (INR) *</label>
                <Input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" className={`rounded-xl ${isDark ? "bg-[#0a0a0f] border-white/10" : ""}`} />
              </div>
            <div>
              <label className="text-xs font-bold opacity-50 block mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Additional notes..." rows={3} className={`w-full p-3 rounded-xl border text-sm resize-none ${isDark ? "bg-[#0a0a0f] border-white/10 text-white" : "bg-white border-gray-200"}`} />
            </div>
            <div>
              <label className="text-xs font-bold opacity-50 block mb-1">Disclaimer</label>
              <textarea value={form.disclaimer} onChange={e => setForm(p => ({ ...p, disclaimer: e.target.value }))} rows={3} className={`w-full p-3 rounded-xl border text-sm resize-none ${isDark ? "bg-[#0a0a0f] border-white/10 text-white" : "bg-white border-gray-200"}`} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-11 font-bold">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Invoice"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl h-11">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewInvoice(null)}>
          <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${isDark ? "bg-[#12121a]" : "bg-white"}`} onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}>
              <span className="font-black">Invoice Preview</span>
              <div className="flex gap-2">
                <select value={previewInvoice.status} onChange={e => handleUpdateStatus(previewInvoice.id, e.target.value)} className={`h-8 px-2 rounded-lg border text-xs font-bold ${isDark ? "bg-[#0a0a0f] border-white/10 text-white" : ""}`}>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button size="sm" onClick={() => downloadInvoice(previewInvoice)} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg h-8 text-xs font-bold">
                  <Download className="w-3 h-3 mr-1" /> Download
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPreviewInvoice(null)}><X className="w-4 h-4" /></Button>
              </div>
            </div>
            <div ref={printRef} className="p-6 space-y-6">
              {/* Invoice Preview Content */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-amber-500">{COMPANY.name}</h2>
                  <p className="text-xs opacity-50">{COMPANY.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold opacity-50">INVOICE</p>
                  <p className="font-black text-lg">{previewInvoice.invoice_number}</p>
                  <p className="text-xs opacity-50">{new Date(previewInvoice.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  <Badge className={`mt-1 ${statusColor(previewInvoice.status)}`}>{previewInvoice.status.toUpperCase()}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-amber-500 mb-2">BILL FROM</p>
                  <p className="font-bold text-sm">{COMPANY.name}</p>
                  <p className="text-xs opacity-60">{COMPANY.address}</p>
                  <p className="text-xs opacity-60">{COMPANY.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-amber-500 mb-2">BILL TO</p>
                  <p className="font-bold text-sm">{previewInvoice.user_name}</p>
                  <p className="text-xs opacity-60">{previewInvoice.user_email}</p>
                  {previewInvoice.user_phone && <p className="text-xs opacity-60">{previewInvoice.user_phone}</p>}
                  {previewInvoice.user_address && <p className="text-xs opacity-60">{previewInvoice.user_address}</p>}
                </div>
              </div>
              <div className={`rounded-xl overflow-hidden border ${isDark ? "border-white/10" : "border-gray-200"}`}>
                <table className="w-full">
                  <thead><tr className={`${isDark ? "bg-amber-500/10" : "bg-amber-50"}`}>
                    <th className="p-3 text-left text-[10px] font-bold tracking-widest text-amber-600">#</th>
                    <th className="p-3 text-left text-[10px] font-bold tracking-widest text-amber-600">SERVICE</th>
                    <th className="p-3 text-left text-[10px] font-bold tracking-widest text-amber-600">DESCRIPTION</th>
                    <th className="p-3 text-right text-[10px] font-bold tracking-widest text-amber-600">AMOUNT</th>
                  </tr></thead>
                  <tbody>
                    <tr className={`border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
                      <td className="p-3 text-sm">1</td>
                      <td className="p-3 text-sm font-bold">{previewInvoice.service_type}</td>
                      <td className="p-3 text-sm opacity-60">{previewInvoice.service_description || "-"}</td>
                      <td className="p-3 text-sm font-bold text-right">₹{Number(previewInvoice.amount).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-lg font-black border-t-2 border-amber-500 pt-2"><span>Total</span><span className="text-amber-500">₹{Number(previewInvoice.total_amount).toLocaleString('en-IN')}</span></div>
                  </div>
                </div>
              {previewInvoice.notes && (
                <div className={`p-4 rounded-xl ${isDark ? "bg-amber-500/5 border border-amber-500/20" : "bg-amber-50 border border-amber-200"}`}>
                  <p className="text-[10px] font-bold tracking-widest text-amber-600 mb-2">NOTES</p>
                  <p className="text-xs opacity-70">{previewInvoice.notes}</p>
                </div>
              )}
              {previewInvoice.disclaimer && (
                <div className={`p-4 rounded-xl ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
                  <p className="text-[10px] font-bold tracking-widest opacity-40 mb-2">DISCLAIMER</p>
                  <p className="text-[11px] opacity-40">{previewInvoice.disclaimer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invoice List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
      ) : invoices.length === 0 ? (
        <Card className={`${isDark ? "bg-[#12121a] border-white/10" : ""}`}>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold opacity-50">No invoices yet</p>
            <p className="text-sm opacity-30 mt-1">Create your first invoice above</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <Card key={inv.id} className={`${isDark ? "bg-[#12121a] border-white/10 hover:border-amber-500/30" : "hover:border-amber-300"} transition-all cursor-pointer`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-amber-500/10" : "bg-amber-50"}`}>
                      <FileText className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm">{inv.invoice_number}</span>
                        <Badge className={statusColor(inv.status)} variant="secondary">{inv.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs opacity-50 mt-1">
                        <span>{inv.user_name}</span>
                        <span>{inv.service_type}</span>
                        <span>{new Date(inv.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-lg text-amber-500">₹{Number(inv.total_amount).toLocaleString('en-IN')}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setPreviewInvoice(inv)} className="h-8 w-8 p-0 rounded-lg"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => downloadInvoice(inv)} className="h-8 w-8 p-0 rounded-lg"><Download className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(inv.id)} className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
