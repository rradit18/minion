"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST ke backend API
    alert("Pesan terkirim!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-[#FAF7EE] min-h-screen px-6 py-20">
      <div className="max-w-xl mx-auto">
        <p className="text-[#178E81] text-xs font-extrabold tracking-[3px] uppercase mb-2">
          Hubungi Kami
        </p>
        <h1 className="text-4xl font-black text-[#1a1a1a] mb-2 leading-tight">
          Book Now
        </h1>
        <div className="w-12 h-1 bg-[#F9C74F] rounded mb-8" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="name">
              Nama
            </label>
            <input
              id="name" name="name" type="text" required
              value={form.name} onChange={handleChange}
              placeholder="Nama kamu"
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email" name="email" type="email" required
              value={form.email} onChange={handleChange}
              placeholder="email@kamu.com"
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="message">
              Pesan / Request
            </label>
            <textarea
              id="message" name="message" rows={5} required
              value={form.message} onChange={handleChange}
              placeholder="Ceritakan kebutuhan kamu..."
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors resize-none text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#F9C74F] text-[#1a1a1a] font-extrabold py-3.5 rounded-xl uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors"
          >
            Kirim
          </button>
        </form>
      </div>
    </section>
  );
}
