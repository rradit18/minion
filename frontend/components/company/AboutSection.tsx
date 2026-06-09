import React from 'react';

const AboutSection = () => {
  return (
    <div className="bg-[#FCFBF7] text-[#1a1a1a] min-h-screen">
      
      {/* 1. Header Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-sm font-bold tracking-widest uppercase mb-4">TENTANG KAMI</p>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <h1 className="text-6xl font-black leading-tight">Rebels<br />With A<br /><span className="text-[#7B5EA7]">Cause.</span></h1>
          <p className="text-xl font-medium leading-relaxed italic border-l-4 border-black pl-8 mt-4">
            "Kami tidak sekadar membuka barbershop; kami memulai perlawanan terhadap standar biasa. 
            Minion adalah titik temu antara grooming kelas atas dan kultur jalanan yang autentik."
          </p>
        </div>
      </section>

      {/* 2. DNA Section */}
      <section className="bg-[#178E81] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
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
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-200 h-64 w-full rounded-3xl overflow-hidden">
              <img src={`/placeholder-history-${item}.jpg`} alt="History" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Right Column (Text) */}
        <div>
          <h2 className="text-5xl font-black mb-8">Dari Basement ke<br /><span className="text-[#7B5EA7]">Barbershop.</span></h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="bg-[#2D2D2D] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Their Thought About Minion</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#3D3D3D] p-8 rounded-3xl flex flex-col justify-between h-72">
                <span className="text-4xl text-[#F9C74F]">"</span>
                <p className="text-sm">Bukan sekadar potong rambut, ini adalah pernyataan diri. Vibe di sini nggak ada lawannya.</p>
                <div className="border-t border-gray-500 pt-4 text-xs font-bold">Jodi Mcow (2024)</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutSection;