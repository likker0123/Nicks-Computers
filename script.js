/* ==============================================================
   NICKS COMPUTERS - MAIN CLIENT SCRIPT
   Features:
   - Dynamic Product Catalogue & Instant Search / Filter
   - Authentication System (Local Signup, Signin, Session, Demo Login)
   - Shopping Cart with Drawer & Quantity Management
   - Razorpay Payment Gateway Integration with Order Confirmation
   - Order History ("My Orders") with Receipt & WhatsApp Sync
   - Direct WhatsApp Enquiry Integration
   ============================================================== */

/* ==============================================================
   CONFIGURATIONS (Yahan apna WhatsApp & Razorpay Key set karein)
   ============================================================== */
// WhatsApp number with country code (no + or spaces). India example: 919876543210
const WHATSAPP_NUMBER = "919876543210"; // CHANGE THIS BEFORE PUBLISHING

/*
  Razorpay Test or Live Key ID:
  Apna Key ID Razorpay Dashboard > Settings > API Keys se le kar yahan daalein.
  Example test key: "rzp_test_51AbCdEfGhIjKl"
  Agir key test placeholder hai, to bhi checkout test simulation seamlessly run hoga.
*/
const RAZORPAY_KEY_ID = "rzp_test_51AbCdEfGhIjKl";

/* ==============================================================
   PRODUCT CATALOGUE DATA WITH REAL INR PRICES
   ============================================================== */
const products = [
  {
    id: "gaming-pc",
    name: "Gaming Desktop PC (RTX 4060, i5 13th Gen)",
    category: "Desktops",
    price: 64999,
    description: "High FPS performance, liquid cooled with 16GB RGB RAM & 1TB NVMe SSD.",
    symbol: "🖥️",
    badge: "POPULAR"
  },
  {
    id: "creator-pc",
    name: "Creator Workstation (i7 / 32GB RAM)",
    category: "Desktops",
    price: 89999,
    description: "Designed for video editing, 3D rendering, Blender and Adobe Creative Cloud.",
    symbol: "⚙️",
    badge: "CREATOR PICK"
  },
  {
    id: "graphics-card",
    name: "NVIDIA GeForce RTX 4070 12GB",
    category: "Components",
    price: 54500,
    description: "DLSS 3, ray tracing, 12GB GDDR6X VRAM for ultra 1440p and 4K gaming.",
    symbol: "▧",
    badge: "COMPONENTS"
  },
  {
    id: "memory-storage",
    name: "32GB DDR5 RAM + 1TB Gen4 NVMe SSD",
    category: "Components",
    price: 11999,
    description: "Blazing fast 6000MHz RGB RAM dual channel kit & 7000MB/s NVMe storage.",
    symbol: "▤",
    badge: "UPGRADE"
  },
  {
    id: "gaming-monitor",
    name: "27\" 165Hz QHD 2K IPS Gaming Monitor",
    category: "Accessories",
    price: 21499,
    description: "1ms response, 99% sRGB color gamut, HDR10 and G-Sync compatible.",
    symbol: "▱",
    badge: "DISPLAY"
  },
  {
    id: "keyboard-mouse",
    name: "RGB Mechanical Keyboard & Gaming Mouse",
    category: "Accessories",
    price: 4999,
    description: "Hot-swappable mechanical switches with 16,000 DPI ergonomic sensor.",
    symbol: "⌨",
    badge: "ESSENTIALS"
  },
  {
    id: "laptop",
    name: "Pro Gaming & Creator Laptop 15.6\"",
    category: "Laptops",
    price: 78999,
    description: "Intel Core i7, 16GB DDR5, RTX 4050 6GB, 144Hz high refresh display.",
    symbol: "💻",
    badge: "PORTABLE"
  },
  {
    id: "custom-build",
    name: "Custom PC Build (Token / Consultation)",
    category: "Desktops",
    price: 15000,
    description: "Tailored component consultation, personalized quote, and assembly deposit.",
    symbol: "✳",
    badge: "YOUR BUILD"
  }
];

