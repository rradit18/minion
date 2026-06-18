"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/src/lib/localStorage";
import { apiFetch, loadMe, firstError } from "@/src/lib/auth";

export default function ProfilPage() {
  const [session, setSessionState] = useState(typeof window !== "undefined" ? getSession() : null);
  const [tab, setTab] = useState<"profil" | "password">("profil");
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [passForm, setPassForm] = useState({ old: "", new: "", confirm: "" });

  useEffect(() => {
    loadMe().then((u) => {
      const s = u ?? getSession();
      setSessionState(s);
      if (s) setForm({ name: s.name, email: s.email ?? "", phone: s.phone ?? "" });
    });
  }, []);

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleSaveProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    const res = await apiFetch("/customer/profile", {
      method: "PATCH",
      body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email.trim() || undefined }),
    });
    setBusy(false);
    if (!res.ok) { setErr(firstError(res)); return; }
    await loadMe();
    setSessionState(getSession());
    flashSaved();
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (passForm.new.length < 8) { setErr("Password baru minimal 8 karakter."); return; }
    if (passForm.new !== passForm.confirm) { setErr("Password tidak cocok."); return; }
    setBusy(true);
    const res = await apiFetch("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        current_password: passForm.old,
        password: passForm.new,
        password_confirmation: passForm.confirm,
      }),
    });
    setBusy(false);
    if (!res.ok) { setErr(firstError(res)); return; }
    setPassForm({ old: "", new: "", confirm: "" });
    flashSaved();
  };

  const inputCls = "w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm";

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black text-[#1a1a1a]">Profil Saya</h2>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F9C74F] rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-black flex-shrink-0">
          {(session?.name ?? "M")[0]}
        </div>
        <div className="min-w-0">
          <p className="font-black text-[#1a1a1a] text-base sm:text-lg truncate">{session?.name ?? "Pelanggan"}</p>
          <p className="text-xs sm:text-sm text-gray-400 truncate">{session?.phone ?? session?.email ?? ""}</p>
          <span className="inline-block bg-[#178E81] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest mt-1">Member</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["profil", "password"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setErr(""); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${tab === t ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"}`}>
            {t === "profil" ? "Edit Profil" : "Ganti Password"}
          </button>
        ))}
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">✓ Perubahan berhasil disimpan</div>}
      {err   && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{err}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        {tab === "profil" ? (
          <form onSubmit={handleSaveProfil} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Nama Lengkap</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">No. WhatsApp</label>
              <input type="tel" inputMode="numeric" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} className={inputCls} placeholder="08123456789" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Email <span className="text-gray-400 font-normal">(opsional)</span></label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="email@kamu.com" />
            </div>
            <button type="submit" disabled={busy} className="w-full bg-[#F9C74F] text-black font-extrabold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50">Simpan Perubahan</button>
          </form>
        ) : (
          <form onSubmit={handleSavePassword} className="space-y-4">
            {[
              { label: "Password Lama", key: "old"     },
              { label: "Password Baru", key: "new"     },
              { label: "Konfirmasi",    key: "confirm" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">{f.label}</label>
                <input type="password" required value={passForm[f.key as keyof typeof passForm]}
                  onChange={(e) => setPassForm({ ...passForm, [f.key]: e.target.value })}
                  className={inputCls} placeholder="••••••••" />
              </div>
            ))}
            <button type="submit" disabled={busy} className="w-full bg-[#F9C74F] text-black font-extrabold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50">Simpan Password</button>
          </form>
        )}
      </div>
    </div>
  );
}
