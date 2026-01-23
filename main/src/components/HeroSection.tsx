import React from "react";
import { Icons } from "@/lib/constants";

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-44 md:pb-28 overflow-hidden bg-[#F3F1EB]">
      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15c-2 0-4 4-4 8s2 8 4 8 4-4 4-8-2-8-4-8zm-15 30c-2 0-4 4-4 8s2 8 4 8 4-4 4-8-2-8-4-8zm30 0c-2 0-4 4-4 8s2 8 4 8 4-4 4-8-2-8-4-8z' fill='%236d634c' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-white/40 to-transparent pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#6D634C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div className="animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#6D634C] text-[10px] font-bold mb-6 shadow-sm border border-[#EFECE5]">
              <Icons.Leaf />
              <span className="tracking-[0.2em] uppercase">
                Estate Grown • Heritage Grains
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-8 tracking-tight text-[#1A1816]">
              Grown by{" "}
              <span className="text-[#6D634C] italic serif font-normal">
                Earth
              </span>
              . <br />
              Perfected by{" "}
              <span className="text-[#6D634C] italic serif font-normal">
                Time
              </span>
              .
            </h1>

            <p className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
              Early5 brings you premium, hand-selected rice varieties aged for 24
              months to reach their full aromatic potential and perfect grain
              structure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#shop"
                className="px-8 py-4 bg-[#6D634C] text-white rounded-xl font-bold hover:bg-[#5A513E] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#6D634C]/30 text-base"
              >
                Shop Collection
                <Icons.ArrowRight />
              </a>

              <button className="px-8 py-4 bg-white/60 backdrop-blur-sm border border-[#EFECE5] text-[#1A1816] rounded-xl font-bold hover:bg-white transition-all">
                Our Legacy
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-in fade-in slide-in-from-right-6 duration-1000 delay-200 flex justify-center lg:justify-end">
            <div className="relative z-10 w-full max-w-105 aspect-square rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-1000 bg-white p-2">
              <img
                src="/hero.webp"
                alt="Premium Rice Grains"
                className="w-full h-full object-cover rounded-[2.5rem] transition-transform duration-1000 hover:scale-105"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-4 md:-left-10 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-[#EFECE5] z-20">
              <div className="w-12 h-12 bg-[#F3F1EB] rounded-xl flex items-center justify-center text-[#6D634C]">
                <Icons.Shield />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Heritage Reserve
                </div>
                <div className="font-black text-base text-[#1A1816]">
                  100% Traceable
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
