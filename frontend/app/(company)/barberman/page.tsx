import Link from 'next/link';
import BarberPage from '@/components/company/BarberPage';

const barbers = [
  {
    slug: "hendra",
    name: "Hendra Schevenko",
    role: "Fade King",
    specialty: "Fade Specialist",
    rating: "4.9",
    reviewCount: "2300+",
    imageColor: "bg-teal-500",
    imageUrl: "/barber.png",
  },
  {
    slug: "juan",
    name: "Juan Samudra",
    role: "Fade King",
    specialty: "Fade Specialist",
    rating: "4.9",
    reviewCount: "2300+",
    imageColor: "bg-purple-500",
    imageUrl: "/barber.png",
  },
  {
    slug: "yoga",
    name: "Yoga Harahap",
    role: "Fade King",
    specialty: "Fade Specialist",
    rating: "4.9",
    reviewCount: "2300+",
    imageColor: "bg-orange-400",
    imageUrl: "/barber.png",
  },
  {
    slug: "bastian",
    name: "Bastian Narendra",
    role: "Fade King",
    specialty: "Fade Specialist",
    rating: "4.9",
    reviewCount: "2300+",
    imageColor: "bg-orange-400",
    imageUrl: "/barber.png",
  },
];

export default function BarbersListPage() {
  return (
    <div className="min-h-screen bg-[#FAF7EF]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── HEADING ── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[#1a1a1a] text-lg font-semibold mb-1">
              KENALAN SAMA <span className="line-through decoration-1 italic">KANG CUKUR</span>
            </p>
            <h1 className="text-5xl font-black leading-none flex items-baseline gap-3 whitespace-nowrap">
              <span className="text-[#7B5EA7]">MAESTRO</span>
              <span className="text-[#1a1a1a] text-lg md:text2xl font-bold italic"> KAMI DULU GASIH??!!!</span>
            </h1>
          </div>
          <div className="md:max-w-sm lg:max-w-md">
            <p className="text-gray-500 text-sm leading-relaxed">
              Lebih dari sekadar memangkas, mereka adalah seniman. Master barber yang
              mendefinisikan ulang pengalaman mewah melalui presisi teknis dan ekspresi
              kreatif yang murni.
            </p>
          </div>
        </div>

        {/* ── GRID BARBER ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-16 pt-10">
          {barbers.map((barber) => (
            <Link key={barber.slug} href={`/barberman/${barber.slug}`}>
              <BarberPage
                name={barber.name}
                role={barber.role}
                specialty={barber.specialty}
                rating={barber.rating}
                reviewCount={barber.reviewCount}
                imageColor={barber.imageColor}
                imageUrl={barber.imageUrl}
              />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}