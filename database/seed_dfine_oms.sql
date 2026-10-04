-- D-FINE OMS DATABASE POPULATION SCRIPT

USE dfine_oms;

-- Disable foreign key checks for safe, idempotent re-runs
SET FOREIGN_KEY_CHECKS = 0;

-- Clean existing data in reverse-dependency order
TRUNCATE TABLE delivery_shipment;
TRUNCATE TABLE courier_partner;
TRUNCATE TABLE cash_on_delivery_payment;
TRUNCATE TABLE bank_transfer_payment;
TRUNCATE TABLE payment;
TRUNCATE TABLE order_status_history;
TRUNCATE TABLE order_item;
TRUNCATE TABLE invoice;
TRUNCATE TABLE customer_order;
TRUNCATE TABLE cart_item;
TRUNCATE TABLE cart;
TRUNCATE TABLE product_review;
TRUNCATE TABLE restock_log;
TRUNCATE TABLE product_variant;
TRUNCATE TABLE product;
TRUNCATE TABLE category;
TRUNCATE TABLE user_login_audit;
TRUNCATE TABLE password_reset_token;
TRUNCATE TABLE store_staff;
TRUNCATE TABLE customer;
TRUNCATE TABLE app_user;

SET FOREIGN_KEY_CHECKS = 1;

START TRANSACTION;

-- 1. APP USERS
-- Password hash corresponds to 'Password123!' (standard bcrypt hash)

