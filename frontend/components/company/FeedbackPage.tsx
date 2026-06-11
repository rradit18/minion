"use client";

import React, { useState } from 'react';

// Scissor SVG icon
const ScissorIcon = () => (
  <svg width="72" height="56" viewBox="0 0 72 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="40" r="12" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    <circle cx="16" cy="16" r="12" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    <line x1="25" y1="32" x2="68" y2="8" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
    <line x1="25" y1="24" x2="68" y2="48" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export default function FeedbackPage() {
  const [kategori, setKategori] = useState('Kritik');
  const [pesan, setPesan] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (pesan.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setPesan('');
    }
  };

  return (
    <div className="relative w-full py-12 px-6">
      
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "#F5EFE4",
          backgroundImage: "url('/pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[#F5EFE4]/80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Heading Section */}
        <div className="mb-10">
          <div className="flex items-start justify-between">
            <h1 className="text-5xl font-black leading-tight text-[#1a1a1a] max-w-[600px]">
              Keberhasilan Kami Bergantung<br />
              Pada <span className="text-[#2E9E8F]">Kritik</span> dan{' '}
              <span className="text-[#7C5CBF]">Saran</span> Anda
            </h1>
            <div className="mt-2 ml-4 flex-shrink-0">
              <ScissorIcon />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 border-2 border-[#7C5CBF] shadow-lg">
          <div className="space-y-6">
            
            {/* Dropdown Kategori */}
            <div className="space-y-2">
              <label className="block text-base font-semibold text-[#1a1a1a]">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-base border-[1.5px] border-[#1a1a1a] bg-transparent text-[#1a1a1a] outline-none focus:border-[#7C5CBF] transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231a1a1a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
              >
                <option value="Kritik" className="text-black">Kritik</option>
                <option value="Saran" className="text-black">Saran</option>
              </select>
            </div>

            {/* Pesan Textarea */}
            <div className="space-y-2">
              <label className="block text-base font-semibold text-[#1a1a1a]">Tulis Pesan Anda</label>
              <textarea
                rows={5}
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-base resize-none border-[1.5px] border-[#1a1a1a] bg-transparent text-[#1a1a1a] outline-none focus:border-[#7C5CBF] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-[#F9C74F] text-[#1a1a1a]"
              >
                {submitted ? 'Terkirim ✓' : 'Kirim →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}