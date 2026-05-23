"use client";

import React, { useEffect, useState } from "react";
import { Icons } from "@/lib/constants";
import { useCart } from "@/lib/context/CartContext";
import { useRouter } from "next/navigation";

type CheckoutMethod = "cod" | "whatsapp" | "online";

const CheckoutPage = () => {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [step, setStep] = useState<
    "checkout" | "payment" | "processing" | "success"
  >("checkout");
  const [method, setMethod] = useState<CheckoutMethod>("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "paid" | "failed"
  >("pending");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (step !== "processing" || !orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/orders/public/${orderId}`);
        const data = await res.json();
        console.log(data);

        if (data.payment_status === "paid") {
          setPaymentStatus("paid");
          clearCart();
          setStep("success");
          clearInterval(interval);
        }

        if (data.payment_status === "failed") {
          setPaymentStatus("failed");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling failed", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [step, orderId]);

  useEffect(() => {
    if (items.length === 0 && step !== "success") {
      router.replace("/");
    }
  }, [items.length, router, step]);

  if (items.length === 0 && step !== "success") {
    return <div className="py-40 text-center">Redirecting…</div>;;
  }

  // const shipping = cartTotal >= 2000 ? 0 : 150;
  const shipping = 0;
  const total = cartTotal + shipping;

  // 🧾 Form handling
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 📲 WhatsApp order
  const constructWhatsAppMessage = () => {
    const itemsList = items
      .map(
        item =>
          `- ${item.title} (x${item.quantity}) - ₹${item.discounted_price_inr * item.quantity
          }`
      )
      .join("%0A");

    const message = `Hello Early5! *New Order Request*%0A%0A*Items:*%0A${itemsList}%0A%0A*Total:* ₹${total}%0A%0A*Customer Details:*%0A- Name: ${formData.fullName}%0A- Phone: ${formData.phone}%0A- Email: ${formData.email || "N/A"
      }%0A- Address: ${formData.address}`;

    return `https://wa.me/919811654422?text=${message}`;
  };

  const createOrderPayload = (orderType: "cod" | "online") => {
    return {
      buyer_name: formData.fullName,
      buyer_address: formData.address,
      buyer_phone: formData.phone,
      buyer_email: formData.email || undefined,
      order_type: orderType,
      items: items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };


  // ✅ Place order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🟢 WHATSAPP (unchanged)
    if (method === "whatsapp") {
      try {
        setIsProcessing(true);

        const payload = {
          buyer_name: formData.fullName,
          buyer_phone: formData.phone,
          order_type: "whatsapp",
        };

        const res = await fetch(`${BACKEND_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to create WhatsApp order");
        }

        const data = await res.json();
        setOrderId(data.order_id);

        // Open WhatsApp AFTER order exists
        window.open(constructWhatsAppMessage(), "_blank");

        clearCart();
        setStep("success");
      } catch (err: any) {
        alert(err.message || "WhatsApp order failed");
      } finally {
        setIsProcessing(false);
      }

      return;
    }

    // 🟡 ONLINE PAYMENT (placeholder)
    if (method === "online") {

      // window.alert("We are temporarily unable to process online payments. Please choose another payment option to proceed with your purchase.");
      // return;

      try {
        setIsProcessing(true);

        // STEP 1️⃣ Create Order (online)
        const orderRes = await fetch(`${BACKEND_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createOrderPayload("online")),
        });

        if (!orderRes.ok) {
          const err = await orderRes.json();
          throw new Error(err.message || "Failed to create order");
        }

        const orderData = await orderRes.json();
        setOrderId(orderData.order_id);

        // STEP 2️⃣ Create Razorpay Order
        const paymentRes = await fetch(
          `${BACKEND_URL}/api/payments/create-order`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderData.order_id }),
          }
        );

        if (!paymentRes.ok) {
          const err = await paymentRes.json();
          throw new Error(err.message || "Failed to initiate payment");
        }

        const paymentData = await paymentRes.json();

        // STEP 3️⃣ Open Razorpay
        const options = {
          key: paymentData.key,
          amount: paymentData.amount,
          currency: paymentData.currency,
          order_id: paymentData.razorpay_order_id,
          handler: function () {
            // ⚠️ DO NOT mark payment success
            setStep("processing");
          },
          modal: {
            ondismiss: () => {
              setPaymentStatus("failed");
            },
          },
        };

        const loaded = await loadRazorpay();
        if (!loaded) {
          alert("Razorpay SDK failed to load");
          return;
        }

        // @ts-ignore
        const rzp = new (window as any).Razorpay(options);
        rzp.open();

        setStep("payment");
      } catch (err: any) {
        alert(err.message || "Online payment failed");
      } finally {
        setIsProcessing(false);
      }

      return;
    }

    // 🟢 CASH ON DELIVERY (REAL API CALL)
    try {
      setIsProcessing(true);

      const payload = createOrderPayload("cod");

      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const order = await res.json();

      console.log("Order created:", order);
      setOrderId(order.order_id);

      clearCart();
      setStep("success");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong while placing the order");
    } finally {
      setIsProcessing(false);
    }
  };

  const getSuccessMessage = () => {
    if (method === "whatsapp") {
      return "Order created. Please continue on WhatsApp.";
    }

    if (method === "cod") {
      return "Order placed successfully. Pay on delivery.";
    }

    if (method === "online" && paymentStatus === "paid") {
      return "Payment successful. Order confirmed.";
    }

    return "Order placed successfully.";
  };


  // 🎉 Success screen
  if (step === "success") {

    window.scrollTo({top: 0, behavior: "smooth"});

    return (
      <div className="pt-40 pb-32 text-center animate-in fade-in zoom-in-95 duration-700">
        <div className="max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h1 className="text-4xl font-black mb-4 tracking-tight">
            {method === "whatsapp" ? "Request Sent!" : "Order Confirmed!"}
          </h1>

          <p className="text-gray-600 font-medium mb-4">
            {getSuccessMessage()}
          </p>

          <div className="p-6 bg-[#FDFCF8] border border-[#EFECE5] rounded-2xl mb-10 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Order Number</span>
              <span className="font-bold">
                {orderId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className="font-bold">Processing</span>
            </div>
          </div>

          <button
            onClick={() => {
              clearCart();
              router.push("/");
            }}
            className="w-full py-4 bg-[#6D634C] text-white rounded-xl font-bold hover:bg-[#5A513E] transition-all"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  // 🧾 Checkout form
  return (
    <div className="pt-32 pb-24 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <button
          onClick={() => router.push("/cart")}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#6D634C] mb-8 group"
        >
          <div className="rotate-180 group-hover:-translate-x-1 transition-transform">
            <Icons.ArrowRight />
          </div>
          Review Shopping Bag
        </button>

        <h1 className="text-4xl font-black mb-12 tracking-tight">
          Checkout
        </h1>

        <form
          onSubmit={handlePlaceOrder}
          className="grid lg:grid-cols-3 gap-16"
        >
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-12">
            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#EFECE5] text-[#6D634C] flex items-center justify-center text-sm">1</span>
                Contact & Delivery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#6D634C] outline-none transition-all"
                  />
                </div>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="p-4 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#6D634C] outline-none transition-all"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email (Optional)"
                  className="p-4 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#6D634C] outline-none transition-all"
                />
                <div className="sm:col-span-2">
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Complete Address (House No, Building, Area, City, Pin Code)"
                    rows={3}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#6D634C] outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Payment / Checkout Method */}
            <section>
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#EFECE5] text-[#6D634C] flex items-center justify-center text-sm">2</span>
                Order Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setMethod('cod')}
                  className={`p-5 rounded-2xl border-2 flex flex-col gap-3 transition-all text-left ${method === 'cod' ? 'border-[#6D634C] bg-[#FDFCF8]' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'cod' ? 'border-[#6D634C]' : 'border-gray-300'}`}>
                    {method === 'cod' && <div className="w-2.5 h-2.5 bg-[#6D634C] rounded-full" />}
                  </div>
                  <div>
                    <span className="font-bold block text-sm">Cash on Delivery</span>
                    <span className="text-[10px] text-gray-400">Pay when items arrive</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('whatsapp')}
                  className={`p-5 rounded-2xl border-2 flex flex-col gap-3 transition-all text-left ${method === 'whatsapp' ? 'border-green-500 bg-green-50/30' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'whatsapp' ? 'border-green-500' : 'border-gray-300'}`}>
                    {method === 'whatsapp' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                  </div>
                  <div>
                    <span className="font-bold block text-sm">WhatsApp</span>
                    <span className="text-[10px] text-gray-400">Order via chat</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('online')}
                  className={`p-5 rounded-2xl border-2 flex flex-col gap-3 transition-all text-left ${method === 'online' ? 'border-[#2D2926] bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'online' ? 'border-[#2D2926]' : 'border-gray-300'}`}>
                    {method === 'online' && <div className="w-2.5 h-2.5 bg-[#2D2926] rounded-full" />}
                  </div>
                  <div>
                    <span className="font-bold block text-sm">Pay Online</span>
                    <span className="text-[10px] text-gray-400">UPI, Cards, Netbanking</span>
                  </div>
                </button>
              </div>
            </section>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-1">
            <div className="bg-[#2D2926] text-white rounded-3xl p-8 sticky top-32">
              <h2 className="text-2xl font-black mb-8 tracking-tight">Order Review</h2>

              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold line-clamp-1">{item.title}</p>
                        <p className="text-gray-400 text-[10px]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold">₹{item.discounted_price_inr * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10 mb-8">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 text-white">
                  <span>Pay Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-3 ${method === 'whatsapp'
                  ? 'bg-green-600 hover:bg-green-700'
                  : method === 'online'
                    ? 'bg-[#EFECE5] text-[#2D2926] hover:bg-white'
                    : 'bg-[#6D634C] hover:bg-[#5A513E]'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : method === 'whatsapp' ? (
                  'Continue to WhatsApp'
                ) : method === 'online' ? (
                  'Proceed to Payment'
                ) : (
                  `Place Order — ₹${total}`
                )}
              </button>

              <p className="text-[10px] text-center text-gray-500 mt-6 px-4">
                By placing your order, you agree to Early5's Terms of Use and Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