INSERT INTO app_user (email, password_hash, user_role, account_status, created_at) VALUES
('admin@dfine.store', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ACTIVE', '2026-08-01 08:00:00'),
('chaminda.mgr@dfine.store', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MANAGER', 'ACTIVE', '2026-08-01 08:30:00'),
('kasun.perera@dfine.store', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STORE_STAFF', 'ACTIVE', '2026-08-05 09:00:00'),
('nethmi.fernando@dfine.store', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STORE_STAFF', 'ACTIVE', '2026-08-05 09:15:00'),
('dilshan.silva@dfine.store', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STORE_STAFF', 'ACTIVE', '2026-08-10 10:00:00'),
('kavindu.bandara@gmail.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'ACTIVE', '2026-08-15 14:20:00'),
('sachini.jayawardena@yahoo.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'ACTIVE', '2026-08-18 16:45:00'),
('akila.wickramasinghe@outlook.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'ACTIVE', '2026-08-20 11:10:00'),
('tharushi.de.silva@gmail.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'ACTIVE', '2026-08-25 18:00:00'),
('roshan.gunasekara@hotmail.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'ACTIVE', '2026-09-01 09:30:00'),
('malik.farook@gmail.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'SUSPENDED', '2026-09-05 13:15:00'),
('nadeesha.fernando@gmail.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'DEACTIVATED', '2026-09-08 17:50:00');

-- 2. CUSTOMER PROFILES

INSERT INTO customer (user_id, email, first_name, last_name, contact_number, shipping_address, city, district, province, postal_code) VALUES
((SELECT user_id FROM app_user WHERE email = 'kavindu.bandara@gmail.com'), 'kavindu.bandara@gmail.com', 'Kavindu', 'Bandara', '+94771234567', 'No. 45/2, Temple Road, Havelock Town', 'Colombo 05', 'Colombo', 'Western', '00500'),
((SELECT user_id FROM app_user WHERE email = 'sachini.jayawardena@yahoo.com'), 'sachini.jayawardena@yahoo.com', 'Sachini', 'Jayawardena', '+94718899001', '124/B, Peradeniya Road', 'Kandy', 'Kandy', 'Central', '20000'),
((SELECT user_id FROM app_user WHERE email = 'akila.wickramasinghe@outlook.com'), 'akila.wickramasinghe@outlook.com', 'Akila', 'Wickramasinghe', '+94762345678', '88, Beach Road, Weligama', 'Weligama', 'Matara', 'Southern', '81700'),
((SELECT user_id FROM app_user WHERE email = 'tharushi.de.silva@gmail.com'), 'tharushi.de.silva@gmail.com', 'Tharushi', 'De Silva', '+94703344556', '15, Circular Road', 'Kurunegala', 'Kurunegala', 'North Western', '60000'),
((SELECT user_id FROM app_user WHERE email = 'roshan.gunasekara@hotmail.com'), 'roshan.gunasekara@hotmail.com', 'Roshan', 'Gunasekara', '+94785566778', '32/1, Station Road', 'Wattala', 'Gampaha', 'Western', '11300'),
((SELECT user_id FROM app_user WHERE email = 'malik.farook@gmail.com'), 'malik.farook@gmail.com', 'Malik', 'Farook', '+94779988776', '73, Ward Place', 'Colombo 07', 'Colombo', 'Western', '00700'),
((SELECT user_id FROM app_user WHERE email = 'nadeesha.fernando@gmail.com'), 'nadeesha.fernando@gmail.com', 'Nadeesha', 'Fernando', '+94712233445', '18, Galle Road, Mount Lavinia', 'Dehiwala-Mount Lavinia', 'Colombo', 'Western', '10370');

-- 3. STORE STAFF

INSERT INTO store_staff (user_id, first_name, last_name, designation, clearance_level) VALUES
((SELECT user_id FROM app_user WHERE email = 'chaminda.mgr@dfine.store'), 'Chaminda', 'Senanayake', 'Store General Manager', 'ADMIN_SUPER'),
((SELECT user_id FROM app_user WHERE email = 'kasun.perera@dfine.store'), 'Kasun', 'Perera', 'Warehouse & Inventory Supervisor', 'TIER_2'),
((SELECT user_id FROM app_user WHERE email = 'nethmi.fernando@dfine.store'), 'Nethmi', 'Fernando', 'Fulfillment & Payment Verification Officer', 'TIER_2'),
((SELECT user_id FROM app_user WHERE email = 'dilshan.silva@dfine.store'), 'Dilshan', 'Silva', 'Retail POS Cashier', 'TIER_1');

-- 4. USER LOGIN AUDIT (Security & Session Monitoring)

INSERT INTO user_login_audit (user_id, attempted_email, ip_address, login_time, login_status) VALUES
((SELECT user_id FROM app_user WHERE email = 'admin@dfine.store'), 'admin@dfine.store', '192.168.1.10', '2026-10-01 08:30:00', 'SUCCESS'),
((SELECT user_id FROM app_user WHERE email = 'kasun.perera@dfine.store'), 'kasun.perera@dfine.store', '192.168.1.15', '2026-10-01 08:45:00', 'SUCCESS'),
((SELECT user_id FROM app_user WHERE email = 'kavindu.bandara@gmail.com'), 'kavindu.bandara@gmail.com', '124.43.98.12', '2026-10-01 14:10:00', 'SUCCESS'),
((SELECT user_id FROM app_user WHERE email = 'sachini.jayawardena@yahoo.com'), 'sachini.jayawardena@yahoo.com', '112.134.55.201', '2026-10-02 09:15:00', 'SUCCESS'),
(NULL, 'admin@dfine.store', '45.154.255.80', '2026-10-02 02:11:00', 'FAILED_BAD_CREDENTIALS'),
(NULL, 'root@dfine.store', '45.154.255.80', '2026-10-02 02:11:45', 'FAILED_BAD_CREDENTIALS'),
((SELECT user_id FROM app_user WHERE email = 'malik.farook@gmail.com'), 'malik.farook@gmail.com', '203.94.10.5', '2026-10-02 18:22:00', 'FAILED_LOCKED'),
((SELECT user_id FROM app_user WHERE email = 'dilshan.silva@dfine.store'), 'dilshan.silva@dfine.store', '192.168.1.20', '2026-10-02 17:05:00', 'LOGOUT');

-- 4b. PASSWORD RESET TOKENS (SHA-256 Hashed Tokens & Lifecycle Scenarios)

-- Scenarios: Active valid token, Used token (consumed), Expired token
INSERT INTO password_reset_token (user_id, token_hash, created_at, expires_at, used_at) VALUES
-- 1. Fresh active token for Kavindu (valid for 15 mins, unused)
((SELECT user_id FROM app_user WHERE email = 'kavindu.bandara@gmail.com'),
 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
 '2026-10-04 10:00:00', '2026-10-04 10:15:00', NULL),

-- 2. Used token for Sachini (consumed successfully 5 mins after generation)
((SELECT user_id FROM app_user WHERE email = 'sachini.jayawardena@yahoo.com'),
 '8799c30f40d89753443a9ccad3cf4cf42ab1d072e293046f4b679b362fb7ec4c',
 '2026-10-04 14:00:00', '2026-10-04 14:15:00', '2026-10-04 14:05:00'),

-- 3. Expired unused token for Roshan (requested days ago, timed out)
((SELECT user_id FROM app_user WHERE email = 'roshan.gunasekara@hotmail.com'),
 '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
 '2026-10-03 08:00:00', '2026-10-03 08:15:00', NULL);

-- 5. CATEGORIES

INSERT INTO category (category_name, category_description) VALUES
('Graphic Tees', 'Premium 240GSM heavyweight combed cotton streetwear graphic tees'),
('Hoodies & Sweatshirts', 'Brushed interior fleece oversized and regular-fit hoodies for daily streetwear'),
('Polos & Casual Shirts', 'Smart casual 100% Pima cotton knit polos and relaxed summer shirts'),
('Streetwear Bottoms', 'Multi-pocket utility cargo pants, sweatpants, and tailored joggers'),
('Custom Print Merchandise', 'Direct-to-garment (DTG) blank canvas apparel and custom printed accessories');

-- 6. PRODUCTS

INSERT INTO product (category_id, product_name, product_description, gender_target, base_price, main_image_url, is_active, created_at) VALUES
((SELECT category_id FROM category WHERE category_name = 'Graphic Tees'), 'Tokyo Drift Oversized Tee', 'Signature drop-shoulder streetwear graphic t-shirt with high-density screen print.', 'UNISEX', 4200.00, 'https://cdn.dfine.store/products/tees/tokyo_drift_front.jpg', TRUE, '2026-08-10 10:00:00'),
((SELECT category_id FROM category WHERE category_name = 'Graphic Tees'), 'Minimalist Signature Heavy Tee', 'Clean puff print branding on 260GSM organic heavyweight cotton.', 'MEN', 3800.00, 'https://cdn.dfine.store/products/tees/minimal_signature_front.jpg', TRUE, '2026-08-12 11:30:00'),
((SELECT category_id FROM category WHERE category_name = 'Hoodies & Sweatshirts'), 'Acid Wash Cyberpunk Hoodie', 'Heavy vintage acid-wash fleece hoodie with cyberpunk typography embroidery.', 'UNISEX', 7500.00, 'https://cdn.dfine.store/products/hoodies/cyberpunk_acid_wash.jpg', TRUE, '2026-08-15 14:00:00'),
((SELECT category_id FROM category WHERE category_name = 'Hoodies & Sweatshirts'), 'Essential Fleece Pullover Hoodie', 'Ultra-soft fleece hoodie featuring kangaroo pocket and ribbed cuffs.', 'WOMEN', 6800.00, 'https://cdn.dfine.store/products/hoodies/essential_fleece_pastel.jpg', TRUE, '2026-08-18 15:20:00'),
((SELECT category_id FROM category WHERE category_name = 'Polos & Casual Shirts'), 'Classic Pima Cotton Slim Polo', 'Mercerized Pima cotton knit polo with genuine mother-of-pearl buttons.', 'MEN', 4800.00, 'https://cdn.dfine.store/products/polos/pima_classic_navy.jpg', TRUE, '2026-08-20 09:00:00'),
((SELECT category_id FROM category WHERE category_name = 'Streetwear Bottoms'), 'Utility Multi-Pocket Cargo Pants', 'Durable ripstop cotton cargo pants with 6 utility pockets and drawstring ankles.', 'MEN', 5900.00, 'https://cdn.dfine.store/products/bottoms/utility_cargo_khaki.jpg', TRUE, '2026-08-22 13:40:00'),
((SELECT category_id FROM category WHERE category_name = 'Custom Print Merchandise'), 'Custom DTG Print Blank Tee', 'Heavyweight blank t-shirt optimized for custom direct-to-garment digital artwork.', 'UNISEX', 3200.00, 'https://cdn.dfine.store/products/custom/custom_dtg_blank_tee.jpg', TRUE, '2026-08-25 10:15:00'),
((SELECT category_id FROM category WHERE category_name = 'Custom Print Merchandise'), 'Custom Canvas Tote Bag', 'Eco-friendly 14oz reinforced canvas tote bag for custom prints or embroidery.', 'UNISEX', 2200.00, 'https://cdn.dfine.store/products/custom/custom_canvas_tote.jpg', TRUE, '2026-08-25 11:00:00');

-- 7. PRODUCT VARIANTS (SKUs, Sizing, Colors, Inventory States)

-- Features: Healthy stock, Low-stock alerts (<= 5), Out-of-stock (0)
INSERT INTO product_variant (product_id, sku, size_label, color, stock_quantity, low_stock_threshold, variant_image_url, lock_version) VALUES
-- Tokyo Drift Oversized Tee
((SELECT product_id FROM product WHERE product_name = 'Tokyo Drift Oversized Tee'), 'TEE-TKO-BLK-M', 'M', 'Black', 35, 5, 'https://cdn.dfine.store/variants/tee_tko_blk.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Tokyo Drift Oversized Tee'), 'TEE-TKO-BLK-L', 'L', 'Black', 4, 5, 'https://cdn.dfine.store/variants/tee_tko_blk.jpg', 1), -- Low stock alert
((SELECT product_id FROM product WHERE product_name = 'Tokyo Drift Oversized Tee'), 'TEE-TKO-BLK-XXL', 'XXL', 'Black', 12, 5, 'https://cdn.dfine.store/variants/tee_tko_blk.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Tokyo Drift Oversized Tee'), 'TEE-TKO-WHT-M', 'M', 'White', 20, 5, 'https://cdn.dfine.store/variants/tee_tko_wht.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Tokyo Drift Oversized Tee'), 'TEE-TKO-WHT-L', 'L', 'White', 0, 5, 'https://cdn.dfine.store/variants/tee_tko_wht.jpg', 1), -- Out of stock

-- Minimalist Signature Heavy Tee
((SELECT product_id FROM product WHERE product_name = 'Minimalist Signature Heavy Tee'), 'TEE-SIG-GRY-M', 'M', 'Slate Grey', 25, 5, 'https://cdn.dfine.store/variants/tee_sig_gry.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Minimalist Signature Heavy Tee'), 'TEE-SIG-GRY-L', 'L', 'Slate Grey', 18, 5, 'https://cdn.dfine.store/variants/tee_sig_gry.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Minimalist Signature Heavy Tee'), 'TEE-SIG-GRN-L', 'L', 'Forest Green', 2, 5, 'https://cdn.dfine.store/variants/tee_sig_grn.jpg', 1), -- Low stock alert

-- Acid Wash Cyberpunk Hoodie
((SELECT product_id FROM product WHERE product_name = 'Acid Wash Cyberpunk Hoodie'), 'HUD-CYB-CHR-M', 'M', 'Charcoal Wash', 15, 5, 'https://cdn.dfine.store/variants/hud_cyb_chr.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Acid Wash Cyberpunk Hoodie'), 'HUD-CYB-CHR-L', 'L', 'Charcoal Wash', 10, 5, 'https://cdn.dfine.store/variants/hud_cyb_chr.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Acid Wash Cyberpunk Hoodie'), 'HUD-CYB-CHR-XL', 'XL', 'Charcoal Wash', 3, 5, 'https://cdn.dfine.store/variants/hud_cyb_chr.jpg', 1),

-- Essential Fleece Pullover Hoodie
((SELECT product_id FROM product WHERE product_name = 'Essential Fleece Pullover Hoodie'), 'HUD-ESS-PNK-S', 'S', 'Pastel Pink', 14, 5, 'https://cdn.dfine.store/variants/hud_ess_pnk.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Essential Fleece Pullover Hoodie'), 'HUD-ESS-PNK-M', 'M', 'Pastel Pink', 22, 5, 'https://cdn.dfine.store/variants/hud_ess_pnk.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Essential Fleece Pullover Hoodie'), 'HUD-ESS-BGE-M', 'M', 'Sand Beige', 16, 5, 'https://cdn.dfine.store/variants/hud_ess_bge.jpg', 1),

-- Classic Pima Cotton Slim Polo
((SELECT product_id FROM product WHERE product_name = 'Classic Pima Cotton Slim Polo'), 'POLO-PMA-NVY-M', 'M', 'Navy Blue', 30, 5, 'https://cdn.dfine.store/variants/polo_pma_nvy.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Classic Pima Cotton Slim Polo'), 'POLO-PMA-NVY-L', 'L', 'Navy Blue', 25, 5, 'https://cdn.dfine.store/variants/polo_pma_nvy.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Classic Pima Cotton Slim Polo'), 'POLO-PMA-MRN-L', 'L', 'Burgundy', 12, 5, 'https://cdn.dfine.store/variants/polo_pma_mrn.jpg', 1),

-- Utility Multi-Pocket Cargo Pants
((SELECT product_id FROM product WHERE product_name = 'Utility Multi-Pocket Cargo Pants'), 'CRG-UTL-KHK-M', 'M', 'Desert Khaki', 18, 5, 'https://cdn.dfine.store/variants/crg_utl_khk.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Utility Multi-Pocket Cargo Pants'), 'CRG-UTL-KHK-L', 'L', 'Desert Khaki', 14, 5, 'https://cdn.dfine.store/variants/crg_utl_khk.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Utility Multi-Pocket Cargo Pants'), 'CRG-UTL-BLK-L', 'L', 'Stealth Black', 0, 5, 'https://cdn.dfine.store/variants/crg_utl_blk.jpg', 1), -- Out of stock

