# Best Shop - E-commerce Website

Suitcase e-shop: Multi-page online store.

🔗 **Live Demo:** [https://bilets.github.io/Best-Shop/](https://bilets.github.io/Best-Shop/)

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/bilets/Best-Shop.git
cd Best-Shop
```

2. Install dependencies:

```bash
npm install
```

### Running the Project

Start the development server:

```bash
npm run dev
```

This command will:

- Compile SCSS files to CSS in the `dist/css` folder
- Watch for SCSS changes and recompile automatically
- Launch the development server on `http://localhost:3000`

### Available Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start development server with SCSS watch |
| `npm run compile`   | Compile SCSS to CSS (one-time)           |
| `npm run build`     | Build project for production             |
| `npm run deploy`    | Deploy to GitHub Pages                   |
| `npm run lint`      | Run ESLint and Stylelint                 |
| `npm run lint:js`   | Run ESLint for JavaScript files          |
| `npm run lint:scss` | Run Stylelint for SCSS files             |

### Deployment

To deploy the project to GitHub Pages:

```bash
npm run deploy
```

This will build the project and publish it to the `gh-pages` branch.

## Project Structure

```
src/
├── index.html                 # Homepage
├── html/                      # Other HTML pages
│   ├── about.html             # About Us page
│   ├── cart.html              # Shopping Cart page
│   ├── catalog.html           # Catalog page
│   ├── contact.html           # Contact Us page
│   ├── product-details.html   # Product Details page
│   └── partials/              # Reusable HTML components
│       ├── header.html
│       └── footer.html
├── js/                    # JavaScript modules
│   ├── main.js            # Shared functionality
│   ├── home.js            # Homepage scripts
│   ├── catalog.js         # Catalog page scripts
│   ├── cart.js            # Cart page scripts
│   ├── product.js         # Product details scripts
│   ├── contact.js         # Contact page scripts
│   ├── about.js           # About page scripts
│   ├── productHelpers.js  # Product utility functions
│   └── modalTemplate.js   # Login modal template
├── scss/                  # SCSS stylesheets
│   ├── main.scss          # Main entry point
│   ├── abstracts/         # Variables and mixins
│   ├── base/              # Reset and fonts
│   ├── components/        # Reusable UI components
│   ├── layouts/           # Header and footer
│   └── pages/             # Page-specific styles
└── assets/                # Static assets
    ├── data.json          # Product data
    └── images/            # Images by page
```

## Features

- Responsive design (768px, 1024px, 1440px breakpoints)
- Product catalog with filtering, sorting, and pagination
- Shopping cart with LocalStorage persistence
- Product search functionality
- Login modal with form validation
- Contact form with real-time validation
- 10% discount for orders over $3000

## Technologies

- HTML5 (semantic markup)
- SCSS (with variables, mixins, partials)
- Vanilla JavaScript (ES6 modules)
- LocalStorage for cart persistence
- CSS Flexbox and Grid for layouts

## Browser Support

- Google Chrome (latest)
- Mozilla Firefox (latest)



