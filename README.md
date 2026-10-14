# Tread – Shoe Store (sample project)

A dependency-free e-commerce demo for shoes.

## Structure
```
tread-shoe-store/
├── index.html      page markup
├── css/style.css   styles (light/dark theme)
└── js/
    ├── data.js     product catalogue, sizes, categories
    └── app.js      filters, product modal, cart, checkout
```

## Run
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Features
- Category filter, search, sort
- Product modal with colour and size selection
- Cart drawer (quantity, remove, promo code `STRIDE10` = 10% off)
- Free delivery over ₹5,000, else ₹149
- Checkout form with validation and order confirmation (no real payment)
- Cart saved in localStorage

## Extending
Add products in `js/data.js`. Replace the SVG `shoe()` function in `js/app.js` with real images when you have them.