-- Custom DTG Print Blank Tee
((SELECT product_id FROM product WHERE product_name = 'Custom DTG Print Blank Tee'), 'CST-TEE-WHT-M', 'M', 'Pure White', 50, 10, 'https://cdn.dfine.store/variants/cst_tee_wht.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Custom DTG Print Blank Tee'), 'CST-TEE-WHT-L', 'L', 'Pure White', 45, 10, 'https://cdn.dfine.store/variants/cst_tee_wht.jpg', 1),
((SELECT product_id FROM product WHERE product_name = 'Custom DTG Print Blank Tee'), 'CST-TEE-BLK-L', 'L', 'Pitch Black', 40, 10, 'https://cdn.dfine.store/variants/cst_tee_blk.jpg', 1),

-- Custom Canvas Tote Bag
((SELECT product_id FROM product WHERE product_name = 'Custom Canvas Tote Bag'), 'CST-TOT-CRM-STD', 'ONE_SIZE', 'Natural Cream', 60, 10, 'https://cdn.dfine.store/variants/cst_tot_crm.jpg', 1);

-- 8. RESTOCK LOGS (Warehouse Intake Batch History)

INSERT INTO restock_log (variant_id, received_by_staff_id, quantity_added, restocked_at, notes) VALUES
((SELECT variant_id FROM product_variant WHERE sku = 'TEE-TKO-BLK-M'), (SELECT staff_id FROM store_staff WHERE user_id = (SELECT user_id FROM app_user WHERE email = 'kasun.perera@dfine.store')), 50, '2026-09-01 10:00:00', 'Supplier shipment batch #DF-2026-Q3 received in pristine condition.'),
((SELECT variant_id FROM product_variant WHERE sku = 'HUD-CYB-CHR-M'), (SELECT staff_id FROM store_staff WHERE user_id = (SELECT user_id FROM app_user WHERE email = 'kasun.perera@dfine.store')), 25, '2026-09-10 14:30:00', 'Pre-season winter fleece batch intake.'),
((SELECT variant_id FROM product_variant WHERE sku = 'CST-TEE-WHT-M'), (SELECT staff_id FROM store_staff WHERE user_id = (SELECT user_id FROM app_user WHERE email = 'chaminda.mgr@dfine.store')), 100, '2026-09-15 09:15:00', 'Direct mill shipment from Biyagama textile facility.');

