"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  name: string;
  price: number;
  scent?: string;
  quantity?: number;
  isFreeItem?: boolean;
}

interface OrderDetails {
  orderId: string;
  name: string;
  email: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedCode?: string | null;
  promoType?: string | null;
  date: string;
}

export default function CustomerAccountPage() {
  const [userName, setUserName] = useState("Valued Customer");
  const [userEmail, setUserEmail] = useState("");
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem("railaxation_user_auth");
    const savedOrders: OrderDetails[] = JSON.parse(localStorage.getItem("railaxation_orders") || "[]");

    // If user is not authenticated and has no past orders, redirect to login
    if (!isAuth && savedOrders.length === 0) {
      router.push("/login");
      return;
    }

    setUserName(localStorage.getItem("railaxation_user_name") || "Valued Customer");
    setUserEmail(localStorage.getItem("railaxation_user_email") || (savedOrders[0]?.email ?? "Guest User"));
    setOrders(savedOrders);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("railaxation_user_auth");
    localStorage.removeItem("railaxation_user_email");
    localStorage.removeItem("railaxation_user_name");
    router.push("/login");
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    const existingFeedback = JSON.parse(localStorage.getItem("railaxation_feedback") || "[]");
    const newFeedback = {
      name: userName,
      email: userEmail,
      message: feedbackMessage,
      date: new Date().toLocaleDateString(),
    };

    existingFeedback.push(newFeedback);
    localStorage.setItem("railaxation_feedback", JSON.stringify(existingFeedback));
    
    setFeedbackMessage("");
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-8 text-black font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-black pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-black font-bold">Customer Portal</span>
            <h1 className="font-serif text-3xl text-black">Welcome, {userName}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-black font-semibold uppercase tracking-wider bg-white border border-black px-4 py-2 rounded-full hover:text-orange-500 hover:border-orange-500 transition-colors"
          >
            Sign Out / Exit
          </button>
        </div>

        {/* Account Details Box */}
        <div className="bg-white p-6 rounded-2xl border border-black shadow-sm space-y-2 text-black">
          <h2 className="font-serif text-xl text-black">Account Profile</h2>
          <p className="text-xs text-black"><strong>Email Address:</strong> {userEmail || "Not provided"}</p>
        </div>

        {/* Order History Section (Pulls from railaxation_orders) */}
        <div className="bg-white p-6 rounded-2xl border border-black shadow-sm space-y-4 text-black">
          <h2 className="font-serif text-xl text-black">Past Orders & BOGO History</h2>
          
          {orders.length === 0 ? (
            <p className="text-xs text-zinc-500">You have no past orders recorded yet.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between border-b border-zinc-200 pb-2 gap-1">
                    <span><strong>Order ID:</strong> {order.orderId || `ORD-00${idx + 1}`}</span>
                    <span><strong>Date:</strong> {order.date}</span>
                    <span><strong>Status:</strong> Paid & Processing</span>
                  </div>

                  <div>
                    <p className="font-bold mb-1 uppercase tracking-wide text-[10px] text-zinc-500">Items Ordered & Free Gifts Received:</p>
                    <div className="space-y-1">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className={`flex justify-between items-center py-1 border-b border-zinc-100 ${item.isFreeItem ? 'text-emerald-800 font-semibold bg-emerald-50/60 px-2 rounded' : ''}`}>
                          <span>{item.name} {item.scent ? `(${item.scent})` : ""} × {item.quantity || 1}</span>
                          <span>{item.isFreeItem ? "🎁 FREE BOGO" : `£${(item.price * (item.quantity || 1)).toFixed(2)}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.appliedCode && (
                    <div className="p-2 bg-emerald-100/60 rounded border border-emerald-300 text-emerald-900">
                      <p><strong>Promo Code Used:</strong> {order.appliedCode}</p>
                      <p><strong>Reward:</strong> {order.promoType === "bogo" ? "Buy One Get One Free items applied." : "Percentage discount applied."}</p>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-zinc-200">
                    <span>Total Paid:</span>
                    <span>£{order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Feedback to Admin Box */}
        <div className="bg-white p-6 rounded-2xl border border-black shadow-sm space-y-4 text-black">
          <div>
            <h2 className="font-serif text-xl text-black">Send Feedback & Suggestions</h2>
            <p className="text-xs text-black">Let us know how you are enjoying your Railaxation products!</p>
          </div>

          {feedbackSent && (
            <div className="p-3 bg-white border border-black text-black text-xs rounded-xl font-semibold">
              Thank you! Your feedback has been sent directly to the Railaxation admin center.
            </div>
          )}

          <form onSubmit={submitFeedback} className="space-y-3">
            <textarea
              rows={4}
              placeholder="Write your feedback here..."
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              className="w-full p-3 border border-black rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white text-black"
              required
            />
            <button
              type="submit"
              className="bg-white border border-black text-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:text-orange-500 hover:border-orange-500 transition-all shadow-sm"
            >
              Submit Feedback
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}