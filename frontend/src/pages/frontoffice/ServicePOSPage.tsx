import React, { useState, useEffect } from 'react';
import {
  Search, ShoppingCart, Plus, Minus, X,
  User, Utensils, Receipt, Loader2, CreditCard
} from 'lucide-react';
import { extraService } from '../../services/extraService';
import { frontOfficeService } from '../../services/frontofficeService';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const ServicePOSPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [guestSearch, setGuestSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeCategory) fetchServices(activeCategory);
  }, [activeCategory]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await extraService.getServiceCategories();
      if (res.success) {
        setCategories(res.data);
        if (res.data.length > 0) setActiveCategory(res.data[0].id);
      }
    } catch {
      toast.error("Failed to load service categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (catId: number) => {
    try {
      const res = await extraService.getServices(catId);
      if (res.success) setServices(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuestSearch = async (query: string) => {
    setGuestSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await frontOfficeService.searchUnified(query);
      if (res.success) {
        const inHouse = res.data.bookings.filter((b: any) => b.status === 'checked_in');
        setSearchResults(inHouse);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (service: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item => item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: service.id, name: service.name, price: Number(service.price), quantity: 1 }];
    });
    toast.success(`${service.name} added to cart`);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty — add items first");
      return;
    }
    if (!isWalkIn && !selectedRecipient) {
      toast.error("Select an in-house guest to link this order to");
      return;
    }
    if (isWalkIn && !walkInName.trim()) {
      toast.error("Enter guest name for walk-in order");
      return;
    }

    try {
      setSubmitting(true);
      const orderData = {
        bookingId: selectedRecipient?.id,
        roomId: selectedRecipient?.roomId,
        guestId: selectedRecipient?.guestId,
        requestedBy: isWalkIn ? walkInName : `${selectedRecipient.guest.firstName} ${selectedRecipient.guest.lastName}`,
        items: cart.map(item => ({ serviceId: item.id, quantity: item.quantity })),
        priority: 'normal' as const
      };

      const res = await extraService.createOrder(orderData);
      if (res.success) {
        toast.success(isWalkIn ? "Walk-in order created" : `Order posted to Room ${selectedRecipient.room?.roomNumber}`);
        setCart([]);
        setSelectedRecipient(null);
        setGuestSearch("");
        setWalkInName("");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)' }}>
            Services & POS
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--color-muted)', marginTop: '2px' }}>
            Quick service ordering and folio posting
          </p>
        </div>
      </div>

      {/* Guest / Walk-in selector card */}
      <div className="card" style={{ padding: '20px' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'var(--color-primary-lt)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <User size={20} />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
                {isWalkIn ? "Walk-in Guest" : "In-house Guest"}
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-muted)' }}>
                {isWalkIn ? "Direct payment, not linked to a room" : "Charges will be added to guest folio"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-lg">
            {isWalkIn ? (
              <input
                type="text"
                placeholder="Guest name for receipt..."
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                className="input-field"
                style={{ flex: 1 }}
              />
            ) : (
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-muted)',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by room number or guest name..."
                  value={guestSearch}
                  onChange={(e) => handleGuestSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '36px' }}
                />

                {/* Dropdown search results */}
                {searchResults.length > 0 && !selectedRecipient && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      right: 0,
                      background: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 50,
                      maxHeight: '240px',
                      overflowY: 'auto'
                    }}
                  >
                    {searchResults.map((res: any) => (
                      <button
                        key={res.id}
                        onClick={() => {
                          setSelectedRecipient(res);
                          setGuestSearch(`Room ${res.room?.roomNumber} — ${res.guest?.firstName} ${res.guest?.lastName}`);
                          setSearchResults([]);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'none',
                          border: 'none',
                          borderBottom: '1px solid var(--color-border)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        className="hover:bg-gray-50"
                      >
                        <div>
                          <span className="text-room-number" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>
                            Room {res.room?.roomNumber}
                          </span>
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-ink)', marginLeft: '8px' }}>
                            {res.guest?.firstName} {res.guest?.lastName}
                          </span>
                        </div>
                        <span className="badge badge-checked-in">Checked In</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setIsWalkIn(!isWalkIn);
                setSelectedRecipient(null);
                setSearchResults([]);
                setGuestSearch("");
                setWalkInName("");
              }}
              className="btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              {isWalkIn ? "Switch to In-house" : "Switch to Walk-in"}
            </button>
          </div>
        </div>
      </div>

      {/* Main split: Menu (left) & Cart (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category tabs & item cards */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`chip ${activeCategory === cat.id ? 'chip-active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Service items grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '12px' }} />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => addToCart(service)}
                  className="card flex flex-col justify-between cursor-pointer"
                  style={{ padding: '16px', minHeight: '130px' }}
                >
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.3 }}>
                      {service.name}
                    </h4>
                    {service.description && (
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-amount" style={{ fontSize: '15px', color: 'var(--color-primary)' }}>
                      NPR {Number(service.price).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); addToCart(service); }}
                      className="btn-primary"
                      style={{ height: '32px', padding: '0 12px', fontSize: '12px' }}
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center text-center card"
              style={{ padding: '48px 24px', borderStyle: 'dashed' }}
            >
              <Utensils size={32} style={{ color: 'var(--color-muted)', marginBottom: '12px' }} />
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--color-muted)' }}>
                No items available in this category
              </p>
            </div>
          )}
        </div>

        {/* Right: Cart (Rule 2.1: Cart is always visible) */}
        <div className="lg:col-span-4">
          <div
            className="card flex flex-col justify-between sticky top-28"
            style={{ minHeight: '440px', padding: '20px' }}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)', marginBottom: '16px' }}>
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} style={{ color: 'var(--color-primary)' }} />
                  <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 600, color: 'var(--color-ink)' }}>
                    Order Cart
                  </h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '12px', fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Items List */}
              {cart.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between pb-2 border-b"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div style={{ flex: 1, paddingRight: '8px' }}>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
                          {item.name}
                        </p>
                        <p className="text-amount" style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
                          NPR {item.price.toLocaleString()} each
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink)' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, width: '20px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink)' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Line total */}
                        <span className="text-amount" style={{ width: '80px', textAlign: 'right', fontSize: '13px', color: 'var(--color-ink)' }}>
                          NPR {(item.price * item.quantity).toLocaleString()}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '2px' }}
                          title="Remove item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty cart */
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <Receipt size={36} style={{ color: 'var(--color-border)', marginBottom: '8px' }} />
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 500, color: 'var(--color-muted)' }}>
                    Your cart is empty
                  </p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Click any item from the menu to add it
                  </p>
                </div>
              )}
            </div>

            {/* Total and Checkout */}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)', marginTop: '16px' }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 500, color: 'var(--color-muted)' }}>
                  Total Amount
                </span>
                <span className="text-amount" style={{ fontSize: '20px', color: 'var(--color-ink)' }}>
                  NPR {totalAmount.toLocaleString()}
                </span>
              </div>

              {/* One primary action button per screen */}
              <button
                disabled={submitting || cart.length === 0}
                onClick={handlePlaceOrder}
                className="btn-primary"
                style={{ width: '100%', height: '44px' }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>{isWalkIn ? "Collect Payment" : "Post to Guest Folio"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePOSPage;
