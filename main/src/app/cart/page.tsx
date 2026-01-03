"use client";

import React from "react";
import { Icons } from "@/lib/constants";
import { useCart } from "@/lib/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CartPage = () => {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const shipping = cartTotal > 2000 ? 0 : 150;
  const total = cartTotal + shipping;

  // 🛒 Empty cart state
  if (items.length === 0) {
    return (
      <div className="pt-40 pb-32 text-center animate-in fade-in duration-500">
        <div className="max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
            <Icons.ShoppingBag />
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tight">
            Your bag is empty
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            It seems you haven't discovered your perfect grain yet.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 bg-[#6D634C] text-white rounded-xl font-bold hover:bg-[#5A513E] transition-all"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black mb-12 tracking-tight">
          Shopping Bag ({items.length})
        </h1>

        <div className="grid lg:grid-cols-3 gap-16">

          {/* 🧺 Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {items.map(item => (
              <div
                key={item.id}
                className="flex gap-6 pb-8 border-b border-gray-100"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#6D634C] block mb-1">
                        {item.type}
                      </span>
                      <h3 className="text-xl font-bold">
                        {item.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Icons.Close />
                    </button>
                  </div>

                  <div className="text-[#6D634C] font-bold mb-4">
                    ₹{item.discounted_price_inr}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1.5 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 font-bold text-sm min-w-10 text-center border-x">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1.5 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-bold">
                      ₹{item.discounted_price_inr * item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => router.push("/")}
              className="text-[#6D634C] font-bold text-sm flex items-center gap-2 hover:-translate-x-1 transition-transform"
            >
              <div className="rotate-180">
                <Icons.ArrowRight />
              </div>
              Continue Shopping
            </button>
          </div>

          {/* 🧾 Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#FDFCF8] border border-[#EFECE5] rounded-3xl p-8 sticky top-32">
              <h2 className="text-2xl font-black mb-6 tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-[10px] text-[#6D634C] font-bold">
                    Spend ₹{2000 - cartTotal} more for FREE shipping
                  </p>
                )}

                <div className="pt-4 border-t border-gray-200 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Link
                href={"/checkout"}
                className="w-full py-4 bg-[#2D2926] inline-block text-center text-white rounded-xl font-bold hover:bg-[#44403C] transition-all mb-4"
              >
                Checkout Now
              </Link>

              <div className="flex items-center justify-center gap-4 grayscale opacity-40">
                <div className="text-[10px] font-bold">VISA</div>
                <div className="text-[10px] font-bold">MASTERCARD</div>
                <div className="text-[10px] font-bold">UPI</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