-- 9. PRODUCT REVIEWS & MODERATION

-- Scenarios: Verified glowing reviews, sizing tips, delivery feedback, and 1 unapproved spam comment
INSERT INTO product_review (product_id, customer_id, rating, review_comment, is_approved, created_at) VALUES
((SELECT product_id FROM product WHERE product_name = 'Tokyo Drift Oversized Tee'), (SELECT customer_id FROM customer WHERE email = 'kavindu.bandara@gmail.com'), 5, 'Top-tier heavyweight cotton! The print has stayed sharp after multiple washes. Fits oversized just as described.', TRUE, '2026-09-28 10:30:00'),
((SELECT product_id FROM product WHERE product_name = 'Tokyo Drift Oversized Tee'), (SELECT customer_id FROM customer WHERE email = 'malik.farook@gmail.com'), 4, 'Great oversized fit and thick collar ribbing that does not sag after washing. Print vibrancy is top notch.', TRUE, '2026-09-30 14:20:00'),
((SELECT product_id FROM product WHERE product_name = 'Tokyo Drift Oversized Tee'), (SELECT customer_id FROM customer WHERE email = 'nadeesha.fernando@gmail.com'), 5, 'Love the drop-shoulder streetwear cut! Fabric is super breathable for Colombo weather. Highly recommended.', TRUE, '2026-10-01 16:45:00'),
((SELECT product_id FROM product WHERE product_name = 'Acid Wash Cyberpunk Hoodie'), (SELECT customer_id FROM customer WHERE email = 'sachini.jayawardena@yahoo.com'), 5, 'Extremely warm and the vintage wash looks even better in person. Express delivery to Kandy was prompt!', TRUE, '2026-09-29 11:15:00'),
((SELECT product_id FROM product WHERE product_name = 'Classic Pima Cotton Slim Polo'), (SELECT customer_id FROM customer WHERE email = 'akila.wickramasinghe@outlook.com'), 4, 'Very soft material and luxurious texture. Note that the sleeves fit slightly snug, consider sizing up.', TRUE, '2026-10-02 12:00:00'),
((SELECT product_id FROM product WHERE product_name = 'Utility Multi-Pocket Cargo Pants'), (SELECT customer_id FROM customer WHERE email = 'tharushi.de.silva@gmail.com'), 3, 'Pants are sturdy and well constructed, but courier delivery took 4 days to reach Kurunegala.', TRUE, '2026-10-02 15:00:00'),
((SELECT product_id FROM product WHERE product_name = 'Custom DTG Print Blank Tee'), (SELECT customer_id FROM customer WHERE email = 'roshan.gunasekara@hotmail.com'), 1, 'Spam test review with unverified external links: http://promo-deal-fake.com', FALSE, '2026-10-03 09:00:00'); -- Unapproved review for moderation

-- 10. SHOPPING CARTS & ITEMS

-- Scenarios: Active customer carts + Abandoned guest cart with custom print upload
INSERT INTO cart (customer_id, guest_token, created_at, updated_at) VALUES
((SELECT customer_id FROM customer WHERE email = 'akila.wickramasinghe@outlook.com'), NULL, '2026-10-03 10:00:00', '2026-10-03 10:30:00'),
((SELECT customer_id FROM customer WHERE email = 'tharushi.de.silva@gmail.com'), NULL, '2026-10-03 11:15:00', '2026-10-03 11:20:00'),
(NULL, 'gst_sess_89f02c11e7ba48b9a2', '2026-10-03 12:00:00', '2026-10-03 12:05:00'); -- Guest session cart

