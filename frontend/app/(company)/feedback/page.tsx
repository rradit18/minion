"use client";

import { useState } from "react";

const categories = ["Layanan", "Kebersihan", "Barber", "Harga", "Lainnya"];

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    rating: 0,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST ke backend API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-[#178E81] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#1a1a1a] mb-2">Terima Kasih! 🙏</h2>
          <p className="text-gray-500 text-sm mb-6">
            Saran dan kritik kamu sangat berarti bagi kami untuk terus berkembang.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: "", email: "", category: "", rating: 0, message: "" }); }}
            className="bg-[#F9C74F] text-[#1a1a1a] font-extrabold px-6 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors"
          >
            Kirim Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-14">
      {/* Header */}
      <p className="text-[#178E81] text-xs font-extrabold tracking-[3px] uppercase mb-2">
        Suara Kamu Penting
      </p>
      <h1 className="text-4xl font-black text-[#1a1a1a] mb-2 leading-tight">
        Saran & Kritik
      </h1>
      <div className="w-12 h-1 bg-[#F9C74F] rounded mb-8" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama */}
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Nama (opsional)</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama kamu"
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Email (opsional)</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@kamu.com"
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Kategori</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm({ ...form, category: cat })}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                  form.category === cat
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Rating Pengalaman</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm({ ...form, rating: n })}
                className={`text-3xl transition-all hover:scale-110 ${n <= form.rating ? "opacity-100" : "opacity-25"}`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Pesan */}
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Pesan</label>
          <textarea
            rows={5}
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Ceritakan pengalamanmu, saran, atau kritik untuk kami..."
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors resize-none text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#F9C74F] text-[#1a1a1a] font-extrabold py-3.5 rounded-xl uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors"
        >
          Kirim Saran & Kritik
        </button>
      </form>
    </section>
  );
}
