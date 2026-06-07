export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <p className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-3">
            Minion Barbershop
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            Elite cuts for the next generation. Where craftsmanship meets digital realism.
          </p>
        </div>
        <div>
          <p className="text-white font-semibold text-sm mb-3">Connect</p>
          <ul className="space-y-2 text-gray-500 text-xs">
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">TikTok</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">WhatsApp Business</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold text-sm mb-3">Legal</p>
          <ul className="space-y-2 text-gray-500 text-xs">
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms & Conditions</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold text-sm mb-3">Location</p>
          <p className="text-gray-500 text-xs leading-relaxed">
            Available at 4 major hub across Jakarta<br />
            Open Daily: 10 AM – 9 PM
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 border-t border-white/10 pt-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Minion Barbershop. All rights reserved.
      </div>
    </footer>
  );
}
