import { notFound } from 'next/navigation';
import BarberDetailClients from "@/components/company/BarberDetailClients"; 

const barbers = [
  { slug: "hendra", name: "Hendra Schevenko" },
  { slug: "juan",   name: "Juan Samudra"     },
  { slug: "yoga",   name: "Yoga Harahap"     },
  { slug: "bastian",name: "Bastian Narendra" },
];

export default async function BarberDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const barber = barbers.find(b => b.slug === slug);
  
  if (!barber) return notFound();

  return (
    <BarberDetailClients 
      barberName={barber.name} 
      barberSlug={barber.slug} 
    />
  );
}