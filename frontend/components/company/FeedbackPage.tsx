"use client";

import React, { useState } from 'react';
import { MessageSquareText, Send, Star, User, Mail } from 'lucide-react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen bg-[#FCFBF7] py-12 px-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#1a1a1a] mb-2">Kritik & Saran</h1>
          <p className="text-gray-500 text-sm">
            Masukan Anda sangat berarti untuk evolusi gaya kami.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <form className="space-y-6">
            
            {/* Nama Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C74F] transition"
                  placeholder="Masukkan nama Anda"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C74F] transition"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Rating Anda</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 cursor-pointer transition-colors ${
                      star <= rating ? "fill-[#F9C74F] text-[#F9C74F]" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Kritik & Saran</label>
              <div className="relative">
                <MessageSquareText className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <textarea 
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F9C74F] transition"
                  placeholder="Ceritakan pengalaman Anda di sini..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#1a1a1a] text-white font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              Kirim Masukan <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 mt-8">
          © 2026 Minion Barbershop. Terima kasih sudah membantu kami lebih baik.
        </p>
      </div>
    </div>
  );
}