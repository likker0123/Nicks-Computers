# Nicks Computers

Responsive static catalogue website built with HTML, CSS and vanilla JavaScript.

## Before publishing
1. Open `script.js`.
2. Replace `WHATSAPP_NUMBER` with your business WhatsApp number in international format, digits only. Example format for India: `919876543210`.
3. Edit the `products` array in `script.js` to add your real product names, categories, prices, descriptions and symbols.
4. Test every WhatsApp link and the mobile menu locally.

## Test locally
Open `index.html` in a browser for a quick visual check. For a more reliable local server, use VS Code with the Live Server extension or run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Deploy to Netlify
1. Sign in to Netlify.
2. Choose **Add new site** → **Deploy manually** (wording may vary).
3. Drag and drop the `nicks-computers` folder or a ZIP containing the files.
4. Open the generated Netlify URL and test it on mobile and desktop.
5. For Git-based automatic deployments, push these files to a GitHub repository, then in Netlify choose **Add new site** → **Import an existing project** and connect that repository. Publish directory: `.`; no build command is required.

## Connect a custom domain
1. Buy/register a domain through a registrar of your choice.
2. In the Netlify site's **Domain management** area, choose **Add a domain** / **Add a domain you own**.
3. Follow the DNS instructions Netlify gives for your exact domain and DNS provider. Do not guess DNS records.
4. Wait for DNS verification and HTTPS certificate provisioning. Keep the Netlify URL working until the custom domain is verified.

## Important
- This is a static catalogue and enquiry site, not a checkout system.
- Product entries are examples; verify stock, prices, warranties and specifications before publishing.
- Do not collect passwords or payment details in frontend code. If you later add checkout, customer accounts, or an admin panel, use a trusted backend/payment provider and verify payments server-side.
