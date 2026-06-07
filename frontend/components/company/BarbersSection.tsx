const barbers = [
  { name: "Hendra", nickname: '"Fade King"', skills: ["Fade", "Skin Fade"], rating: 5, reviews: 128 },
  { name: "Alex", nickname: '"The Sculptor"', skills: ["Classic", "Textured"], rating: 5, reviews: 97 },
  { name: "Dimas", nickname: '"Sharpie"', skills: ["Lineup", "Curly Hair"], rating: 4, reviews: 84 },
  { name: "Budi", nickname: '"The Artist"', skills: ["Design Cut", "Beard Art"], rating: 5, reviews: 110 },
];

const skillColors = ["bg-yellow-400/10 text-yellow-400", "bg-cyan-400/10 text-cyan-400"];

export default function BarbersSection() {
  return (
    <section className="bg-[#141414] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-2">
          Kenalan sama barberman kece kami
        </h2>
        <div className="w-12 h-0.5 bg-yellow-400 mx-auto mb-12" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {barbers.map((b) => (
            <div
              key={b.name}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 text-center hover:border-yellow-400/40 transition-colors"
            >
              <div className="w-20 h-20 rounded-full bg-[#252525] border-2 border-yellow-400/30 mx-auto mb-4 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-12 h-12 fill-gray-600">
                  <circle cx="50" cy="35" r="22" />
                  <ellipse cx="50" cy="85" rx="32" ry="22" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm">{b.name}</p>
              <p className="text-yellow-400 text-xs mb-3">{b.nickname}</p>
              <div className="flex justify-center gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-xs ${i < b.rating ? "text-yellow-400" : "text-gray-600"}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-xs mb-3">{b.reviews} reviews</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {b.skills.map((skill, i) => (
                  <span key={skill} className={`text-xs px-2 py-0.5 rounded-full font-medium ${skillColors[i % 2]}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