const categories = ["All", ...new Set(products.map(p => p.category))];
let activeCategory = "All";

/* ==============================================================
   STATE MANAGEMENT (Cart, Auth, Orders)
   ============================================================== */
let cart = loadFromStorage("nicks_cart", []);
let currentUser = loadFromStorage("nicks_current_user", null);
let usersDatabase = loadFromStorage("nicks_users", [
  {
    name: "Demo Customer",
    email: "demo@nicks.com",
    phone: "9876543210",
    password: "password123"
  }
]);
let orderHistory = loadFromStorage("nicks_orders", []);

function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Error loading ${key} from storage:`, err);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to storage:`, err);
  }
}

function formatINR(num) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(num);
}

/* ==============================================================
   DOM ELEMENTS
   ============================================================== */
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const emptyState = document.getElementById("emptyState");

// Cart Elements
const cartToggleBtn = document.getElementById("cartToggleBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const cartBody = document.getElementById("cartBody");
const cartBadge = document.getElementById("cartBadge");
const cartHeaderCount = document.getElementById("cartHeaderCount");
const cartCheckoutSection = document.getElementById("cartCheckoutSection");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const btnRazorpayCheckout = document.getElementById("btnRazorpayCheckout");

// Checkout inputs
const checkoutName = document.getElementById("checkoutName");
const checkoutEmail = document.getElementById("checkoutEmail");
const checkoutPhone = document.getElementById("checkoutPhone");
const checkoutAddress = document.getElementById("checkoutAddress");

// Auth Elements
const authWrapper = document.getElementById("authWrapper");
const openAuthBtn = document.getElementById("openAuthBtn");
const authBtnText = document.getElementById("authBtnText");
const userMenu = document.getElementById("userMenu");
const userAvatar = document.getElementById("userAvatar");
const userNameDisplay = document.getElementById("userNameDisplay");
const userEmailDisplay = document.getElementById("userEmailDisplay");
const btnMyOrders = document.getElementById("btnMyOrders");
const btnLogout = document.getElementById("btnLogout");
const navOrdersLink = document.getElementById("navOrdersLink");

// Auth Modal
const authModalOverlay = document.getElementById("authModalOverlay");
const closeAuthModalBtn = document.getElementById("closeAuthModalBtn");
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPhone = document.getElementById("regPhone");
const regPassword = document.getElementById("regPassword");
const btnQuickDemoLogin = document.getElementById("btnQuickDemoLogin");

// Orders Modal
const ordersModalOverlay = document.getElementById("ordersModalOverlay");
const closeOrdersModalBtn = document.getElementById("closeOrdersModalBtn");
const ordersListContainer = document.getElementById("ordersListContainer");

// Order Success Modal
const orderSuccessModalOverlay = document.getElementById("orderSuccessModalOverlay");
const successReceiptDetails = document.getElementById("successReceiptDetails");
const btnSuccessWhatsApp = document.getElementById("btnSuccessWhatsApp");
const btnContinueShopping = document.getElementById("btnContinueShopping");

// Toast
const toastContainer = document.getElementById("toastContainer");

/* ==============================================================
   TOAST NOTIFICATION HELPER
   ============================================================== */
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "success" ? "✓" : type === "error" ? "⚠" : "✦";
  toast.innerHTML = `<span style="font-weight:bold;color:${type === "success" ? "#25d366" : type === "error" ? "#ff5252" : "#b88aff"}">${icon}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3600);
}

/* ==============================================================
   WHATSAPP URL BUILDER
   ============================================================== */
function whatsappUrl(message) {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!digits || digits === "919876543210") {
    return `https://wa.me/?text=${encodeURIComponent(message + "\n\n(Store WhatsApp Number: " + WHATSAPP_NUMBER + ")")}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/* ==============================================================
   PRODUCT CATALOGUE RENDERING
   ============================================================== */
function renderFilters() {
  categoryFilters.replaceChildren();
  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-button${category === activeCategory ? " active" : ""}`;
    button.textContent = category;
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderProducts();
    });
    categoryFilters.appendChild(button);
  });
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = [product.name, product.category, product.description].some(value =>
      value.toLowerCase().includes(query)
    );
    return matchesCategory && matchesSearch;
  });

  productGrid.replaceChildren();
  emptyState.hidden = filtered.length > 0;

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    // Visual thumbnail
    const visual = document.createElement("div");
    visual.className = "product-visual";
    const badge = document.createElement("span");
    badge.className = "product-badge";
    badge.textContent = product.badge;
    const symbol = document.createElement("span");
    symbol.className = "product-symbol";
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = product.symbol;
    visual.append(badge, symbol);

    // Product information
    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("div");
    category.className = "product-category";
    category.textContent = product.category;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatINR(product.price);

    bottom.append(price);

    // Action buttons: Buy Now, Add to Cart, WhatsApp Enquiry
    const actionsBar = document.createElement("div");
    actionsBar.className = "product-actions-bar";

    const primaryBtns = document.createElement("div");
    primaryBtns.className = "product-primary-btns";

    const buyNowBtn = document.createElement("button");
    buyNowBtn.type = "button";
    buyNowBtn.className = "btn-buy-now";
    buyNowBtn.innerHTML = `⚡ Buy Now`;
    buyNowBtn.addEventListener("click", () => {
      quickBuy(product.id);
    });

    const addCartBtn = document.createElement("button");
    addCartBtn.type = "button";
    addCartBtn.className = "btn-add-cart";
    addCartBtn.innerHTML = `+ 🛒`;
    addCartBtn.title = "Add to cart";
    addCartBtn.setAttribute("aria-label", `Add ${product.name} to cart`);
    addCartBtn.addEventListener("click", () => {
      addToCart(product.id);
    });

    primaryBtns.append(buyNowBtn, addCartBtn);

    const waLink = document.createElement("a");
    waLink.className = "btn-wa-enquire";
    waLink.href = whatsappUrl(`Hi Nicks Computers! I'm enquiring about ${product.name} (Price: ${formatINR(product.price)}). Can you share current stock details?`);
    waLink.target = "_blank";
    waLink.rel = "noopener noreferrer";
    waLink.innerHTML = `✆ Enquire on WhatsApp ↗`;

    actionsBar.append(primaryBtns, waLink);

    info.append(category, title, description, bottom, actionsBar);
    card.append(visual, info);
    productGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", renderProducts);

/* ==============================================================
   SHOPPING CART LOGIC
   ============================================================== */
function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalCount;
  cartHeaderCount.textContent = `${totalCount} item(s)`;
  cartBadge.classList.remove("pop");
  void cartBadge.offsetWidth; // re-trigger animation
  cartBadge.classList.add("pop");
}

function addToCart(productId, qty = 1, silent = false) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      symbol: product.symbol,
      qty: qty
    });
  }

  saveToStorage("nicks_cart", cart);
  updateCartBadge();
  renderCart();

  if (!silent) {
    showToast(`Added "${product.name}" to cart!`, "success");
  }
}

