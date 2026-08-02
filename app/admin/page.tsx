"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RAILAXATION_SCENTS = [
  "Strawberry", "Lavender", "Eucalyptus", "Lime", "Lemongrass", 
  "Sweet Orange", "Ylang Ylang", "Sandalwood", "Jasmine", "Grapefruit"
];

const BASE_PRODUCTS = [
  { id: 1, name: "Railaxation Heart Soap", price: 4.50, category: "soaps", scents: RAILAXATION_SCENTS },
  { id: 2, name: "Railaxation Large Cube Soap", price: 4.50, category: "soaps", scents: RAILAXATION_SCENTS },
  { id: 3, name: "Railaxation Car Soap", price: 5.00, category: "soaps", scents: RAILAXATION_SCENTS },
  { id: 4, name: "Pack of 3 Railaxation Glam Handsoaps", price: 5.00, category: "soaps", scents: RAILAXATION_SCENTS },
  { id: 5, name: "Pack of 3 Railaxation Star Shaped Handsoaps", price: 5.00, category: "soaps", scents: RAILAXATION_SCENTS },
  { id: 6, name: "Railaxation Cubed Pack of 2 Handsoaps", price: 5.00, category: "soaps", scents: RAILAXATION_SCENTS },
  { id: 7, name: "Railaxation Wax Melts (Pack of 4)", price: 5.00, category: "candles", scents: RAILAXATION_SCENTS },
  { id: 8, name: "Railaxation Suddy Bear Handsoap (Pack of 2)", price: 6.00, category: "soaps", scents: RAILAXATION_SCENTS },
  { id: 9, name: "Railaxation Botanical Rose Soap", price: 6.00, category: "soaps", scents: RAILAXATION_SCENTS },
  { id: 10, name: "Railaxation 8oz Premium Candle Tin", price: 15.00, category: "candles", scents: RAILAXATION_SCENTS },
  { id: 11, name: "Railaxation Kids Box - Girls", price: 15.00, category: "boxes", scents: RAILAXATION_SCENTS },
  { id: 12, name: "Railaxation Kids Box - Boys", price: 15.00, category: "boxes", scents: RAILAXATION_SCENTS },
  { id: 13, name: "Railaxation Women's Standard Box", price: 35.00, category: "boxes", scents: RAILAXATION_SCENTS },
  { id: 14, name: "Railaxation Men's Standard Box", price: 35.00, category: "boxes", scents: RAILAXATION_SCENTS },
  { id: 15, name: "Railaxation Women's Premium Box", price: 40.00, category: "boxes", scents: RAILAXATION_SCENTS },
  { id: 16, name: "Railaxation Men's Premium Box", price: 45.00, category: "boxes", scents: RAILAXATION_SCENTS },
];

