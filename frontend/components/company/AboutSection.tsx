"use client";

import React from 'react';
import { Star } from 'lucide-react';

const AboutSection = () => {
  const timelineImages = [
    "/minion2.jfif", 
    "/minion1.jfif", 
    "/minion3.jfif", 
  ];

  return (
    <div className="bg-[#FAF7EE] text-[#1a1a1a] min-h-screen">
      
      {/* 1. Header Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 relative">
          <div className="absolute top-8 right-8 text-[#F9C74F]">
            <Star size={70} fill="currentColor" strokeWidth={0.5} />
          </div>
          
          <p className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-400">
            TENTANG KAMI
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Good hair,<br />
              good mood,<br />
              <span className="text-[#7B5EA7]">good day.</span>
            </h1>

            <p className="text-lg md:text-xl font-medium leading-relaxed border-l-4 border-black pl-6 md:pl-8">
              "Minion ga cuma barbershop biasa king. Kami <span className="font-bold not-italic"> pencari kesempurnaan.</span> Mastiin pelanggan bisa dapat <span className="font-bold italic"> perfection</span> dalam penampilan adalah tugas kami"
            </p>
          </div>
        </div>
      </section>

      {/* 2. DNA Section */}
      <section className="bg-[#178E81] text-white py-20 px-6 relative">
        <div className="absolute inset-0 opacity-35 pointer-events-none"
        style={{ backgroundImage: 'url(/pattern.png)'}}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-5xl font-black mb-12">DNA Kami.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white text-[#1a1a1a] p-8 rounded-3xl shadow-lg">
                <h3 className="font-bold text-lg mb-4">Anti Mainstream</h3>
                <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Story / Timeline Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16">
        {/* Left Column (Timeline) */}
        <div className="flex flex-col gap-8 relative">
          <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
          
          {/* Mapping array gambar agar setiap item berbeda */}
          {timelineImages.map((imgSrc, index) => (
            <div key={index} className="bg-gray-200 h-64 w-full rounded-3xl overflow-hidden">
              <img src={imgSrc} alt={`History ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Right Column (Text) */}
        <div>
          <h2 className="text-5xl font-black mb-8">Dari ruko kecil sampe<br /><span className="text-[#7B5EA7]">4 cabang.</span></h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="bg-[#2D2D2D] text-white py-20 px-6 relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'url(/pattern.png)'}}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-12">Their Thought About Minion</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#ffffff] p-8 rounded-3xl flex flex-col justify-between h-72">
                <span className="text-4xl text-black">"</span>
                <p className="text-black">Bukan sekadar potong rambut, ini adalah pernyataan diri. Vibe di sini nggak ada lawannya.</p>
                <div className="border-t border-gray-500 pt-4 text-xs font-bold text-black">Jodi Mcow (2024)</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutSection;