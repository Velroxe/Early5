import React from "react";
import { Icons } from "@/lib/constants";

const FeaturesBar: React.FC = () => {
  return (
    <section className="bg-[#1A1816] text-white py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Feature 1 */}
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#A39171]">
              <Icons.Truck />
            </div>
            <h4 className="text-xl font-bold">Controlled Logistics</h4>
            <p className="text-gray-400 leading-relaxed text-sm">
              Maintaining precise humidity from heritage silos to your doorstep
              to preserve essential oils.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#A39171]">
              <Icons.Leaf />
            </div>
            <h4 className="text-xl font-bold">Small Batch Milling</h4>
            <p className="text-gray-400 leading-relaxed text-sm">
              Unlike industrial processors, we mill in micro-batches only upon
              order, ensuring unparalleled aroma.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#A39171]">
              <Icons.Shield />
            </div>
            <h4 className="text-xl font-bold">Soil Regeneration</h4>
            <p className="text-gray-400 leading-relaxed text-sm">
              5% of every purchase is reinvested into microbial soil health for
              our partner Himalayan farmers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