INSERT INTO cart_item (cart_id, variant_id, quantity, custom_image_url, added_at) VALUES
-- Akila's active cart
((SELECT cart_id FROM cart WHERE customer_id = (SELECT customer_id FROM customer WHERE email = 'akila.wickramasinghe@outlook.com')),
 (SELECT variant_id FROM product_variant WHERE sku = 'TEE-TKO-BLK-M'), 1, NULL, '2026-10-03 10:05:00'),

((SELECT cart_id FROM cart WHERE customer_id = (SELECT customer_id FROM customer WHERE email = 'akila.wickramasinghe@outlook.com')),
 (SELECT variant_id FROM product_variant WHERE sku = 'POLO-PMA-MRN-L'), 2, NULL, '2026-10-03 10:30:00'),

-- Tharushi's active cart
((SELECT cart_id FROM cart WHERE customer_id = (SELECT customer_id FROM customer WHERE email = 'tharushi.de.silva@gmail.com')),
 (SELECT variant_id FROM product_variant WHERE sku = 'HUD-ESS-BGE-M'), 1, NULL, '2026-10-03 11:20:00'),

-- Abandoned guest cart with custom graphic upload
((SELECT cart_id FROM cart WHERE guest_token = 'gst_sess_89f02c11e7ba48b9a2'),
 (SELECT variant_id FROM product_variant WHERE sku = 'CST-TEE-WHT-L'), 2, 'https://cdn.dfine.store/uploads/temp/guest_custom_skull_art.png', '2026-10-03 12:05:00');

-- 11. COURIER PARTNERS

INSERT INTO courier_partner (courier_name, contact_number, tracking_api_url, is_active) VALUES
('Domex Express', '+94117704704', 'https://domex.lk/tracking?ref=', TRUE),
('Pronto Logistics', '+94112575575', 'https://prontolk.com/track/', TRUE),
('Prompt Xpress', '+94114767767', 'https://promptxpress.lk/track/', TRUE),
('Fardar Express', '+94112699999', 'https://fardarexpress.com/track/', TRUE);

-- 12. CUSTOMER ORDERS (Covering all 7 statuses, multiple channels, & calculations)

INSERT INTO customer_order (
    order_number, customer_id, assisted_by_staff_id, order_date, order_source, order_status,
    subtotal_amount, shipping_fee, total_payable, customer_name, customer_email, customer_phone,
    shipping_address_snapshot, shipping_district_snapshot, shipping_province_snapshot
) VALUES
-- Order 1: Completed Web Order (Cash On Delivery)
('ORD-2026-1001',
 (SELECT customer_id FROM customer WHERE email = 'kavindu.bandara@gmail.com'),
 NULL,
 '2026-09-25 10:15:00',
 'WEB_STOREFRONT',
 'DELIVERED',
 8400.00, 350.00, 8750.00,
 'Kavindu Bandara', 'kavindu.bandara@gmail.com', '+94771234567',
 'No. 45/2, Temple Road, Havelock Town, Colombo 05', 'Colombo', 'Western'),

-- Order 2: Custom Print Order (Bank Transfer Verified, in Production Queue)
('ORD-2026-1002',
 (SELECT customer_id FROM customer WHERE email = 'sachini.jayawardena@yahoo.com'),
 NULL,
 '2026-10-01 14:20:00',
 'WEB_STOREFRONT',
 'PROCESSING',
 10700.00, 450.00, 11150.00,
 'Sachini Jayawardena', 'sachini.jayawardena@yahoo.com', '+94718899001',
 '124/B, Peradeniya Road, Kandy', 'Kandy', 'Central'),

-- Order 3: In-Store POS Retail Checkout (Assisted by Cashier Dilshan Silva)
('ORD-2026-1003',
 (SELECT customer_id FROM customer WHERE email = 'akila.wickramasinghe@outlook.com'),
 (SELECT staff_id FROM store_staff WHERE user_id = (SELECT user_id FROM app_user WHERE email = 'dilshan.silva@dfine.store')),
 '2026-10-02 11:30:00',
 'IN_STORE_POS',
 'DELIVERED',
 10700.00, 0.00, 10700.00,
 'Akila Wickramasinghe', 'akila.wickramasinghe@outlook.com', '+94762345678',
 'Store POS Counter, Flagship Retail Store, Colombo 03', 'Colombo', 'Western'),

-- Order 4: Bank Transfer Slip Rejected (Amount Mismatch / Blurry Slip)
('ORD-2026-1004',
 (SELECT customer_id FROM customer WHERE email = 'tharushi.de.silva@gmail.com'),
 NULL,
 '2026-10-02 16:40:00',
 'WEB_STOREFRONT',
 'AWAITING_PAYMENT_VERIFICATION',
 6800.00, 400.00, 7200.00,
 'Tharushi De Silva', 'tharushi.de.silva@gmail.com', '+94703344556',
 '15, Circular Road, Kurunegala', 'Kurunegala', 'North Western'),

-- Order 5: Phone Order In-Transit via Pronto Logistics (Assisted by Staff Nethmi)
('ORD-2026-1005',
 (SELECT customer_id FROM customer WHERE email = 'roshan.gunasekara@hotmail.com'),
 (SELECT staff_id FROM store_staff WHERE user_id = (SELECT user_id FROM app_user WHERE email = 'nethmi.fernando@dfine.store')),
 '2026-10-01 10:00:00',
 'PHONE_ORDER',
 'DISPATCHED',
 8400.00, 350.00, 8750.00,
 'Roshan Gunasekara', 'roshan.gunasekara@hotmail.com', '+94785566778',
 '32/1, Station Road, Wattala', 'Gampaha', 'Western'),