function quickBuy(productId) {
  addToCart(productId, 1, true);
  openCartDrawer();
}

function updateCartQty(productId, delta) {
  const index = cart.findIndex(item => item.id === productId);
  if (index === -1) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveToStorage("nicks_cart", cart);
  updateCartBadge();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveToStorage("nicks_cart", cart);
  updateCartBadge();
  renderCart();
  showToast("Item removed from cart.", "info");
}

function clearCart() {
  cart = [];
  saveToStorage("nicks_cart", cart);
  updateCartBadge();
  renderCart();
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  cartBody.replaceChildren();
  const subtotal = getCartSubtotal();
  cartSubtotal.textContent = formatINR(subtotal);
  cartTotal.textContent = formatINR(subtotal);

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty-message">
        <div class="cart-empty-icon">🛒</div>
        <p style="font-weight:600;margin-bottom:6px;">Your cart is empty</p>
        <small style="color:var(--muted)">Explore our catalogue and pick your favorite components.</small>
      </div>
    `;
    cartCheckoutSection.hidden = true;
    btnRazorpayCheckout.disabled = true;
    btnRazorpayCheckout.style.opacity = "0.5";
    btnRazorpayCheckout.style.cursor = "not-allowed";
    return;
  }

  cartCheckoutSection.hidden = false;
  btnRazorpayCheckout.disabled = false;
  btnRazorpayCheckout.style.opacity = "1";
  btnRazorpayCheckout.style.cursor = "pointer";

  // Pre-fill user data if logged in
  if (currentUser) {
    if (!checkoutName.value) checkoutName.value = currentUser.name || "";
    if (!checkoutEmail.value) checkoutEmail.value = currentUser.email || "";
    if (!checkoutPhone.value) checkoutPhone.value = currentUser.phone || "";
  }

  cart.forEach(item => {
    const card = document.createElement("div");
    card.className = "cart-item-card";

    const visual = document.createElement("div");
    visual.className = "cart-item-visual";
    visual.textContent = item.symbol;

    const info = document.createElement("div");
    info.className = "cart-item-info";
    info.innerHTML = `
      <h4>${item.name}</h4>
      <div class="cart-item-price">${formatINR(item.price)}</div>
    `;

    const ctrls = document.createElement("div");
    ctrls.className = "cart-item-ctrls";

    const stepper = document.createElement("div");
    stepper.className = "qty-stepper";

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "qty-btn";
    minusBtn.textContent = "−";
    minusBtn.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
    minusBtn.addEventListener("click", () => updateCartQty(item.id, -1));

    const qtyVal = document.createElement("span");
    qtyVal.className = "qty-value";
    qtyVal.textContent = item.qty;

    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "qty-btn";
    plusBtn.textContent = "+";
    plusBtn.setAttribute("aria-label", `Increase quantity of ${item.name}`);
    plusBtn.addEventListener("click", () => updateCartQty(item.id, 1));

    stepper.append(minusBtn, qtyVal, plusBtn);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn-remove-item";
    removeBtn.textContent = "Remove";
    removeBtn.setAttribute("aria-label", `Remove ${item.name} from cart`);
    removeBtn.addEventListener("click", () => removeFromCart(item.id));

    ctrls.append(stepper, removeBtn);
    card.append(visual, info, ctrls);
    cartBody.appendChild(card);
  });
}

function openCartDrawer() {
  renderCart();
  cartOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartOverlay.hidden = true;
  document.body.style.overflow = "";
}

cartToggleBtn.addEventListener("click", openCartDrawer);
closeCartBtn.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", (e) => {
  if (e.target === cartOverlay) closeCartDrawer();
});

/* ==============================================================
   AUTHENTICATION LOGIC (Login, Register, Logout, Profile)
   ============================================================== */
function updateAuthUI() {
  if (currentUser) {
    authBtnText.textContent = currentUser.name.split(" ")[0];
    userNameDisplay.textContent = currentUser.name;
    userEmailDisplay.textContent = currentUser.email;
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    navOrdersLink.hidden = false;
  } else {
    authBtnText.textContent = "Login";
    navOrdersLink.hidden = true;
    userMenu.hidden = true;
  }
}

function openAuthModal(defaultTab = "login") {
  authModalOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  userMenu.hidden = true;
  if (defaultTab === "register") {
    tabRegister.click();
  } else {
    tabLogin.click();
  }
}

function closeAuthModal() {
  authModalOverlay.hidden = true;
  document.body.style.overflow = "";
}

openAuthBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentUser) {
    userMenu.hidden = !userMenu.hidden;
  } else {
    openAuthModal("login");
  }
});

document.addEventListener("click", (e) => {
  if (!authWrapper.contains(e.target)) {
    userMenu.hidden = true;
  }
});

closeAuthModalBtn.addEventListener("click", closeAuthModal);
authModalOverlay.addEventListener("click", (e) => {
  if (e.target === authModalOverlay) closeAuthModal();
});

// Auth Tabs
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.hidden = false;
  registerForm.hidden = true;
});

tabRegister.addEventListener("click", () => {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  loginForm.hidden = true;
  registerForm.hidden = false;
});

// Password visibility toggles
document.querySelectorAll(".pwd-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "🔒" : "👁";
  });
});

// Login Form Submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;

  const user = usersDatabase.find(u => u.email.toLowerCase() === email && u.password === password);
  if (!user) {
    showToast("Invalid email or password. Please try again.", "error");
    return;
  }

  currentUser = { name: user.name, email: user.email, phone: user.phone };
  saveToStorage("nicks_current_user", currentUser);
  updateAuthUI();
  closeAuthModal();
  showToast(`Welcome back, ${currentUser.name}!`, "success");
  renderCart(); // refresh prefill
});

// Register Form Submit
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = regName.value.trim();
  const email = regEmail.value.trim().toLowerCase();
  const phone = regPhone.value.trim();
  const password = regPassword.value;

  if (usersDatabase.some(u => u.email.toLowerCase() === email)) {
    showToast("An account with this email already exists.", "error");
    return;
  }

  const newUser = { name, email, phone, password };
  usersDatabase.push(newUser);
  saveToStorage("nicks_users", usersDatabase);

  currentUser = { name: newUser.name, email: newUser.email, phone: newUser.phone };
  saveToStorage("nicks_current_user", currentUser);

  updateAuthUI();
  closeAuthModal();
  showToast(`Account created! Welcome, ${name}!`, "success");
  registerForm.reset();
  renderCart();
});

// 1-Click Quick Demo Login
btnQuickDemoLogin.addEventListener("click", () => {
  currentUser = {
    name: "Alex Gamer",
    email: "alex@gamer.com",
    phone: "9876543210"
  };
  saveToStorage("nicks_current_user", currentUser);
  updateAuthUI();
  closeAuthModal();
  showToast("Logged in with Demo Account!", "success");
  renderCart();
});

// Logout
btnLogout.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("nicks_current_user");
  updateAuthUI();
  showToast("Logged out successfully.", "info");
});

/* ==============================================================
   MY ORDERS & INVOICES
   ============================================================== */
function openOrdersModal() {
  userMenu.hidden = true;
  ordersModalOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  renderOrdersModal();
}

function closeOrdersModal() {
  ordersModalOverlay.hidden = true;
  document.body.style.overflow = "";
}

btnMyOrders.addEventListener("click", openOrdersModal);
navOrdersLink.addEventListener("click", openOrdersModal);
closeOrdersModalBtn.addEventListener("click", closeOrdersModal);
ordersModalOverlay.addEventListener("click", (e) => {
  if (e.target === ordersModalOverlay) closeOrdersModal();
});

function renderOrdersModal() {
  ordersListContainer.replaceChildren();

  // Filter orders for current user or show all device orders
  const userOrders = currentUser
    ? orderHistory.filter(o => o.customerEmail === currentUser.email || !o.customerEmail)
    : orderHistory;

  if (userOrders.length === 0) {
    ordersListContainer.innerHTML = `
      <div style="text-align:center;padding:40px 10px;color:var(--muted);">
        <div style="font-size:36px;margin-bottom:10px;">📦</div>
        <p style="font-weight:600;margin-bottom:6px;">No orders found</p>
        <small>You haven't placed any orders yet. Choose your setup and checkout with Razorpay!</small>
      </div>
    `;
    return;
  }

  userOrders.slice().reverse().forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    const top = document.createElement("div");
    top.className = "order-top";
    top.innerHTML = `
      <div>
        <div class="order-id-badge">${order.orderId}</div>
        <div class="order-date">${new Date(order.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <span class="order-status">PAID ✓</span>
    `;

    const snippet = document.createElement("div");
    snippet.className = "order-items-snippet";
    snippet.innerHTML = `
      <div style="font-size:10px;color:#a39eb4;margin-bottom:3px;">
        Payment ID: <code>${order.paymentId}</code>
      </div>
      ${order.items.map(it => `<div>• ${it.name} <b>× ${it.qty}</b> (${formatINR(it.price * it.qty)})</div>`).join("")}
      <div style="font-size:10px;color:#8f8a9e;margin-top:4px;">📍 Ship to: ${order.customerAddress || "Standard Delivery"}</div>
    `;

    const footer = document.createElement("div");
    footer.className = "order-footer";
    const waMsg = `Hi Nicks Computers! Here are my order details:\nOrder ID: ${order.orderId}\nPayment ID: ${order.paymentId}\nTotal Paid: ${formatINR(order.totalAmount)}\nPlease confirm delivery dispatch!`;
    footer.innerHTML = `
      <div class="order-total-paid">Total: ${formatINR(order.totalAmount)}</div>
      <a class="order-wa-btn" href="${whatsappUrl(waMsg)}" target="_blank" rel="noopener noreferrer">
        Track on WhatsApp ↗
      </a>
    `;

    card.append(top, snippet, footer);
    ordersListContainer.appendChild(card);
  });
}

/* ==============================================================
   RAZORPAY PAYMENT GATEWAY INTEGRATION
   ============================================================== */
btnRazorpayCheckout.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  // Validate Contact and Address fields
  const name = checkoutName.value.trim();
  const email = checkoutEmail.value.trim();
  const phone = checkoutPhone.value.trim();
  const address = checkoutAddress.value.trim();

  if (!name || !email || !phone || !address) {
    showToast("Please fill in your Name, Email, Phone, and Delivery Address.", "error");
    if (!name) checkoutName.focus();
    else if (!email) checkoutEmail.focus();
    else if (!phone) checkoutPhone.focus();
    else checkoutAddress.focus();
    return;
  }

  if (phone.replace(/\D/g, "").length < 10) {
    showToast("Please enter a valid 10-digit mobile number.", "error");
    checkoutPhone.focus();
    return;
  }

  const customerData = { name, email, phone, address };
  const totalAmount = getCartSubtotal();
  const orderId = "NICKS-" + Math.floor(100000 + Math.random() * 900000);

  initiateRazorpayPayment({
    orderId,
    totalAmount,
    items: [...cart],
    customer: customerData
  });
});

function initiateRazorpayPayment({ orderId, totalAmount, items, customer }) {
  // Check if Razorpay JS SDK loaded
  if (typeof window.Razorpay === "undefined") {
    console.warn("Razorpay SDK not loaded directly from CDN. Running fallback checkout simulation.");
    simulatePaymentConfirmation({ orderId, totalAmount, items, customer, paymentId: "pay_sim_" + Date.now() });
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(totalAmount * 100), // amount in paise
    currency: "INR",
    name: "Nicks Computers",
    description: `Order ${orderId} (${items.length} items)`,
    image: "https://cdn-icons-png.flaticon.com/512/3067/3067260.png",
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone
    },
    notes: {
      order_id: orderId,
      shipping_address: customer.address
    },
    theme: {
      color: "#9b5cff"
    },
    handler: function (response) {
      // Payment successful callback from Razorpay
      finalizeSuccessfulPayment({
        orderId,
        paymentId: response.razorpay_payment_id || ("pay_" + Math.random().toString(36).substring(2, 12)),
        totalAmount,
        items,
        customer
      });
    },
    modal: {
      ondismiss: function () {
        showToast("Payment window closed.", "info");
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      showToast(`Payment failed: ${response.error.description || "Transaction declined"}`, "error");
    });
    rzp.open();
  } catch (err) {
    console.warn("Error opening Razorpay modal (likely dummy test key):", err);
    // Graceful fallback for test environments
    simulatePaymentConfirmation({ orderId, totalAmount, items, customer, paymentId: "pay_test_" + Math.random().toString(36).substring(2, 10) });
  }
}

// Fallback test checkout handler for instant test validation
function simulatePaymentConfirmation(orderData) {
  const proceed = confirm(
    `[Razorpay Checkout Mode]\n\nPay ${formatINR(orderData.totalAmount)} to Nicks Computers?\n\nClick OK to simulate successful Razorpay Payment & generate order confirmation.`
  );
  if (proceed) {
    finalizeSuccessfulPayment(orderData);
  }
}

function finalizeSuccessfulPayment({ orderId, paymentId, totalAmount, items, customer }) {
  const newOrder = {
    orderId,
    paymentId,
    totalAmount,
    items,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    customerAddress: customer.address,
    date: new Date().toISOString(),
    status: "PAID"
  };

  orderHistory.push(newOrder);
  saveToStorage("nicks_orders", orderHistory);

  // Clear Cart & Close Drawer
  clearCart();
  closeCartDrawer();

  // Show Order Confirmation Receipt Modal
  renderOrderSuccessModal(newOrder);
  showToast("Payment successful! Order confirmed.", "success");
}

function renderOrderSuccessModal(order) {
  successReceiptDetails.innerHTML = `
    <div class="receipt-row">
      <span>Order ID:</span>
      <strong>${order.orderId}</strong>
    </div>
    <div class="receipt-row">
      <span>Razorpay Payment ID:</span>
      <strong style="color:#b88aff;">${order.paymentId}</strong>
    </div>
    <div class="receipt-row">
      <span>Customer Name:</span>
      <strong>${order.customerName}</strong>
    </div>
    <div class="receipt-row">
      <span>Contact / Phone:</span>
      <strong>${order.customerPhone}</strong>
    </div>
    <div class="receipt-row">
      <span>Delivery Address:</span>
      <strong>${order.customerAddress}</strong>
    </div>
    <div class="receipt-row highlight">
      <span>Total Paid:</span>
      <span style="color:#25d366;font-size:16px;">${formatINR(order.totalAmount)}</span>
    </div>
  `;

  const waSummary = `🎉 Hello Nicks Computers! I have completed payment for my order.\n\n` +
    `📦 Order ID: ${order.orderId}\n` +
    `💳 Razorpay Payment ID: ${order.paymentId}\n` +
    `💰 Amount Paid: ${formatINR(order.totalAmount)}\n` +
    `👤 Customer: ${order.customerName} (${order.customerPhone})\n` +
    `📍 Address: ${order.customerAddress}\n\n` +
    `Items:\n` +
    order.items.map(it => `• ${it.name} (Qty: ${it.qty})`).join("\n") +
    `\n\nPlease confirm order receipt & dispatch updates!`;

  btnSuccessWhatsApp.href = whatsappUrl(waSummary);

  orderSuccessModalOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

btnContinueShopping.addEventListener("click", () => {
  orderSuccessModalOverlay.hidden = true;
  document.body.style.overflow = "";
});

orderSuccessModalOverlay.addEventListener("click", (e) => {
  if (e.target === orderSuccessModalOverlay) {
    orderSuccessModalOverlay.hidden = true;
    document.body.style.overflow = "";
  }
});

/* ==============================================================
   GENERAL SITE & NAVIGATION SETUP
   ============================================================== */
const generalMessage = "Hi Nicks Computers! I'd like to enquire about your computer products. Please help me with current prices and availability.";
const contactWhatsAppBtn = document.getElementById("contactWhatsApp");
const floatingWhatsAppBtn = document.getElementById("floatingWhatsApp");

if (contactWhatsAppBtn) contactWhatsAppBtn.href = whatsappUrl(generalMessage);
if (floatingWhatsAppBtn) floatingWhatsAppBtn.href = whatsappUrl(generalMessage);

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Close modals on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!cartOverlay.hidden) closeCartDrawer();
    if (!authModalOverlay.hidden) closeAuthModal();
    if (!ordersModalOverlay.hidden) closeOrdersModal();
    if (!orderSuccessModalOverlay.hidden) {
      orderSuccessModalOverlay.hidden = true;
      document.body.style.overflow = "";
    }
  }
});

/* ==============================================================
   INITIALIZE APP
   ============================================================== */
renderFilters();
renderProducts();
updateAuthUI();
updateCartBadge();
