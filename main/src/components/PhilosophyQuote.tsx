import React from "react";
import { Icons } from "@/lib/constants";

const PhilosophyQuote: React.FC = () => {
  return (
    <section className="py-24 bg-white text-center relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-[#6D634C] mb-8 flex justify-center opacity-30">
          <Icons.Leaf />
        </div>

        <h2 className="text-3xl md:text-5xl serif italic text-[#2D2926] leading-snug">
          "Rice is not a side dish; it is the{" "}
          <span className="font-bold not-italic">soul</span> of the plate. We
          believe in the luxury of patience."
        </h2>

        <p className="mt-8 uppercase tracking-[0.2em] text-[10px] font-bold text-gray-400">
          — THE EARLY5 MANIFESTO
        </p>
      </div>
    </section>
  );
};

export default PhilosophyQuote;
