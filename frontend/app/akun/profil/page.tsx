"use client";

import { useState } from "react";
import { getSession, setSession, saveUser, findUserByEmail } from "@/src/lib/localStorage";

export default function ProfilPage() {
  const session = getSession();
  const [tab, setTab]   = useState<"profil" | "password">("profil");
  const [saved, setSaved] = useState(false);
  const [err, setErr]   = useState("");

  const [form, setForm] = useState({
    name:  session?.name  ?? "",
    email: session?.email ?? "",
    phone: session?.phone ?? "",
  });
  const [passForm, setPassForm] = useState({ old: "", new: "", confirm: "" });

  if (!session) return null;

  const handleSaveProfil = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const updated = { ...session, name: form.name, phone: form.phone };
    saveUser(updated);
    setSession(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const user = findUserByEmail(session.email);
    if (!user || user.password !== passForm.old) { setErr("Password lama salah."); return; }
    if (passForm.new.length < 6) { setErr("Password baru minimal 6 karakter."); return; }
    if (passForm.new !== passForm.confirm) { setErr("Password tidak cocok."); return; }
    saveUser({ ...user, password: passForm.new });
    setPassForm({ old: "", new: "", confirm: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = "w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm";

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black text-[#1a1a1a]">Profil Saya</h2>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
        <div className="w-16 h-16 bg-[#F9C74F] rounded-2xl flex items-center justify-center text-3xl font-black text-black flex-shrink-0">
          {session.name[0]}
        </div>
        <div>
          <p className="font-black text-[#1a1a1a] text-lg">{session.name}</p>
          <p className="text-sm text-gray-400">{session.email}</p>
          <span className="inline-block bg-[#178E81] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest mt-1">{session.role}</span>
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
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Email</label>
              <input type="email" disabled value={form.email} className={`${inputCls} opacity-50 cursor-not-allowed`} />
              <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">No. WhatsApp</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+628..." />
            </div>
            <button type="submit" className="w-full bg-[#F9C74F] text-black font-extrabold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors">Simpan Perubahan</button>
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
            <button type="submit" className="w-full bg-[#F9C74F] text-black font-extrabold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors">Simpan Password</button>
          </form>
        )}
      </div>
    </div>
  );
}