-- Order 6: Courier Return to Origin (RTO) & Fully Refunded
('ORD-2026-1006',
 (SELECT customer_id FROM customer WHERE email = 'malik.farook@gmail.com'),
 NULL,
 '2026-09-20 13:00:00',
 'WEB_STOREFRONT',
 'REFUNDED',
 5900.00, 400.00, 6300.00,
 'Malik Farook', 'malik.farook@gmail.com', '+94779988776',
 '73, Ward Place, Colombo 07', 'Colombo', 'Western'),

-- Order 7: Brand New Web Order (Awaiting Customer Payment Upload)
('ORD-2026-1007',
 (SELECT customer_id FROM customer WHERE email = 'sachini.jayawardena@yahoo.com'),
 NULL,
 '2026-10-03 14:00:00',
 'WEB_STOREFRONT',
 'PENDING',
 4200.00, 350.00, 4550.00,
 'Sachini Jayawardena', 'sachini.jayawardena@yahoo.com', '+94718899001',
 '124/B, Peradeniya Road, Kandy', 'Kandy', 'Central');

-- 13. ORDER ITEMS (Line Items, Unit Prices, Custom Prints)

INSERT INTO order_item (order_id, variant_id, quantity, unit_price, subtotal, custom_image_url, custom_print_notes) VALUES
-- Items for Order 1 (ORD-2026-1001: 2x Tokyo Drift Black M)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1001'),
 (SELECT variant_id FROM product_variant WHERE sku = 'TEE-TKO-BLK-M'),
 2, 4200.00, 8400.00, NULL, NULL),

-- Items for Order 2 (ORD-2026-1002: 1x Cyberpunk Hoodie Charcoal M + 1x Custom DTG Tee with print)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1002'),
 (SELECT variant_id FROM product_variant WHERE sku = 'HUD-CYB-CHR-M'),
 1, 7500.00, 7500.00, NULL, NULL),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1002'),
 (SELECT variant_id FROM product_variant WHERE sku = 'CST-TEE-WHT-M'),
 1, 3200.00, 3200.00, 'https://cdn.dfine.store/uploads/custom/sachini_cyber_art.png', 'Front chest A3 graphic print, neon glow vibrancy'),

-- Items for Order 3 (ORD-2026-1003: 1x Pima Polo Navy L + 1x Cargo Pants Khaki M)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1003'),
 (SELECT variant_id FROM product_variant WHERE sku = 'POLO-PMA-NVY-L'),
 1, 4800.00, 4800.00, NULL, NULL),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1003'),
 (SELECT variant_id FROM product_variant WHERE sku = 'CRG-UTL-KHK-M'),
 1, 5900.00, 5900.00, NULL, NULL),

-- Items for Order 4 (ORD-2026-1004: 1x Essential Fleece Hoodie Pink M)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1004'),
 (SELECT variant_id FROM product_variant WHERE sku = 'HUD-ESS-PNK-M'),
 1, 6800.00, 6800.00, NULL, NULL),

-- Items for Order 5 (ORD-2026-1005: 2x Tokyo Drift Black M)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1005'),
 (SELECT variant_id FROM product_variant WHERE sku = 'TEE-TKO-BLK-M'),
 2, 4200.00, 8400.00, NULL, NULL),

-- Items for Order 6 (ORD-2026-1006: 1x Cargo Pants Khaki L)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'),
 (SELECT variant_id FROM product_variant WHERE sku = 'CRG-UTL-KHK-L'),
 1, 5900.00, 5900.00, NULL, NULL),

-- Items for Order 7 (ORD-2026-1007: 1x Tokyo Drift Black XXL)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1007'),
 (SELECT variant_id FROM product_variant WHERE sku = 'TEE-TKO-BLK-XXL'),
 1, 4200.00, 4200.00, NULL, NULL);

-- 14. INVOICES

-- Issued for confirmed/dispatched/delivered/refunded orders

INSERT INTO invoice (order_id, invoice_number, issued_at, pdf_storage_path) VALUES
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1001'), 'INV-2026-0001', '2026-09-25 11:30:00', '/storage/invoices/2026/09/INV-2026-0001.pdf'),
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1002'), 'INV-2026-0002', '2026-10-01 16:00:00', '/storage/invoices/2026/10/INV-2026-0002.pdf'),
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1003'), 'INV-2026-0003', '2026-10-02 11:32:00', '/storage/invoices/2026/10/INV-2026-0003.pdf'),
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1005'), 'INV-2026-0004', '2026-10-01 10:30:00', '/storage/invoices/2026/10/INV-2026-0004.pdf'),
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'), 'INV-2026-0005', '2026-09-20 14:00:00', '/storage/invoices/2026/09/INV-2026-0005.pdf');

-- 15. ORDER STATUS HISTORY (Complete Audit Trails)

INSERT INTO order_status_history (order_id, changed_by_user_id, previous_status, new_status, changed_at, notes) VALUES
-- Order 1 progression
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1001'),
 (SELECT user_id FROM app_user WHERE email = 'kavindu.bandara@gmail.com'),
 NULL, 'PENDING', '2026-09-25 10:15:00', 'Order placed via online storefront checkout.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1001'),
 (SELECT user_id FROM app_user WHERE email = 'kasun.perera@dfine.store'),
 'PENDING', 'PROCESSING', '2026-09-25 11:30:00', 'Automated sales verification passed; order sent to warehouse picker.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1001'),
 (SELECT user_id FROM app_user WHERE email = 'kasun.perera@dfine.store'),
 'PROCESSING', 'DISPATCHED', '2026-09-26 09:00:00', 'Package handed over to Domex Express dispatch courier.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1001'),
 NULL,
 'DISPATCHED', 'DELIVERED', '2026-09-27 15:45:00', 'Delivery confirmation received from Domex courier tracking API.'),

