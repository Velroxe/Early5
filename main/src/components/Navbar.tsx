"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/lib/constants";
import { useCart } from "@/lib/context/CartContext";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { cartCount } = useCart();

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#F3F1EB]/80 backdrop-blur-xl border-b border-[#EFECE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <span className="text-2xl font-black tracking-tighter text-[#1A1816] group-hover:tracking-widest transition-all duration-500">
              EARLY5
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-10">
            <button
              onClick={() => router.push("/")}
              className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-[#6D634C] transition-colors"
            >
              Home
            </button>
            <a
              href="#shop"
              className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-[#6D634C] transition-colors"
            >
              Harvest
            </a>
            <button className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-[#6D634C] transition-colors">
              Process
            </button>
            <button className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-[#6D634C] transition-colors">
              Wholesale
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-5">
            <button className="p-2.5 hover:bg-white rounded-xl transition-all shadow-sm">
              <Icons.Search />
            </button>

            <button
              onClick={() => router.push("/cart")}
              className="relative p-2.5 bg-[#1A1816] text-white rounded-xl transition-all hover:scale-105 shadow-xl shadow-[#1A1816]/30"
            >
              <Icons.ShoppingBag />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#6D634C] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-[#F3F1EB]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
