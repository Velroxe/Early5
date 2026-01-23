import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1816] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <span className="text-3xl font-black tracking-tighter">EARLY5</span>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Bringing the finest heritage rice to your kitchen since 2012.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h5 className="font-bold mb-8 text-[#A39171] uppercase tracking-[0.2em] text-[10px]">
              Collections
            </h5>
            <ul className="space-y-4 text-gray-500 font-semibold text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Vintage Basmati</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Organic Black Rice</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Thai Jasmine Gold</a></li>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h5 className="font-bold mb-8 text-[#A39171] uppercase tracking-[0.2em] text-[10px]">
              Experience
            </h5>
            <ul className="space-y-4 text-gray-500 font-semibold text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Milling Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">The Sommelier</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pairings</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-bold mb-8 text-[#A39171] uppercase tracking-[0.2em] text-[10px]">
              Join Harvest
            </h5>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#A39171] outline-none transition-all"
              />
              <button className="w-full py-3 bg-[#6D634C] rounded-xl text-xs font-bold hover:bg-[#5A513E] transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] text-gray-600 font-medium">
            © 2024 Early5 Premium Grains. All rights reserved.
          </p>
          <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
