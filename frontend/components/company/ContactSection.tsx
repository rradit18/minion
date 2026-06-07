import Link from "next/link";

export default function ContactSection() {
  return (
    <section className="py-20 px-6 bg-[#141414] text-center">
      <div className="max-w-2xl mx-auto">
        <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">Ready?</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Siap Tampil Kece?
        </h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Booking sekarang dan rasakan pengalaman grooming terbaik bersama barberman bersertifikat kami.
        </p>
        <Link
          href="/contact"
          className="bg-yellow-400 text-black font-bold px-10 py-3 rounded uppercase tracking-widest text-sm hover:bg-yellow-300 transition-colors inline-block"
        >
          Book Now
        </Link>
      </div>
    </section>
  );
}
