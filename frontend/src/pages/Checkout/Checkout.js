import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API_CONFIG from "../../config/api";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
    setCartItems(cart);
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        items: cartItems,
        paymentMethod: formData.paymentMethod,
      };

      if (formData.paymentMethod === "cod") {
        const response = await axios.post(API_CONFIG.buildUrl("/api/guest-orders"), orderData);

        if (response.status === 201 || response.status === 200) {
          toast.success(`Order placed successfully! Order #${response.data.data.orderNumber}`);
          localStorage.removeItem("cart");
          navigate("/");
        }
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay. Please try again.");
        return;
      }

      const createRes = await axios.post(
        API_CONFIG.buildUrl("/api/payments/razorpay/create-order"),
        orderData,
      );

      const paymentData = createRes?.data?.data;
      if (!paymentData?.razorpayOrderId || !paymentData?.keyId) {
        toast.error("Failed to initiate payment");
        return;
      }

      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "WYNA",
        description: `Order ${paymentData.orderNumber}`,
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: paymentData.customer?.name,
          email: paymentData.customer?.email,
          contact: paymentData.customer?.contact,
        },
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              API_CONFIG.buildUrl("/api/payments/razorpay/verify"),
              {
                orderId: paymentData.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            );

            if (verifyRes?.data?.success) {
              toast.success(`Payment successful! Order #${paymentData.orderNumber}`);
              localStorage.removeItem("cart");
              navigate("/");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Payment verification failed");
            console.error(err);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
        theme: {
          color: "#b89b5e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = total
  //  + total * 0.18
  ;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmitOrder}>
            <div className="form-section">
              <h2>Delivery Information</h2>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="123456"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                  />
                  Cash on Delivery
                </label>
              </div>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleInputChange}
                  />
                  Pay Online (Razorpay)
                </label>
              </div>
              {/* <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleInputChange}
                  />
                  Credit/Debit Card
                </label>
              </div>

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === "upi"}
                    onChange={handleInputChange}
                  />
                  UPI
                </label>
              </div>

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={formData.paymentMethod === "netbanking"}
                    onChange={handleInputChange}
                  />
                  Net Banking
                </label>
              </div> */}
            </div>

            <button
              type="submit"
              className="btn-place-order"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item._id} className="summary-item">
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-total">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-calculation">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>₹{total
                // .toLocaleString()
                }</span>
              </div>

              <div className="calc-row">
                <span>Shipping</span>
                <span>₹0 (Free)</span>
              </div>

              {/* <div className="calc-row">
                <span>Tax (18%)</span>
                <span>₹{(total * 0.18).toFixed(2)}</span>
              </div> */}

              <div className="summary-divider"></div>

              <div className="calc-row total">
                <span>Total Amount</span>
                <span>₹{finalTotal
                // .toFixed(2)
                }</span>
              </div>
            </div>

            <div className="info-box">
              <p>✓ Free shipping on all orders</p>
              <p>✓ 7-day return policy</p>
              <p>✓ Secure payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
