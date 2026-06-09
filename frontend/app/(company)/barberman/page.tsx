import BarberPage from "@/components/company/BarberPage";

const barbers = [
  { name: "Hendra Schevenko", role: "Fade King",    specialty: "Fade Specialist", rating: "4.9 (2300+)", imageColor: "bg-teal-400"   },
  { name: "Juan Samudra",     role: "Fade King",    specialty: "Fade Specialist", rating: "4.9 (2300+)", imageColor: "bg-purple-400" },
  { name: "Yoga Harahap",     role: "Fade King",    specialty: "Fade Specialist", rating: "4.9 (2300+)", imageColor: "bg-amber-400"  },
  { name: "Bastian Narendra", role: "Fade King",    specialty: "Fade Specialist", rating: "4.9 (2300+)", imageColor: "bg-orange-400" },
];

export default function BarbermanPage() {
  return (
    <main className="min-h-screen bg-[#FCFBF7] py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto mb-16">
        <p className="text-[#1a1a1a] font-bold mb-2">dibalik rambut kece, ada</p>
        <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-6">
          <span className="text-[#6B46C1]">BARBERMAN</span> Profesional!
        </h1>
        <p className="text-gray-600 max-w-xl">
          Lebih dari sekadar memangkas, mereka adalah seniman. Master barber yang mendefinisikan
          ulang pengalaman mewah melalui presisi teknis dan ekspresi kreatif yang murni.
        </p>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {barbers.map((barber, index) => (
          <BarberPage key={index} {...barber} />
        ))}
      </div>
    </main>
  );
}