-- Order 2 progression (Custom DTG)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1002'),
 (SELECT user_id FROM app_user WHERE email = 'sachini.jayawardena@yahoo.com'),
 NULL, 'PENDING', '2026-10-01 14:20:00', 'Order placed, awaiting customer bank transfer slip.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1002'),
 (SELECT user_id FROM app_user WHERE email = 'sachini.jayawardena@yahoo.com'),
 'PENDING', 'AWAITING_PAYMENT_VERIFICATION', '2026-10-01 15:10:00', 'Customer uploaded Commercial Bank deposit slip.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1002'),
 (SELECT user_id FROM app_user WHERE email = 'nethmi.fernando@dfine.store'),
 'AWAITING_PAYMENT_VERIFICATION', 'PROCESSING', '2026-10-01 16:00:00', 'Bank transfer slip verified against statement; order released to DTG print queue.'),

-- Order 3 progression (POS)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1003'),
 (SELECT user_id FROM app_user WHERE email = 'dilshan.silva@dfine.store'),
 NULL, 'PROCESSING', '2026-10-02 11:30:00', 'POS Terminal sale initiated by cashier Dilshan.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1003'),
 (SELECT user_id FROM app_user WHERE email = 'dilshan.silva@dfine.store'),
 'PROCESSING', 'DELIVERED', '2026-10-02 11:32:00', 'Cash collected at register and goods handed to customer over counter.'),

-- Order 4 progression (Rejected slip)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1004'),
 (SELECT user_id FROM app_user WHERE email = 'tharushi.de.silva@gmail.com'),
 NULL, 'PENDING', '2026-10-02 16:40:00', 'Order placed on web storefront.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1004'),
 (SELECT user_id FROM app_user WHERE email = 'tharushi.de.silva@gmail.com'),
 'PENDING', 'AWAITING_PAYMENT_VERIFICATION', '2026-10-02 17:05:00', 'Customer uploaded deposit slip image.'),

-- Order 5 progression (Phone Order Dispatched)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1005'),
 (SELECT user_id FROM app_user WHERE email = 'nethmi.fernando@dfine.store'),
 NULL, 'PENDING', '2026-10-01 10:00:00', 'Telephone order initiated by staff Nethmi on customer request.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1005'),
 (SELECT user_id FROM app_user WHERE email = 'nethmi.fernando@dfine.store'),
 'PENDING', 'PROCESSING', '2026-10-01 10:30:00', 'Customer confirmed phone order via SMS OTP validation.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1005'),
 (SELECT user_id FROM app_user WHERE email = 'kasun.perera@dfine.store'),
 'PROCESSING', 'DISPATCHED', '2026-10-02 08:30:00', 'Handed over to Pronto Logistics courier.'),

-- Order 6 progression (Courier Return & Refund)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'),
 (SELECT user_id FROM app_user WHERE email = 'malik.farook@gmail.com'),
 NULL, 'PENDING', '2026-09-20 13:00:00', 'Web order placed.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'),
 (SELECT user_id FROM app_user WHERE email = 'malik.farook@gmail.com'),
 'PENDING', 'AWAITING_PAYMENT_VERIFICATION', '2026-09-20 13:30:00', 'Customer uploaded online bank payment confirmation.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'),
 (SELECT user_id FROM app_user WHERE email = 'chaminda.mgr@dfine.store'),
 'AWAITING_PAYMENT_VERIFICATION', 'PROCESSING', '2026-09-20 14:00:00', 'Payment verified by Chaminda.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'),
 (SELECT user_id FROM app_user WHERE email = 'kasun.perera@dfine.store'),
 'PROCESSING', 'DISPATCHED', '2026-09-21 09:00:00', 'Dispatched with Prompt Xpress.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'),
 (SELECT user_id FROM app_user WHERE email = 'chaminda.mgr@dfine.store'),
 'DISPATCHED', 'CANCELLED', '2026-09-24 16:00:00', 'Courier failed 3 delivery attempts; recipient unreachable; parcel returned to store.'),

