# Clothing store order management system

- Client: D'fine Apparel Store
- Academic modules: SE2012 (Object-Oriented Analysis and Design) and SE2032 (Database Management Systems)
- Institution: Sri Lanka Institute of Information Technology (SLIIT)
- Term: Year 2, Semester 1, 2026

## Project overview

This project is a web-based order management system built for D'fine, a retail clothing store. The system tracks garment stock across size and color combinations, handles customer checkout and bank payment slip verification, coordinates courier deliveries, and provides customer purchasing analytics for store managers.

## Technology stack

- Backend: Java 21, Spring Boot 3
- Frontend: React (Vite), HTML5, CSS3, JavaScript
- Database: MySQL 8.0
- Build and tools: Apache Maven, Git

## Team members and modules

The project is split into four functional modules:

| Member | Student ID | Module | Responsibilities | Entities |
| :--- | :--- | :--- | :--- | :--- |
| Yapa R. M. J. O. | IT25102762 | Module 1: User management and trend analytics | User authentication, role access control, customer profile, staff accounts, and purchasing analytics | app_user, customer_profile |
| Fernando T. K. D. | IT25101865 | Module 2: Products and inventory management | Product catalog, categories, size and color variants, SKU tracking, restock logs, and product reviews | category, product, product_variant, restock_log, product_review |
| Nimradha G. S. | IT25102773 | Module 3: Order handling and cart management | Shopping cart, stock validation, checkout, order tracking and staff order entry | cart, cart_item, customer_order, order_item |
| Dilmith P. H. S. | IT25102756 | Module 4: Payment and delivery management | Bank transfer slip verification, shipping fee calculation, courier dispatch, invoice generation and status tracking | payment, delivery_shipment, courier_partner, invoice |

## Repository structure

```text
Clothing-Store-OMS/
├── .editorconfig           # Code formatting rules
├── .env.example            # Environment variable template
├── .gitattributes          # Git line ending normalization
├── .gitignore              # Files ignored by Git
├── .prettierrc             # Prettier formatting rules for frontend files
├── .prettierignore         # Prettier ignore list
├── README.md               # Project overview and team assignments
├── docs/                   # Client agreement and assignment briefs
│   ├── academic/
│   │   ├── SE2012_OOAD_Assignment_Rubric.pdf
│   │   └── SE2032_DMS_Assignment_Rubric.pdf
│   └── client/
│       └── Clothing_Store_OMS_Requirements_Agreement_Final.pdf
├── backend/                # Spring Boot application root
├── frontend/               # React storefront and admin root
└── database/               # SQL schema, seeds, and assignment queries
```

## Development steps

1. Database setup: Write the MySQL schema and test data in `database/` using the entities assigned above.
2. Backend: Initialize the Spring Boot project in `backend/` with Web, Data JPA, and MySQL dependencies.
3. Frontend: Initialize the React application in `frontend/` using Vite.
4. Git workflow: Work in feature branches named by module (`feature/mod1-...`, `feature/mod2-...`) and merge into `main` using pull requests.
