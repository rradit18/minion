import { notFound } from 'next/navigation';
import BarberDetailClients from "@/components/company/BarberDetailClients";

const barbers = [
  { slug: "aldi",  name: "Aldi" },
  { slug: "wanda", name: "Wanda"      },
  { slug: "roni",  name: "Roni"      },
  { slug: "ali",   name: "Ali"  },
  { slug: "ferdi",   name: "Ferdi"  },
  { slug: "gevan",   name: "Gevan"  },
  { slug: "ipan",   name: "Ipan"  },
  { slug: "iyan",   name: "Iyan"  },
  { slug: "panda",   name: "Panda"  },
  { slug: "ian",   name: "Ian"  },
  { slug: "randy",   name: "Randy"  },
  { slug: "pandu",   name: "Pandu"  },
  { slug: "emon",   name: "Emon"  },
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