((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'),
 (SELECT user_id FROM app_user WHERE email = 'chaminda.mgr@dfine.store'),
 'CANCELLED', 'REFUNDED', '2026-09-25 11:00:00', 'Full refund of LKR 6,300.00 remitted back to customer bank account.');

-- 16. PAYMENTS (Parent polymorphic payment records)

INSERT INTO payment (order_id, amount, payment_method, payment_status, created_at) VALUES
-- Payment 1: For Order 1 (COD, Verified/Collected)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1001'), 8750.00, 'CASH_ON_DELIVERY', 'VERIFIED', '2026-09-25 10:15:00'),

-- Payment 2: For Order 2 (Bank Transfer, Verified)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1002'), 11150.00, 'BANK_TRANSFER', 'VERIFIED', '2026-10-01 14:20:00'),

-- Payment 3: For Order 3 (POS Cash, Verified)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1003'), 10700.00, 'CASH_ON_DELIVERY', 'VERIFIED', '2026-10-02 11:30:00'),

-- Payment 4: For Order 4 (Bank Transfer, Rejected)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1004'), 7200.00, 'BANK_TRANSFER', 'REJECTED', '2026-10-02 16:40:00'),

-- Payment 5: For Order 5 (COD, Pending Collection)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1005'), 8750.00, 'CASH_ON_DELIVERY', 'PENDING', '2026-10-01 10:00:00'),

-- Payment 6: For Order 6 (Bank Transfer, Refunded)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'), 6300.00, 'BANK_TRANSFER', 'REFUNDED', '2026-09-20 13:00:00'),

-- Payment 7: For Order 7 (Bank Transfer, Pending)
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1007'), 4550.00, 'BANK_TRANSFER', 'PENDING', '2026-10-03 14:00:00');

-- 17. BANK TRANSFER PAYMENTS (Subtype details)

INSERT INTO bank_transfer_payment (payment_id, verified_by_staff_id, bank_name, deposit_reference, slip_image_url, rejection_reason, verified_at) VALUES
-- Order 2: Verified bank deposit
((SELECT payment_id FROM payment WHERE order_id = (SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1002')),
 (SELECT staff_id FROM store_staff WHERE user_id = (SELECT user_id FROM app_user WHERE email = 'nethmi.fernando@dfine.store')),
 'Commercial Bank of Ceylon',
 'COMB-TXN-9948210',
 'https://cdn.dfine.store/slips/2026-10/slip_ord_1002.jpg',
 NULL,
 '2026-10-01 16:00:00'),

-- Order 4: Rejected deposit slip (Amount mismatch / blurry image)
((SELECT payment_id FROM payment WHERE order_id = (SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1004')),
 (SELECT staff_id FROM store_staff WHERE user_id = (SELECT user_id FROM app_user WHERE email = 'nethmi.fernando@dfine.store')),
 'Sampath Bank PLC',
 'SMP-REF-332190',
 'https://cdn.dfine.store/slips/2026-10/slip_ord_1004_blurry.jpg',
 'Deposit slip shows LKR 5,000.00 instead of required total LKR 7,200.00; image is blurry and transaction date is cut off.',
 '2026-10-02 17:30:00'),

-- Order 6: Refunded bank transfer
((SELECT payment_id FROM payment WHERE order_id = (SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006')),
 (SELECT staff_id FROM store_staff WHERE user_id = (SELECT user_id FROM app_user WHERE email = 'chaminda.mgr@dfine.store')),
 'Hatton National Bank',
 'HNB-ONLINE-881203',
 'https://cdn.dfine.store/slips/2026-09/slip_ord_1006.jpg',
 NULL,
 '2026-09-20 14:00:00'),

-- Order 7: Pending slip upload
((SELECT payment_id FROM payment WHERE order_id = (SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1007')),
 NULL,
 'Bank of Ceylon',
 NULL,
 'https://cdn.dfine.store/slips/placeholder_pending.png',
 NULL,
 NULL);

-- 18. CASH ON DELIVERY PAYMENTS (Subtype details)

INSERT INTO cash_on_delivery_payment (payment_id, cash_collection_status, collected_amount, courier_remittance_date) VALUES
-- Order 1: Delivered and courier remitted payment to store
((SELECT payment_id FROM payment WHERE order_id = (SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1001')),
 'REMITTED_TO_STORE', 8750.00, '2026-09-29 10:00:00'),

-- Order 3: In-Store POS register collection
((SELECT payment_id FROM payment WHERE order_id = (SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1003')),
 'REMITTED_TO_STORE', 10700.00, '2026-10-02 11:30:00'),

-- Order 5: Dispatched in-transit; uncollected cash
((SELECT payment_id FROM payment WHERE order_id = (SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1005')),
 'UNCOLLECTED', NULL, NULL);

-- 19. DELIVERY SHIPMENTS (Logistics, tracking and delivery lifecycle)

INSERT INTO delivery_shipment (
    order_id, courier_id, tracking_number, courier_charge, delivery_status, current_location, dispatched_at, delivered_at
) VALUES
-- Order 1: Successfully delivered via Domex Express
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1001'),
 (SELECT courier_id FROM courier_partner WHERE courier_name = 'Domex Express'),
 'DMX-902144-LK', 350.00, 'DELIVERED', 'Delivered - Signed by K. Bandara', '2026-09-26 09:00:00', '2026-09-27 15:45:00'),

-- Order 5: Currently in-transit via Pronto Logistics
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1005'),
 (SELECT courier_id FROM courier_partner WHERE courier_name = 'Pronto Logistics'),
 'PRN-773120-LK', 350.00, 'IN_TRANSIT', 'Gampaha Regional Sorting Hub', '2026-10-02 08:30:00', NULL),

-- Order 6: Returned to Sender (RTO) via Prompt Xpress
((SELECT order_id FROM customer_order WHERE order_number = 'ORD-2026-1006'),
 (SELECT courier_id FROM courier_partner WHERE courier_name = 'Prompt Xpress'),
 'PX-449102-LK', 400.00, 'RETURNED', 'D-Fine Warehouse Central (Returned)', '2026-09-21 09:00:00', NULL);

COMMIT;

-- VERIFICATION QUERY SUMMARY

SELECT 'Data population complete! Summary of records:' AS status;
SELECT 'app_user' AS tbl, COUNT(*) AS count FROM app_user
UNION ALL SELECT 'customer', COUNT(*) FROM customer
UNION ALL SELECT 'store_staff', COUNT(*) FROM store_staff
UNION ALL SELECT 'user_login_audit', COUNT(*) FROM user_login_audit
UNION ALL SELECT 'password_reset_token', COUNT(*) FROM password_reset_token
UNION ALL SELECT 'category', COUNT(*) FROM category
UNION ALL SELECT 'product', COUNT(*) FROM product
UNION ALL SELECT 'product_variant', COUNT(*) FROM product_variant
UNION ALL SELECT 'restock_log', COUNT(*) FROM restock_log
UNION ALL SELECT 'product_review', COUNT(*) FROM product_review
UNION ALL SELECT 'cart', COUNT(*) FROM cart
UNION ALL SELECT 'cart_item', COUNT(*) FROM cart_item
UNION ALL SELECT 'customer_order', COUNT(*) FROM customer_order
UNION ALL SELECT 'order_item', COUNT(*) FROM order_item
UNION ALL SELECT 'invoice', COUNT(*) FROM invoice
UNION ALL SELECT 'order_status_history', COUNT(*) FROM order_status_history
UNION ALL SELECT 'payment', COUNT(*) FROM payment
UNION ALL SELECT 'bank_transfer_payment', COUNT(*) FROM bank_transfer_payment
UNION ALL SELECT 'cash_on_delivery_payment', COUNT(*) FROM cash_on_delivery_payment
UNION ALL SELECT 'courier_partner', COUNT(*) FROM courier_partner
UNION ALL SELECT 'delivery_shipment', COUNT(*) FROM delivery_shipment;