const generateVariantList = () => {
  const list: { uniqueId: string; name: string; price: number; category: string; scent: string; inStock: boolean; discounted: boolean; discountPercent: number }[] = [];
  BASE_PRODUCTS.forEach((prod) => {
    prod.scents.forEach((scent) => {
      list.push({
        uniqueId: `${prod.id}-${scent}`,
        name: prod.name,
        price: prod.price,
        category: prod.category,
        scent: scent,
        inStock: true,
        discounted: false,
        discountPercent: 10,
      });
    });
  });
  return list;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [variants, setVariants] = useState(generateVariantList());
  const [activeTab, setActiveTab] = useState<"inventory" | "promos" | "redemptions" | "staff" | "orders" | "feedback" | "settings">("inventory");
  
  // Filtering
  const [searchFilter, setSearchFilter] = useState("");
  const [scentFilter, setScentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  
  // Promo codes state
  const [promoCodes, setPromoCodes] = useState<
    { code: string; type: "percent" | "bogo"; category: string; specificItem?: string; percent: number; active: boolean }[]
  >([]);
  
  // Code redemption history log state
  const [redemptionHistory, setRedemptionHistory] = useState<
    { email: string; code: string; type: string; date: string }[]
  >([]);

  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoType, setNewPromoType] = useState<"percent" | "bogo">("percent");
  const [newPromoCategory, setNewPromoCategory] = useState("candles");
  const [newPromoSpecificItem, setNewPromoSpecificItem] = useState("all");
  const [newPromoPercent, setNewPromoPercent] = useState(15);

  // Staff Invitation state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLinkResult, setInviteLinkResult] = useState("");

  // Password Change
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [showAdminLoginPassword, setShowAdminLoginPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState("Railaxation2026!");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");

  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedInventory = localStorage.getItem("railaxation_admin_variants");
    if (savedInventory) { try { setVariants(JSON.parse(savedInventory)); } catch (e) { console.error(e); } }
    const savedPass = localStorage.getItem("railaxation_custom_admin_password");
    if (savedPass) setAdminPassword(savedPass);
    const savedPromos = localStorage.getItem("railaxation_promos");
    if (savedPromos) { try { setPromoCodes(JSON.parse(savedPromos)); } catch (e) { console.error(e); } }
    const savedRedemptions = localStorage.getItem("railaxation_code_history");
    if (savedRedemptions) { try { setRedemptionHistory(JSON.parse(savedRedemptions)); } catch (e) { console.error(e); } }
    const savedOrders = localStorage.getItem("railaxation_orders");
    if (savedOrders) { try { setOrdersList(JSON.parse(savedOrders)); } catch (e) { console.error(e); } }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect admin password.");
    }
  };

  const updateItemPrice = (uniqueId: string, newPrice: number) => {
    const updated = variants.map((item) =>
      item.uniqueId === uniqueId ? { ...item, price: Math.max(0, newPrice) } : item
    );
    setVariants(updated);
    localStorage.setItem("railaxation_admin_variants", JSON.stringify(updated));
  };

  const toggleDiscount = (uniqueId: string) => {
    const updated = variants.map((item) =>
      item.uniqueId === uniqueId ? { ...item, discounted: !item.discounted } : item
    );
    setVariants(updated);
    localStorage.setItem("railaxation_admin_variants", JSON.stringify(updated));
  };

  const updateDiscountPercent = (uniqueId: string, percent: number) => {
    const updated = variants.map((item) =>
      item.uniqueId === uniqueId ? { ...item, discountPercent: Math.max(0, Math.min(100, percent)) } : item
    );
    setVariants(updated);
    localStorage.setItem("railaxation_admin_variants", JSON.stringify(updated));
  };

  const toggleStock = (uniqueId: string) => {
    const updated = variants.map((item) =>
      item.uniqueId === uniqueId ? { ...item, inStock: !item.inStock } : item
    );
    setVariants(updated);
    localStorage.setItem("railaxation_admin_variants", JSON.stringify(updated));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError("");
    setPasswordChangeMessage("");

    if (currentPasswordInput !== adminPassword) {
      setPasswordChangeError("Current admin password is incorrect.");
      alert("Current admin password is incorrect.");
      return;
    }

    if (!newPasswordInput || newPasswordInput.length < 6) {
      setPasswordChangeError("New password must be at least 6 characters long.");
      alert("New password must be at least 6 characters long.");
      return;
    }

    setAdminPassword(newPasswordInput);
    localStorage.setItem("railaxation_custom_admin_password", newPasswordInput);
    setCurrentPasswordInput("");
    setNewPasswordInput("");
    setPasswordChangeMessage("Admin password changed successfully. The new password is now stored and will be used until it is changed again.");
    alert("Admin password updated successfully!");
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    const data = await res.json();
    if (data.inviteLink) {
      setInviteLinkResult(data.inviteLink);
      alert("Secure single-use 48hr invitation link generated successfully.");
    }
  };

  const handleAddPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode) return;
    
    const newEntry = {
      code: newPromoCode.toUpperCase(),
      type: newPromoType,
      category: newPromoCategory,
      specificItem: newPromoSpecificItem !== "all" ? newPromoSpecificItem : undefined,
      percent: newPromoType === "percent" ? newPromoPercent : 100,
      active: true,
    };

    const updated = [...promoCodes, newEntry];
    setPromoCodes(updated);
    localStorage.setItem("railaxation_promos", JSON.stringify(updated));
    setNewPromoCode("");
    alert("Promo code successfully created!");
  };

  const togglePromoActive = (codeStr: string) => {
    const updated = promoCodes.map((p) => p.code === codeStr ? { ...p, active: !p.active } : p);
    setPromoCodes(updated);
    localStorage.setItem("railaxation_promos", JSON.stringify(updated));
  };

  const filteredVariants = variants.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesScent = scentFilter === "all" || item.scent === scentFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "inStock" && item.inStock) || (statusFilter === "soldOut" && !item.inStock);
    return matchesSearch && matchesScent && matchesStatus;
  });

  const filteredOrders = ordersList.filter((order) => {
    if (orderStatusFilter === "all") return true;
    const normalizedStatus = (order.status || "Paid & Processing").toLowerCase();

    if (orderStatusFilter === "fulfilled") {
      return normalizedStatus.includes("fulfilled") || normalizedStatus.includes("complete") || normalizedStatus.includes("ready");
    }

    if (orderStatusFilter === "pending") {
      return normalizedStatus.includes("processing") || normalizedStatus.includes("paid") || normalizedStatus.includes("pending") || normalizedStatus.includes("not completed");
    }

    return true;
  });

  const updateOrderTracking = (orderIndex: number, field: "trackingNumber" | "courier", value: string) => {
    const updated = ordersList.map((order, index) => {
      if (index !== orderIndex) return order;
      return {
        ...order,
        [field]: value,
      };
    });

    setOrdersList(updated);
    localStorage.setItem("railaxation_orders", JSON.stringify(updated));
  };

  const toggleVariantSelection = (uniqueId: string) => {
    setSelectedVariantIds((prev) =>
      prev.includes(uniqueId)
        ? prev.filter((id) => id !== uniqueId)
        : [...prev, uniqueId]
    );
  };

  const toggleSelectVisibleVariants = () => {
    const visibleIds = filteredVariants.map((item) => item.uniqueId);
    const allVisibleSelected = visibleIds.every((id) => selectedVariantIds.includes(id));

    if (allVisibleSelected) {
      setSelectedVariantIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedVariantIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const applyBulkStockAction = (nextInStock: boolean) => {
    if (selectedVariantIds.length === 0) {
      alert("Select at least one item first.");
      return;
    }

    const updated = variants.map((item) =>
      selectedVariantIds.includes(item.uniqueId)
        ? { ...item, inStock: nextInStock }
        : item
    );

    setVariants(updated);
    localStorage.setItem("railaxation_admin_variants", JSON.stringify(updated));
    setSelectedVariantIds([]);
    alert(`Updated ${selectedVariantIds.length} selected items to ${nextInStock ? "in stock" : "out of stock"}.`);
  };

  const updateOrderStatus = (orderId: string, nextStatus: string) => {
    const updated = ordersList.map((order) =>
      order.orderId === orderId ? { ...order, status: nextStatus } : order
    );

    setOrdersList(updated);
    localStorage.setItem("railaxation_orders", JSON.stringify(updated));
  };

  const removeOrder = (orderId: string) => {
    const updated = ordersList.filter((order) => order.orderId !== orderId);
    setOrdersList(updated);
    localStorage.setItem("railaxation_orders", JSON.stringify(updated));
  };

  const clearAllOrders = () => {
    if (!window.confirm("This will permanently remove all stored orders from the admin dashboard. Continue?")) {
      return;
    }

    setOrdersList([]);
    localStorage.setItem("railaxation_orders", JSON.stringify([]));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6 font-sans text-black">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-4 border border-black">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-black font-bold">Secure Access</span>
            <h1 className="font-serif text-2xl text-black">Admin Portal</h1>
          </div>
          <div className="relative">
            <input
              type={showAdminLoginPassword ? "text" : "password"}
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-20 border border-black rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black text-black bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowAdminLoginPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wide text-black hover:text-orange-500 transition-colors active:scale-95"
            >
              {showAdminLoginPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-white border border-black text-black font-semibold py-3 rounded-full text-xs uppercase tracking-widest hover:text-orange-500 hover:border-orange-500 transition-all shadow-sm active:scale-95 active:bg-zinc-100"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-4 sm:p-6 md:p-8 text-black font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center border-b border-black pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-black font-bold">Railaxation Management</span>
            <h1 className="font-serif text-2xl sm:text-3xl text-black">Admin Control Center</h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-black font-semibold uppercase tracking-wider bg-white border border-black px-4 py-2 rounded-full hover:text-orange-500 hover:border-orange-500 transition-colors whitespace-nowrap"
          >
            Logout
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex gap-4 border-b border-black pb-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold overflow-x-auto text-black snap-x snap-mandatory">
          <button onClick={() => setActiveTab("inventory")} className={`pb-2 border-b-2 transition-colors whitespace-nowrap hover:text-orange-500 ${activeTab === "inventory" ? "border-black text-black font-bold" : "border-transparent text-black"}`}>
            Inventory & Price Control ({variants.length})
          </button>
          <button onClick={() => setActiveTab("promos")} className={`pb-2 border-b-2 transition-colors whitespace-nowrap hover:text-orange-500 ${activeTab === "promos" ? "border-black text-black font-bold" : "border-transparent text-black"}`}>
            Promo Codes & Ticker
          </button>
          <button onClick={() => setActiveTab("redemptions")} className={`pb-2 border-b-2 transition-colors whitespace-nowrap hover:text-orange-500 ${activeTab === "redemptions" ? "border-black text-black font-bold" : "border-transparent text-black"}`}>
            Code Redemptions ({redemptionHistory.length})
          </button>
          <button onClick={() => setActiveTab("staff")} className={`pb-2 border-b-2 transition-colors whitespace-nowrap hover:text-orange-500 ${activeTab === "staff" ? "border-black text-black font-bold" : "border-transparent text-black"}`}>
            Staff Invitations
          </button>
          <button onClick={() => setActiveTab("orders")} className={`pb-2 border-b-2 transition-colors whitespace-nowrap hover:text-orange-500 ${activeTab === "orders" ? "border-black text-black font-bold" : "border-transparent text-black"}`}>
            Customer Orders ({ordersList.length})
          </button>
          <button onClick={() => setActiveTab("feedback")} className={`pb-2 border-b-2 transition-colors whitespace-nowrap hover:text-orange-500 ${activeTab === "feedback" ? "border-black text-black font-bold" : "border-transparent text-black"}`}>
            Feedback ({feedbackList.length})
          </button>
          <button onClick={() => setActiveTab("settings")} className={`pb-2 border-b-2 transition-colors whitespace-nowrap hover:text-orange-500 ${activeTab === "settings" ? "border-black text-black font-bold" : "border-transparent text-black"}`}>
            Password Settings
          </button>
        </div>

        {/* TAB 1: INVENTORY, DYNAMIC PRICING & ITEM DISCOUNTS */}
        {activeTab === "inventory" && (
          <div className="space-y-4 text-black">
            <div className="bg-white p-4 rounded-2xl border border-black flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm text-black">
              <input
                type="text"
                placeholder="Search product or car soap..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full md:w-64 p-2.5 border border-black rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black text-black bg-white"
              />

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-black">
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-black">
                  <button onClick={() => setStatusFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${statusFilter === "all" ? "bg-black text-white" : "text-black bg-white"}`}>All</button>
                  <button onClick={() => setStatusFilter("inStock")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${statusFilter === "inStock" ? "bg-black text-white" : "text-black bg-white"}`}>In Stock</button>
                  <button onClick={() => setStatusFilter("soldOut")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${statusFilter === "soldOut" ? "bg-black text-white" : "text-black bg-white"}`}>Sold Out</button>
                </div>

                <select value={scentFilter} onChange={(e) => setScentFilter(e.target.value)} className="p-2.5 border border-black rounded-xl text-xs bg-white font-medium text-black">
                  <option value="all">All Scents</option>
                  {RAILAXATION_SCENTS.map((scent) => <option key={scent} value={scent}>{scent}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black shadow-sm text-black">
              <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filteredVariants.length > 0 && filteredVariants.every((item) => selectedVariantIds.includes(item.uniqueId))}
                    onChange={toggleSelectVisibleVariants}
                    className="h-4 w-4"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider">Select Visible</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyBulkStockAction(true)}
                    className="px-3 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold border border-black bg-black text-white whitespace-nowrap"
                  >
                    Bulk Mark In Stock
                  </button>
                  <button
                    onClick={() => applyBulkStockAction(false)}
                    className="px-3 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold border border-black bg-white text-black whitespace-nowrap"
                  >
                    Bulk Mark Out of Stock
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black overflow-hidden shadow-sm max-h-[600px] overflow-y-auto overflow-x-auto text-black">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-white border-b border-black text-black text-xs uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="p-4 font-bold text-black">Select</th>
                    <th className="p-4 font-bold text-black">Product Name</th>
                    <th className="p-4 font-bold text-black">Scent</th>
                    <th className="p-4 font-bold text-black">Dynamic Price (£)</th>
                    <th className="p-4 font-bold text-black">Discount Control</th>
                    <th className="p-4 font-bold text-black">Status</th>
                    <th className="p-4 text-right font-bold text-black">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {filteredVariants.map((item) => (
                    <tr key={item.uniqueId} className="hover:bg-zinc-100 transition-colors text-black">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedVariantIds.includes(item.uniqueId)}
                          onChange={() => toggleVariantSelection(item.uniqueId)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="p-4 font-medium text-black align-top">
                        {item.name}
                        <span className="block text-[10px] text-black uppercase tracking-widest">{item.category}</span>
                      </td>
                      <td className="p-4 text-black font-medium text-xs align-top">
                        <span className="bg-white border border-black px-2.5 py-1 rounded-md text-black whitespace-nowrap">{item.scent}</span>
                      </td>
                      <td className="p-4 text-black align-top">
                        <input
                          type="number"
                          step="0.50"
                          value={item.price}
                          onChange={(e) => updateItemPrice(item.uniqueId, parseFloat(e.target.value) || 0)}
                          className="w-24 p-1.5 border border-black rounded-lg text-xs font-semibold bg-white text-black"
                        />
                      </td>
                      <td className="p-4 space-y-1 align-top">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => toggleDiscount(item.uniqueId)}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase border border-black transition-all whitespace-nowrap ${
                              item.discounted ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100"
                            }`}
                          >
                            {item.discounted ? "Discount Active" : "Discount Off"}
                          </button>
                        </div>
                        {item.discounted && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            <input
                              type="number"
                              value={item.discountPercent}
                              onChange={(e) => updateDiscountPercent(item.uniqueId, parseInt(e.target.value) || 0)}
                              className="w-16 p-1 border border-black rounded text-[11px] text-black bg-white font-bold"
                            />
                            <span className="text-[10px] text-black font-bold">% OFF</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-top">
                        <span className="text-xs px-3 py-1 rounded-full font-bold uppercase border border-black bg-white text-black whitespace-nowrap">
                          {item.inStock ? "In Stock" : "Sold Out"}
                        </span>
                      </td>
                      <td className="p-4 text-right align-top">
                        <button
                          onClick={() => toggleStock(item.uniqueId)}
                          className="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-white border border-black text-black hover:text-orange-500 hover:border-orange-500 transition-all whitespace-nowrap"
                        >
                          {item.inStock ? "Mark Out of Stock" : "Mark Available"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PROMO CODES & TICKER */}
        {activeTab === "promos" && (
          <div className="space-y-6 text-black">
            <div className="bg-white p-6 rounded-2xl border border-black shadow-sm max-w-lg space-y-4">
              <h2 className="font-serif text-xl text-black">Create Checkout Promo Code</h2>
              <form onSubmit={handleAddPromoCode} className="space-y-3 text-black">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black mb-1">Code Name</label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER20 or BOGOSOAP"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value)}
                    className="w-full p-3 border border-black rounded-xl text-sm bg-white text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-black mb-1">Promo Type</label>
                  <select
                    value={newPromoType}
                    onChange={(e) => setNewPromoType(e.target.value as "percent" | "bogo")}
                    className="w-full p-3 border border-black rounded-xl text-sm bg-white text-black font-medium"
                  >
                    <option value="percent">Percentage Discount Off</option>
                    <option value="bogo">Buy 1 Get 1 Free (BOGO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-black mb-1">Target Category</label>
                  <select
                    value={newPromoCategory}
                    onChange={(e) => setNewPromoCategory(e.target.value)}
                    className="w-full p-3 border border-black rounded-xl text-sm bg-white text-black font-medium"
                  >
                    <option value="candles">Candles Only</option>
                    <option value="soaps">Soaps Only</option>
                    <option value="boxes">Gift Boxes Only</option>
                    <option value="all">Entire Store</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-black mb-1">Target Specific Individual Item (Optional)</label>
                  <select
                    value={newPromoSpecificItem}
                    onChange={(e) => setNewPromoSpecificItem(e.target.value)}
                    className="w-full p-3 border border-black rounded-xl text-sm bg-white text-black font-medium"
                  >
                    <option value="all">Apply to Entire Category / Store</option>
                    {BASE_PRODUCTS.map((prod) => (
                      <option key={prod.name} value={prod.name}>{prod.name}</option>
                    ))}
                  </select>
                </div>

                {newPromoType === "percent" && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-black mb-1">Discount Percentage</label>
                    <input
                      type="number"
                      value={newPromoPercent}
                      onChange={(e) => setNewPromoPercent(parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-black rounded-xl text-sm bg-white text-black"
                      required
                    />
                  </div>
                )}

                <button type="submit" className="w-full bg-white border border-black text-black font-semibold py-3 rounded-full text-xs uppercase tracking-widest hover:text-orange-500 hover:border-orange-500 transition-all">
                  Save Promo Code
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-black shadow-sm space-y-4">
              <h2 className="font-serif text-xl text-black">Active Promo Codes</h2>
              {promoCodes.length === 0 ? (
                <p className="text-xs text-black">No promo codes created yet.</p>
              ) : (
                <div className="space-y-2">
                  {promoCodes.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-black rounded-xl bg-white text-black">
                      <div>
                        <span className="font-bold text-black">{p.code}</span>{" "}
                        {p.type === "bogo" ? (
                          <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold ml-1">BOGO Free</span>
                        ) : (
                          <span>({p.percent}% off)</span>
                        )}{" "}
                        <span className="text-xs text-zinc-600">
                          [{p.category}{p.specificItem ? ` - ${p.specificItem}` : ""}]
                        </span>
                      </div>
                      <button
                        onClick={() => togglePromoActive(p.code)}
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase border border-black bg-white text-black hover:text-orange-500"
                      >
                        {p.active ? "Active (Disable)" : "Inactive (Enable)"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CODE REDEMPTIONS */}
        {activeTab === "redemptions" && (
          <div className="space-y-4 text-black">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-black shadow-sm space-y-4">
              <h2 className="font-serif text-xl text-black">Customer Code Redemption Logs</h2>
              <p className="text-xs text-zinc-600">Tracks which customer email used which promo code. Once used, the code is locked and expires for that specific email address.</p>
              
              {redemptionHistory.length === 0 ? (
                <div className="p-12 text-center rounded-xl border border-black text-xs text-black">No promo codes have been redeemed by customers yet.</div>
              ) : (
                <div className="rounded-xl border border-black overflow-hidden overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-white border-b border-black text-black text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-4 font-bold">Customer Email</th>
                        <th className="p-4 font-bold">Promo Code Used</th>
                        <th className="p-4 font-bold">Type</th>
                        <th className="p-4 font-bold text-right">Redemption Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black">
                      {redemptionHistory.map((log, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50 transition-colors text-xs">
                          <td className="p-4 font-medium text-black">{log.email}</td>
                          <td className="p-4 font-bold text-black uppercase">{log.code}</td>
                          <td className="p-4 text-black uppercase">{log.type}</td>
                          <td className="p-4 text-right text-black">{log.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF INVITATIONS */}
        {activeTab === "staff" && (
          <div className="bg-white p-8 rounded-2xl border border-black shadow-sm max-w-lg space-y-4 text-black">
            <div>
              <h2 className="font-serif text-2xl mb-1 text-black">Secure Staff Invitation</h2>
              <p className="text-xs text-black">Generate a 48-hour secure tokenized invitation link locked to a specific staff email address.</p>
            </div>
            <form onSubmit={handleGenerateInvite} className="space-y-4 text-black">
              <div>
                <label className="block text-xs uppercase tracking-wider text-black mb-1">Staff Email Address</label>
                <input
                  type="email"
                  placeholder="staff@railaxation.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-3 border border-black rounded-xl text-sm bg-white text-black"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-white border border-black text-black font-semibold py-3 rounded-full text-xs uppercase tracking-widest hover:text-orange-500 hover:border-orange-500 transition-all">
                Generate 48h Invitation Link
              </button>
            </form>
            {inviteLinkResult && (
              <div className="p-4 border border-black rounded-xl bg-white space-y-2 text-black">
                <p className="text-xs font-bold">Generated Secure Link:</p>
                <input type="text" readOnly value={inviteLinkResult} className="w-full p-2 border border-black text-xs bg-white text-black rounded" />
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-4 text-black">
            <div className="bg-white p-4 rounded-2xl border border-black shadow-sm flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setOrderStatusFilter("all")} className={`px-3 py-2 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${orderStatusFilter === "all" ? "bg-black text-white" : "bg-white border border-black text-black"}`}>All</button>
                <button onClick={() => setOrderStatusFilter("pending")} className={`px-3 py-2 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${orderStatusFilter === "pending" ? "bg-black text-white" : "bg-white border border-black text-black"}`}>Pending / Processing</button>
                <button onClick={() => setOrderStatusFilter("fulfilled")} className={`px-3 py-2 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${orderStatusFilter === "fulfilled" ? "bg-black text-white" : "bg-white border border-black text-black"}`}>Fulfilled</button>
              </div>

              <button
                onClick={clearAllOrders}
                className="px-4 py-2 rounded-full text-[10px] font-bold uppercase border border-red-500 bg-white text-red-600 whitespace-nowrap"
              >
                Clear All Orders
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-black text-black text-sm">No customer orders match the current filter.</div>
            ) : (
              filteredOrders.map((order, idx) => (
                <div key={order.orderId || idx} className="bg-white p-6 rounded-2xl border border-black shadow-sm space-y-3 text-xs text-black">
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center font-bold pb-2 border-b border-black">
                    <span>Order #{idx + 1}</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold whitespace-nowrap ${
                        (order.status || "Paid & Processing").toLowerCase().includes("fulfilled") || (order.status || "Paid & Processing").toLowerCase().includes("complete")
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-400"
                          : "bg-amber-100 text-amber-800 border border-amber-400"
                      }`}>
                        {order.status || "Paid & Processing"}
                      </span>
                      <button
                        onClick={() => removeOrder(order.orderId)}
                        className="px-3 py-1 rounded-full border border-red-500 text-red-600 font-bold uppercase text-[10px] whitespace-nowrap"
                      >
                        Remove Order
                      </button>
                    </div>
                  </div>
                  <p><strong>Customer:</strong> {order.name} ({order.email})</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-black mb-1">Courier</label>
                      <input
                        value={order.courier || "Royal Mail / Railaxation Delivery"}
                        onChange={(e) => updateOrderTracking(idx, "courier", e.target.value)}
                        className="w-full p-2 border border-black rounded-lg text-xs bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-black mb-1">Tracking Number</label>
                      <input
                        value={order.trackingNumber || ""}
                        onChange={(e) => updateOrderTracking(idx, "trackingNumber", e.target.value)}
                        className="w-full p-2 border border-black rounded-lg text-xs bg-white text-black"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateOrderStatus(order.orderId, "Fulfilled")}
                      className="px-3 py-2 rounded-full border border-black bg-black text-white text-[10px] font-bold uppercase"
                    >
                      Mark Fulfilled
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.orderId, "Paid & Processing")}
                      className="px-3 py-2 rounded-full border border-black bg-white text-black text-[10px] font-bold uppercase"
                    >
                      Mark Pending
                    </button>
                  </div>
                  <div>
                    <strong>Items:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      {order.items?.map((item: any, i: number) => (
                        <li key={i}>
                          {item.name} {item.scent ? `(${item.scent})` : ""} x {item.quantity || 1} — £{(item.price * (item.quantity || 1)).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {order.appliedCode && (
                    <p className="text-emerald-600 font-semibold">Promo Code Used: <span className="uppercase">{order.appliedCode}</span></p>
                  )}
                  <p className="font-bold text-sm">Total Paid: £{Number(order.total || 0).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 6: FEEDBACK */}
        {activeTab === "feedback" && (
          <div className="space-y-4 text-black">
            {feedbackList.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-black text-black text-sm">No feedback received.</div>
            ) : (
              feedbackList.map((fb, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-black shadow-sm space-y-2 text-black">
                  <div className="flex justify-between text-xs border-b border-black pb-2 font-bold">
                    <span>{fb.name}</span>
                    <span>{fb.date}</span>
                  </div>
                  <p className="text-sm italic font-light">&quot;{fb.message}&quot;</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 7: SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white p-8 rounded-2xl border border-black shadow-sm max-w-lg space-y-4 text-black">
            <div>
              <h2 className="font-serif text-2xl mb-1 text-black">Change Admin Password</h2>
              <p className="text-xs text-black">Update the secure master access passcode for the Railaxation control center.</p>
            </div>

            {passwordChangeError && (
              <div className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                {passwordChangeError}
              </div>
            )}

            {passwordChangeMessage && (
              <div className="p-3 border border-emerald-500 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold">
                {passwordChangeMessage}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 text-black">
              <div>
                <label className="block text-xs uppercase tracking-wider text-black mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="w-full p-3 pr-20 border border-black rounded-xl text-sm bg-white text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wide text-black hover:text-orange-500 transition-colors active:scale-95"
                  >
                    {showCurrentPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-black mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full p-3 pr-20 border border-black rounded-xl text-sm bg-white text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wide text-black hover:text-orange-500 transition-colors active:scale-95"
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-white border border-black text-black font-semibold py-3 rounded-full text-xs uppercase tracking-widest hover:text-orange-500 hover:border-orange-500 transition-all active:scale-95 active:bg-zinc-100">
                Update Admin Password
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}