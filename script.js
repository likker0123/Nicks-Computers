/*
  Nicks Computers website configuration.
  IMPORTANT: Replace WHATSAPP_NUMBER with your WhatsApp number including country code,
  digits only. India example: 919876543210 (do not include +, spaces or hyphens).
*/
const WHATSAPP_NUMBER = "919876543210"; // CHANGE THIS BEFORE PUBLISHING

const products = [
  { id: "gaming-pc", name: "Gaming Desktop PC", category: "Desktops", price: "Ask for price", description: "A powerful setup for gaming and everyday performance.", symbol: "🖥️", badge: "POPULAR" },
  { id: "creator-pc", name: "Creator Workstation", category: "Desktops", price: "Ask for price", description: "Explore a system for editing, design and multitasking.", symbol: "⚙️", badge: "CREATOR PICK" },
  { id: "graphics-card", name: "Graphics Cards", category: "Components", price: "Ask for price", description: "Compare GPU options for your games and applications.", symbol: "▧", badge: "COMPONENTS" },
  { id: "memory-storage", name: "RAM & SSD Storage", category: "Components", price: "Ask for price", description: "Memory and fast storage options for your PC.", symbol: "▤", badge: "UPGRADE" },
  { id: "gaming-monitor", name: "Gaming Monitors", category: "Accessories", price: "Ask for price", description: "Explore displays for immersive play and productivity.", symbol: "▱", badge: "DISPLAY" },
  { id: "keyboard-mouse", name: "Keyboard & Mouse", category: "Accessories", price: "Ask for price", description: "Complete your desk with useful peripherals.", symbol: "⌨", badge: "ESSENTIALS" },
  { id: "laptop", name: "Laptops", category: "Laptops", price: "Ask for price", description: "Find a laptop for work, study, gaming or travel.", symbol: "💻", badge: "PORTABLE" },
  { id: "custom-build", name: "Custom PC Build", category: "Desktops", price: "Request a build", description: "Tell us your budget and we'll discuss suitable parts.", symbol: "✳", badge: "YOUR BUILD" }
];

const categories = ["All", ...new Set(products.map(product => product.category))];
let activeCategory = "All";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const emptyState = document.getElementById("emptyState");

function whatsappUrl(message) {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!digits || digits === "919876543210") {
    return `https://wa.me/?text=${encodeURIComponent(message + "\n\nPlease configure the store WhatsApp number in script.js.")}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function makeWhatsAppLink(message, className, label) {
  const link = document.createElement("a");
  link.className = className;
  link.href = whatsappUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

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
    const matchesSearch = [product.name, product.category, product.description].some(value => value.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  productGrid.replaceChildren();
  emptyState.hidden = filtered.length > 0;

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

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
    price.textContent = product.price;
    const enquiry = makeWhatsAppLink(
      `Hi Nicks Computers! I'm interested in: ${product.name}. Please share current price, availability and specifications.`,
      "enquire-button",
      "Enquire ↗"
    );
    bottom.append(price, enquiry);
    info.append(category, title, description, bottom);
    card.append(visual, info);
    productGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", renderProducts);

const generalMessage = "Hi Nicks Computers! I'd like to enquire about your computer products. Please help me with current prices and availability.";
document.getElementById("contactWhatsApp").href = whatsappUrl(generalMessage);
document.getElementById("floatingWhatsApp").href = whatsappUrl(generalMessage);
document.getElementById("year").textContent = new Date().getFullYear();

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

renderFilters();
renderProducts();
