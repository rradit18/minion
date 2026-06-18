import { notFound } from 'next/navigation';
import BarberDetailClients, { type ApiBarberDetail, type OtherBarber } from "@/components/company/BarberDetailClients";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default async function BarberDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [barberRes, allRes] = await Promise.all([
    fetch(`${API_BASE}/barbers/${slug}`, { next: { revalidate: 60 } }),
    fetch(`${API_BASE}/barbers`, { next: { revalidate: 60 } }),
  ]);

  if (!barberRes.ok) return notFound();

  const barberJson = await barberRes.json();
  const barber: ApiBarberDetail = barberJson.data;

  let otherBarbers: OtherBarber[] = [];
  if (allRes.ok) {
    const allJson = await allRes.json();
    otherBarbers = ((allJson.data ?? []) as OtherBarber[])
      .filter((b) => b.slug !== slug)
      .slice(0, 3);
  }

  return <BarberDetailClients barber={barber} otherBarbers={otherBarbers} />;
}
