# Nicks Computers

Responsive gaming & workstation PC catalogue website with built-in **Customer Authentication (Login/Register)**, **Shopping Cart**, **Razorpay Payment Gateway**, and **WhatsApp Order Sync**.

---

## 🚀 Key Features Added

1. **Authentication System (Login & Register)**:
   - **Sign In / Create Account**: Users can create an account or log in with their email and password.
   - **1-Click Demo Login**: Quick button to test login instantly without filling out credentials.
   - **Profile Dropdown**: Displays customer name, email, avatar, "My Orders" link, and Logout button.
   - **Persistence**: Sessions and users are stored securely in `localStorage` so logins persist on reload.

2. **Shopping Cart & Checkout**:
   - **Cart Drawer**: Smooth slide-in cart showing items, thumbnails, quantities, price calculations, and subtotal.
   - **Quick Buy**: "Buy Now" button on any product directly opens checkout for that product.
   - **Quantity Controls**: Adjust item counts or remove items with real-time total updates.
   - **Auto-Fill Details**: Automatically pulls logged-in user's name, email, and phone into checkout delivery fields.

3. **Razorpay Payment Gateway Integration**:
   - **Official Razorpay Checkout SDK**: Loaded securely via `https://checkout.razorpay.com/v1/checkout.js`.
   - **Payment Modes Supported**: UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, NetBanking, and Wallets.
   - **Configurable Key ID**: Set your own Razorpay Key ID at the top of `script.js` (`RAZORPAY_KEY_ID`).
   - **Instant Order Receipt**: Upon successful payment, an order confirmation modal appears with Razorpay Payment ID, Order ID, and amount paid.
   - **WhatsApp Order Confirmation**: One-click button to send complete receipt details to Nicks Computers WhatsApp number.

4. **"My Orders" Modal**:
   - View past Razorpay transactions, order timestamps, shipping address, and paid amounts anytime from the navigation or user menu.

---

## ⚙️ Configuration Setup

Open `script.js` and update the top configuration section:

```javascript
// 1. Your WhatsApp business number (digits only, with country code)
const WHATSAPP_NUMBER = "919876543210"; 

// 2. Your Razorpay Key ID (from Razorpay Dashboard > Settings > API Keys)
// Example test key: "rzp_test_51AbCdEfGhIjKl"
// Example live key: "rzp_live_xxxxxxxxxxxx"
const RAZORPAY_KEY_ID = "rzp_test_51AbCdEfGhIjKl";
```

> **Note**: If you run with the default test key or in a sandbox/offline environment, the system includes a friendly test simulation confirmation so you can test the entire checkout and order confirmation flow seamlessly!

---

## 🧪 Test Locally

Open `index.html` in your web browser (Chrome, Edge, Firefox, Brave, etc.).
Or use any local web server:
```bash
# If you have python installed
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 🌐 Deploy to Netlify

1. Sign in to [Netlify](https://www.netlify.com/).
2. Choose **Add new site** → **Deploy manually**.
3. Drag and drop the `Nicks-Computers` folder.
4. Your site will be live instantly with SSL HTTPS enabled!
