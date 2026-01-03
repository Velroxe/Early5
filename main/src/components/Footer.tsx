import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#2D2926] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <span className="text-3xl font-black tracking-tighter">EARLY5</span>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nurturing the earth, empowering farmers, and bringing the finest heritage rice to your kitchen since 2012.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-[#6D634C]">Collections</h5>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Heritage Basmati</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Exotic Jasmine</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-[#6D634C]">Support</h5>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Expert</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-[#6D634C]">Join the Harvest</h5>
            <p className="text-sm text-gray-400 mb-6">Get 10% off your first order.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Your Email" className="bg-white/5 border-none rounded-lg px-4 py-2 text-sm flex-1" />
              <button className="px-4 py-2 bg-[#6D634C] rounded-lg text-sm font-bold">Join</button>
            </form>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex justify-between items-center">
          <p className="text-xs text-gray-500">© 2024 Early5 Premium Grains. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer