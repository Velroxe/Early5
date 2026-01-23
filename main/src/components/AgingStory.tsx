import React from "react";

const AgingStory: React.FC = () => {
  return (
    <section className="py-24 bg-[#FDFCF8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 relative flex justify-center lg:justify-start">
            <div className="relative group z-10 w-full max-w-120">
              <img
                src="/aging.webp"
                alt="Aged Grains"
                className="rounded-[2.5rem] w-full shadow-xl transition-transform duration-700 hover:scale-[1.02]"
              />

              {/* Overlay Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-md">
                <div className="text-white text-center">
                  <div className="text-4xl font-black">24</div>
                  <div className="text-[10px] uppercase tracking-[0.2em]">
                    Months Aged
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              The Secret is <br />
              <span className="text-[#6D634C] serif italic font-normal">
                Patience.
              </span>
            </h2>

            <div className="space-y-6 text-base text-gray-600 leading-relaxed">
              <p>
                Why do we age our Basmati for two years? Like a fine vintage wine,
                rice undergoes complex biochemical changes over time. The
                moisture content stabilizes, and the natural oils intensify.
              </p>
              <p>
                The result is a grain that expands to three times its length and
                releases an aroma that can fill an entire home. It’s not just
                rice; it’s a time-capsule of flavor.
              </p>
            </div>

            {/* Stats */}
            <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-black text-[#1A1816]">3.2x</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
                  Grain Elongation
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#1A1816]">0%</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
                  Stickiness Ratio
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgingStory;
