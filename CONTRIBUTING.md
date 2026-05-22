# Contributing to E-Commerce Project

Thank you for your interest in contributing! This guide will help you set up your environment and follow best practices.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Branching Strategy](#branching-strategy)
3. [Coding Standards](#coding-standards)
4. [Testing](#testing)
5. [Pull Request Guidelines](#pull-request-guidelines)
6. [Environment Setup](#environment-setup)
7. [Database Setup](#database-setup)
8. [Frontend Guidelines](#frontend-guidelines)

---

## Getting Started

1. Fork the repository.
2. Clone your fork:
```
git clone https://github.com/<your-username>/E-commerce.git
```
```
cd E-commerce
```

3. Install backend dependencies:
```
cd backend
npm install
```

4. Install frontend dependencies:
```
cd ../frontend
npm install
```

---

## Branching Strategy

- ```main``` → production-ready
- ```develop``` → latest development
- Feature branches → ```feature/<feature-name>```
- Fix branches → ```fix/<issue-number>```

---

## Coding Standards
- Use ES6+ syntax for JS.
- All API responses must have this structure:

```
{
  "success": true,
  "message": "Descriptive message",
  "data": {}
}
```

- Always handle null/undefined values in frontend.
- Use utils.js helpers for notifications, API calls, and localStorage.

---

## Testing
- Backend: test endpoints using Postman.
- Frontend: test forms, cart, checkout, orders, wishlist, and profile.
- Ensure all features work both logged-in and logged-out.

---

## Pull Request Guidelines
1. PR must be from a feature/fix branch to develop.
2. Include screenshots if UI changes.
3. Reference the related issue in PR description.
4. Ensure no console errors or warnings in browser.
5. Code must pass linter checks.

---

## Environment Setup
1. Copy ```.env.example``` to ```.env```:
```cp backend/.env.example backend/.env```
2. Fill in the required values:
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- JWT_SECRET
- PORT (default: 5000)
- FRONTEND_URL (default: http://localhost:3000)

---

## Database Setup
1. Create a MySQL database.
2. Run the schema script:
```
cd backend
mysql -u <DB_USER> -p < DB_NAME < schema.sql
```
3. Ensure tables: users, products, orders, order_items exist.

---

## Frontend Guidelines
- Use ```utils.js``` for:
 - Notifications: ```notify(message, type)```
 - Safe localStorage: ```getJSON(key)``` / ```setJSON(key, value)```
 - API calls: ```apiRequest(url, options)```
 - Price formatting: ```formatPrice(price)```
- Always check for element existence before updating the DOM.
- Use fallback values for product info (name, image, price) to prevent crashes.

---

## Thank you for contributing! 🎉

---