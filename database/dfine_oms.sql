CREATE DATABASE IF NOT EXISTS dfine_oms;
USE dfine_oms;

DROP TABLE IF EXISTS delivery_shipment;
DROP TABLE IF EXISTS courier_partner;
DROP TABLE IF EXISTS cash_on_delivery_payment;
DROP TABLE IF EXISTS bank_transfer_payment;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS order_status_history;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS invoice;
DROP TABLE IF EXISTS customer_order;
DROP TABLE IF EXISTS cart_item;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS product_review;
DROP TABLE IF EXISTS restock_log;
DROP TABLE IF EXISTS product_variant;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS user_login_audit;
DROP TABLE IF EXISTS password_reset_token;
DROP TABLE IF EXISTS store_staff;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS app_user;

-- Module 1:

CREATE TABLE app_user (
    user_id INT AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    account_status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_app_user PRIMARY KEY (user_id),
    CONSTRAINT uq_app_user_email UNIQUE (email),
    CONSTRAINT chk_app_user_role CHECK (user_role IN ('CUSTOMER', 'STORE_STAFF', 'MANAGER', 'ADMIN')),
    CONSTRAINT chk_app_user_status CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED'))
);

CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT,
    user_id INT,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    shipping_address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10),
    CONSTRAINT pk_customer PRIMARY KEY (customer_id),
    CONSTRAINT uq_customer_user UNIQUE (user_id),
    CONSTRAINT fk_customer_user FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE SET NULL
);

CREATE TABLE store_staff (
    staff_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    clearance_level VARCHAR(20) NOT NULL,
    CONSTRAINT pk_store_staff PRIMARY KEY (staff_id),
    CONSTRAINT uq_store_staff_user UNIQUE (user_id),
    CONSTRAINT fk_store_staff_user FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    CONSTRAINT chk_store_staff_clearance CHECK (clearance_level IN ('TIER_1', 'TIER_2', 'ADMIN_SUPER'))
);

CREATE TABLE user_login_audit (
    audit_id INT AUTO_INCREMENT,
    user_id INT,
    attempted_email VARCHAR(255),
    ip_address VARCHAR(45) NOT NULL,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    login_status VARCHAR(30) NOT NULL,
    CONSTRAINT pk_user_login_audit PRIMARY KEY (audit_id),
    CONSTRAINT fk_login_audit_user FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE SET NULL,
    CONSTRAINT chk_login_audit_status CHECK (login_status IN ('SUCCESS', 'FAILED_BAD_CREDENTIALS', 'FAILED_LOCKED', 'LOGOUT'))
);

CREATE TABLE password_reset_token (
    reset_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash CHAR(64) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    used_at DATETIME DEFAULT NULL,
    CONSTRAINT pk_password_reset_token PRIMARY KEY (reset_id),
    CONSTRAINT uq_password_reset_token UNIQUE (token_hash),
    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- Module 2

CREATE TABLE category (
    category_id INT AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    category_description TEXT,
    CONSTRAINT pk_category PRIMARY KEY (category_id),
    CONSTRAINT uq_category_name UNIQUE (category_name)
);

CREATE TABLE product (
    product_id INT AUTO_INCREMENT,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    gender_target VARCHAR(20),
    base_price DECIMAL(10,2) NOT NULL,
    main_image_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_product PRIMARY KEY (product_id),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category(category_id),
    CONSTRAINT chk_product_gender CHECK (gender_target IN ('MEN', 'WOMEN', 'UNISEX')),
    CONSTRAINT chk_product_base_price CHECK (base_price >= 0)
);

CREATE TABLE product_variant (
    variant_id INT AUTO_INCREMENT,
    product_id INT NOT NULL,
    sku VARCHAR(50) NOT NULL,
    -- size is a reserved keyword in mySQL
    size_label VARCHAR(10) NOT NULL,
    color VARCHAR(30) NOT NULL,
    stock_quantity INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    variant_image_url VARCHAR(255),
    -- Optimistic locking to prevent race conditions during concurrent checkouts
    -- increases version counter by +1 everytime the row changes
    lock_version INT DEFAULT 0,
    CONSTRAINT pk_product_variant PRIMARY KEY (variant_id),
    CONSTRAINT uq_variant_sku UNIQUE (sku),
    CONSTRAINT uq_variant_combination UNIQUE (product_id, size_label, color),
    CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    CONSTRAINT chk_variant_stock CHECK (stock_quantity >= 0),
    CONSTRAINT chk_variant_threshold CHECK (low_stock_threshold >= 0)
);

CREATE TABLE restock_log (
    restock_id INT AUTO_INCREMENT,
    variant_id INT NOT NULL,
    received_by_staff_id INT NOT NULL,
    quantity_added INT NOT NULL,
    restocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    CONSTRAINT pk_restock_log PRIMARY KEY (restock_id),
    CONSTRAINT fk_restock_variant FOREIGN KEY (variant_id) REFERENCES product_variant(variant_id),
    CONSTRAINT fk_restock_staff FOREIGN KEY (received_by_staff_id) REFERENCES store_staff(staff_id),
    CONSTRAINT chk_restock_quantity CHECK (quantity_added > 0)
);

CREATE TABLE product_review (
    review_id INT AUTO_INCREMENT,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,
    rating SMALLINT NOT NULL,
    review_comment TEXT,
    -- review will be automatically approved if conditions met
    is_approved BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_product_review PRIMARY KEY (review_id),
    CONSTRAINT uq_review_product_customer UNIQUE (product_id, customer_id),
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_review_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5)
);

