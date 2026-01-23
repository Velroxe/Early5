import React from "react";
import { REVIEWS } from "@/lib/constants";

const ReviewsGallery: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            The Verdict
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            From Michelin-starred kitchens to the warmth of family tables.
          </p>
        </div>

        {/* Masonry-style Reviews */}
        <div className="columns-1 md:columns-2 gap-10 space-y-10">
          {REVIEWS.map((review, idx) => (
            <div
              key={review.id}
              className={`break-inside-avoid p-8 rounded-[2.5rem] ${
                idx % 2 === 0
                  ? "bg-[#FDFCF8] border border-[#EFECE5]"
                  : "bg-[#1A1816] text-white"
              } transition-all hover:-translate-y-1 duration-500 cursor-default group`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6 text-[#A39171]">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p
                className={`text-xl serif italic mb-8 leading-relaxed ${
                  idx % 2 !== 0 ? "text-gray-300" : "text-gray-700"
                }`}
              >
                “{review.comment}”
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${
                    idx % 2 !== 0
                      ? "bg-white/10 text-white"
                      : "bg-[#6D634C] text-white"
                  }`}
                >
                  {review.author[0]}
                </div>
                <div>
                  <h5 className="font-bold text-base leading-tight">
                    {review.author}
                  </h5>
                  <p
                    className={`text-[10px] tracking-wide ${
                      idx % 2 !== 0 ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {review.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsGallery;
