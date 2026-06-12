import Link from 'next/link';
import BarberPage from '@/components/company/BarberPage';

const barbers = [
  {
    slug: "hendra",
    name: "Hendra Schevenko",
    role: "Senior Barber",
    specialty: "Fade & Texture",
    rating: "4.9",
    imageColor: "bg-teal-500",
  },
  {
    slug: "juan",
    name: "Juan Samudra",
    role: "Junior Barber",
    specialty: "Classic Cut",
    rating: "4.7",
    imageColor: "bg-purple-500",
  },
  {
    slug: "yoga",
    name: "Yoga Harahap",
    role: "Senior Barber",
    specialty: "Skin Fade",
    rating: "4.8",
    imageColor: "bg-orange-400",
  },
  {
    slug: "bastian",
    name: "Bastian Narendra",
    role: "Master Barber",
    specialty: "Pompadour",
    rating: "5.0",
    imageColor: "bg-blue-500",
  },
];

export default function BarbersListPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black mb-6">Pilih Barber Anda</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {barbers.map((barber) => (
          <Link key={barber.slug} href={`/barberman/${barber.slug}`}>
            <BarberPage
              name={barber.name}
              role={barber.role}
              specialty={barber.specialty}
              rating={barber.rating}
              imageColor={barber.imageColor}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}