-- Module 3

CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT,
    customer_id INT,
    guest_token VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_cart PRIMARY KEY (cart_id),
    CONSTRAINT uq_cart_guest_token UNIQUE (guest_token),
    CONSTRAINT fk_cart_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    CONSTRAINT chk_cart_owner CHECK (customer_id IS NOT NULL OR guest_token IS NOT NULL)
);

CREATE TABLE cart_item (
    cart_item_id INT AUTO_INCREMENT,
    cart_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    custom_image_url VARCHAR(255),
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_cart_item PRIMARY KEY (cart_item_id),
    CONSTRAINT uq_cart_item_unique UNIQUE (cart_id, variant_id),
    CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_item_variant FOREIGN KEY (variant_id) REFERENCES product_variant(variant_id) ON DELETE CASCADE,
    CONSTRAINT chk_cart_item_quantity CHECK (quantity > 0)
);

CREATE TABLE customer_order (
    order_id INT AUTO_INCREMENT,
    order_number VARCHAR(30) NOT NULL,
    customer_id INT NOT NULL,
    assisted_by_staff_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    order_source VARCHAR(30) NOT NULL,
    order_status VARCHAR(30) DEFAULT 'PENDING',
    subtotal_amount DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) DEFAULT 0.00,
    total_payable DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    -- snapshots are preserved for historical audit integrity / to store "ghost" account orders
    shipping_address_snapshot TEXT NOT NULL,
    shipping_district_snapshot VARCHAR(50) NOT NULL,
    shipping_province_snapshot VARCHAR(50) NOT NULL,
    CONSTRAINT pk_customer_order PRIMARY KEY (order_id),
    CONSTRAINT uq_customer_order_number UNIQUE (order_number),
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    CONSTRAINT fk_order_staff FOREIGN KEY (assisted_by_staff_id) REFERENCES store_staff(staff_id) ON DELETE SET NULL,
    CONSTRAINT chk_order_source CHECK (order_source IN ('WEB_STOREFRONT', 'IN_STORE_POS', 'PHONE_ORDER')),
    CONSTRAINT chk_order_status CHECK (order_status IN ('PENDING', 'AWAITING_PAYMENT_VERIFICATION', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED', 'REFUNDED')),
    CONSTRAINT chk_order_subtotal CHECK (subtotal_amount >= 0),
    CONSTRAINT chk_order_shipping_fee CHECK (shipping_fee >= 0),
    CONSTRAINT chk_order_total CHECK (total_payable >= 0),
    CONSTRAINT chk_order_total_balance CHECK (total_payable = subtotal_amount + shipping_fee)
);

CREATE TABLE order_item (
    order_item_id INT AUTO_INCREMENT,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    custom_image_url VARCHAR(255),
    custom_print_notes VARCHAR(200),
    CONSTRAINT pk_order_item PRIMARY KEY (order_item_id),
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES customer_order(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_variant FOREIGN KEY (variant_id) REFERENCES product_variant(variant_id),
    CONSTRAINT chk_order_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_item_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_order_item_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_order_item_subtotal_calc CHECK (subtotal = quantity * unit_price)
);

CREATE TABLE order_status_history (
    history_id INT AUTO_INCREMENT,
    order_id INT NOT NULL,
    changed_by_user_id INT,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    CONSTRAINT pk_order_status_history PRIMARY KEY (history_id),
    CONSTRAINT fk_history_order FOREIGN KEY (order_id) REFERENCES customer_order(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (changed_by_user_id) REFERENCES app_user(user_id) ON DELETE SET NULL,
    CONSTRAINT chk_history_status CHECK (new_status IN ('PENDING', 'AWAITING_PAYMENT_VERIFICATION', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED', 'REFUNDED'))
);

-- Module 4

CREATE TABLE invoice (
    invoice_id INT AUTO_INCREMENT,
    order_id INT NOT NULL,
    invoice_number VARCHAR(50) NOT NULL,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    pdf_storage_path VARCHAR(255) NOT NULL,
    CONSTRAINT pk_invoice PRIMARY KEY (invoice_id),
    CONSTRAINT uq_invoice_order UNIQUE (order_id),
    CONSTRAINT uq_invoice_number UNIQUE (invoice_number),
    CONSTRAINT fk_invoice_order FOREIGN KEY (order_id) REFERENCES customer_order(order_id)
);

CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_payment PRIMARY KEY (payment_id),
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES customer_order(order_id),
    CONSTRAINT chk_payment_amount CHECK (amount >= 0),
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('BANK_TRANSFER', 'CASH_ON_DELIVERY')),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('PENDING', 'VERIFIED', 'FAILED', 'REJECTED', 'REFUNDED'))
);

CREATE TABLE bank_transfer_payment (
    payment_id INT,
    verified_by_staff_id INT,
    bank_name VARCHAR(100) NOT NULL,
    deposit_reference VARCHAR(100),
    slip_image_url VARCHAR(255) NOT NULL,
    rejection_reason TEXT,
    verified_at DATETIME,
    CONSTRAINT pk_bank_transfer_payment PRIMARY KEY (payment_id),
    CONSTRAINT fk_bank_transfer_payment FOREIGN KEY (payment_id) REFERENCES payment(payment_id) ON DELETE CASCADE,
    CONSTRAINT fk_bank_transfer_staff FOREIGN KEY (verified_by_staff_id) REFERENCES store_staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE cash_on_delivery_payment (
    payment_id INT,
    cash_collection_status VARCHAR(20) DEFAULT 'UNCOLLECTED',
    collected_amount DECIMAL(10,2),
    courier_remittance_date DATETIME,
    CONSTRAINT pk_cash_on_delivery_payment PRIMARY KEY (payment_id),
    CONSTRAINT fk_cash_on_delivery_payment FOREIGN KEY (payment_id) REFERENCES payment(payment_id) ON DELETE CASCADE,
    CONSTRAINT chk_cod_collection_status CHECK (cash_collection_status IN ('UNCOLLECTED', 'COLLECTED_BY_COURIER', 'REMITTED_TO_STORE')),
    CONSTRAINT chk_cod_collected_amount CHECK (collected_amount IS NULL OR collected_amount >= 0)
);

CREATE TABLE courier_partner (
    courier_id INT AUTO_INCREMENT,
    courier_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    tracking_api_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT pk_courier_partner PRIMARY KEY (courier_id),
    CONSTRAINT uq_courier_partner_name UNIQUE (courier_name)
);

CREATE TABLE delivery_shipment (
    delivery_id INT AUTO_INCREMENT,
    order_id INT NOT NULL,
    courier_id INT NOT NULL,
    tracking_number VARCHAR(100) NOT NULL,
    courier_charge DECIMAL(10,2) NOT NULL,
    delivery_status VARCHAR(30) DEFAULT 'PENDING',
    current_location VARCHAR(255),
    dispatched_at DATETIME,
    delivered_at DATETIME,
    CONSTRAINT pk_delivery_shipment PRIMARY KEY (delivery_id),
    CONSTRAINT uq_delivery_order UNIQUE (order_id),
    CONSTRAINT uq_delivery_tracking UNIQUE (tracking_number),
    CONSTRAINT fk_delivery_order FOREIGN KEY (order_id) REFERENCES customer_order(order_id),
    CONSTRAINT fk_delivery_courier FOREIGN KEY (courier_id) REFERENCES courier_partner(courier_id),
    CONSTRAINT chk_delivery_charge CHECK (courier_charge >= 0),
    CONSTRAINT chk_delivery_status CHECK (delivery_status IN ('PENDING', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED', 'FAILED')),
    CONSTRAINT chk_shipment_timeline CHECK (delivered_at IS NULL OR dispatched_at IS NULL OR delivered_at >= dispatched_at)
);
