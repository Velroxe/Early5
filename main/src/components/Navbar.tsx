"use client"

import { Icons } from '@/lib/constants';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const router = useRouter();
  const { cartCount } = useCart();

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#FDFCF8]/80 backdrop-blur-md border-b border-gray-100" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <span className="text-2xl font-black tracking-tighter text-[#6D634C]">EARLY5</span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <button onClick={() => router.push("/")} className="text-sm font-medium hover:text-[#6D634C] transition-colors">Home</button>
            <a href="#shop" onClick={() => router.push("/")} className="text-sm font-medium hover:text-[#6D634C] transition-colors">Shop All</a>
            <a href="#" className="text-sm font-medium hover:text-[#6D634C] transition-colors">Recipes</a>
            <a href="#" className="text-sm font-medium hover:text-[#6D634C] transition-colors">Wholesale</a>
          </div>

          <div className="flex items-center space-x-5">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Icons.Search /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Icons.User /></button>
            <button
              onClick={() => router.push("/cart")}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icons.ShoppingBag />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#6D634C] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar