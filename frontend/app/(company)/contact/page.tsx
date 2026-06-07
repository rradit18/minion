"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST ke backend API
    alert("Pesan terkirim!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-extrabold text-white mb-2 uppercase tracking-tight">
        Book Now
      </h1>
      <div className="w-12 h-0.5 bg-yellow-400 mb-8" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="name">
            Nama
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
            placeholder="Nama kamu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
            placeholder="email@kamu.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="message">
            Pesan / Request
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={handleChange}
            className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
            placeholder="Ceritakan kebutuhan kamu..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg uppercase tracking-widest text-sm hover:bg-yellow-300 transition-colors"
        >
          Kirim
        </button>
      </form>
    </section>
  );
}
