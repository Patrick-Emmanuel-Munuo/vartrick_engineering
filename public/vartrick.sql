-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
-- Host: localhost    Database: vartrick
-- ------------------------------------------------------
-- Server version	8.0.33  
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- =========================
-- Table: users
-- =========================
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `user_name` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(500) NOT NULL,
  `role_id` INT(11) DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone_number` VARCHAR(29) NOT NULL,
  `status` VARCHAR(29) NOT NULL DEFAULT 'active',
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gender` VARCHAR(10) NOT NULL,
  `created_by` INT(11) DEFAULT NULL,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT(11) DEFAULT NULL,
  `designation` VARCHAR(100) DEFAULT NULL,
  `department_id` INT(11) DEFAULT NULL,
  `image` VARCHAR(100) DEFAULT NULL,
  `phone_verify` TINYINT(1) NOT NULL DEFAULT 0,
  `email_verify` TINYINT(1) NOT NULL DEFAULT 0,
  `otp_code` VARCHAR(100) DEFAULT NULL,
  `address` VARCHAR(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- Table: roles
-- =========================
CREATE TABLE `roles` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `permissions` TEXT NOT NULL,
  `comment` TEXT DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `created_by` INT(11) DEFAULT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT(11) DEFAULT NULL,
  `updated_date` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- Table: login_history
-- =========================
CREATE TABLE `login_history` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `ip_address` VARCHAR(100) NOT NULL,
  `login_device` VARCHAR(200) NOT NULL,
  `browser_name` VARCHAR(100) NOT NULL,
  `browser_version` VARCHAR(100) NOT NULL,
  `host` VARCHAR(200) NOT NULL,
  `time_zone` VARCHAR(100) NOT NULL,
  `created_by` INT(11) DEFAULT NULL,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT(11) DEFAULT NULL,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_login_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- Table: product
-- =========================
CREATE TABLE `product` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(200) DEFAULT NULL,
  `product_code` VARCHAR(29) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'active',
  `location` VARCHAR(150) DEFAULT NULL,
  `unit_of_measure` VARCHAR(20) DEFAULT NULL,
  `available` FLOAT(12,3) DEFAULT 0.000,
  `buying_price` FLOAT(12,3) DEFAULT 0.000,
  `selling_price` FLOAT(12,3) DEFAULT 0.000,
  `tax` FLOAT(12,3) DEFAULT 0.000,
  `profit_rate` FLOAT(12,3) DEFAULT 0.000,
  `discount` FLOAT(5,3) DEFAULT 0.000 COMMENT 'Discount percentage with 3 decimals, max 100.000%',
  `created_by` INT(11) DEFAULT NULL,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT(11) DEFAULT NULL,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `product` 
(`product_name`, `description`, `product_code`, `status`, `location`, `unit_of_measure`, `available`, `buying_price`, `selling_price`, `tax`, `profit_rate`, `discount`, `created_by`) 
VALUES
('Electric Motor', 'High efficiency electric motor', 'EM-001', 'active', 'Warehouse A', 'pcs', 50.000, 150.500, 200.750, 18.000, 25.000, 5.000, 15),
('LED Bulb 12W', 'Energy saving LED bulb', 'LB-012', 'active', 'Warehouse B', 'pcs', 200.000, 2.500, 3.750, 18.000, 50.000, 0.000, 15),
('Copper Wire 1mm', 'High quality copper wire', 'CW-001', 'active', 'Warehouse C', 'meters', 1000.000, 0.800, 1.200, 18.000, 50.000, 0.000, 15),
('Circuit Breaker 10A', 'Single pole circuit breaker', 'CB-010', 'active', 'Warehouse A', 'pcs', 150.000, 5.500, 8.250, 18.000, 33.000, 2.500, 15),
('Fuse 5A', 'Fast acting fuse', 'F-005', 'active', 'Warehouse B', 'pcs', 500.000, 0.300, 0.450, 18.000, 50.000, 0.000, 15);

-- =========================
-- Table: selling_product
-- =========================
CREATE TABLE `selling_product` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  
  -- Customer info
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(29) DEFAULT NULL,
  `customer_email` VARCHAR(100) DEFAULT NULL,
  `customer_address` VARCHAR(200) DEFAULT NULL,
  
  -- Invoice info
  `invoice_number` VARCHAR(50) NOT NULL,
  `bill_amount` FLOAT(12,3) NOT NULL DEFAULT 0.000,
  `tax_rate` FLOAT(12,3) DEFAULT 0.000,
  `tax` FLOAT(12,3) DEFAULT 0.000,
  `items` JSON DEFAULT NULL, 
  `invoice_amount` FLOAT(12,3) DEFAULT 0.000,
  `invoice_printed` TINYINT(1) DEFAULT 0,
  `invoice_printed_by` INT(11) DEFAULT NULL,
  `invoice_printed_date` DATETIME DEFAULT NULL,
  `invoice_pdf` VARCHAR(255) DEFAULT NULL,
  
  -- Payment info
  `payment_method` VARCHAR(50) DEFAULT NULL,
  `payment_comment` VARCHAR(500) DEFAULT NULL,
  `payment_approval` TINYINT(1) DEFAULT 0,
  `payment_approval_date` DATETIME DEFAULT NULL,
  `payment_approval_by` INT(11) DEFAULT NULL,
  `paid_amount` FLOAT(12,3) DEFAULT 0.000,
  `balance` FLOAT(12,3) DEFAULT 0.000,
  
  -- Delivery info
  `delivery_method` VARCHAR(50) DEFAULT NULL,
  `delivery` TINYINT(1) DEFAULT 0,
  `delivery_by` INT(11) DEFAULT NULL,
  
  -- Status & audit
  `status` VARCHAR(20) DEFAULT 'pending',
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT(11) DEFAULT NULL,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT(11) DEFAULT NULL,
  `deleted` TINYINT(1) DEFAULT 0,

  PRIMARY KEY (`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`invoice_printed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`payment_approval_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `selling_product` 
(`customer_name`, `customer_phone`, `customer_email`, `customer_address`, `invoice_number`, `bill_amount`, `tax_rate`, `tax`, `items`, `invoice_amount`, `invoice_printed`, `invoice_pdf`, `payment_method`, `payment_comment`, `payment_approval`, `paid_amount`, `balance`, `status`, `created_by`)
VALUES
(
 'John Doe', '+255712345678', 'john@example.com', 'Moshi Town', 'INV-001', 
 500.000, 18.000, 90.000, 
 '[{"product_id":1,"name":"Electric Motor","qty":2,"unit_price":200.375,"total":400.750},{"product_id":2,"name":"LED Bulb 12W","qty":25,"unit_price":3.750,"total":93.750}]',
 590.500, 0, '/invoices/INV-001.pdf', 'Cash', 'Paid in full', 1, 590.500, 0.000, 'completed', 15
),
(
 'Jane Smith', '+255798765432', 'jane@example.com', 'Dar es Salaam', 'INV-002', 
 250.000, 18.000, 45.000, 
 '[{"product_id":3,"name":"Copper Wire 1mm","qty":100,"unit_price":1.200,"total":120.000},{"product_id":5,"name":"Fuse 5A","qty":100,"unit_price":0.450,"total":45.000}]',
 295.000, 1, '/invoices/INV-002.pdf', 'Mpesa', 'Partial payment', 0, 150.000, 145.000, 'pending', 15
),
(
 'Michael Lee', '+255761234567', 'michael@example.com', 'Dodoma', 'INV-003', 
 300.000, 18.000, 54.000, 
 '[{"product_id":4,"name":"Circuit Breaker 10A","qty":10,"unit_price":8.250,"total":82.500},{"product_id":2,"name":"LED Bulb 12W","qty":10,"unit_price":3.750,"total":37.500}]',
 391.500, 0, '/invoices/INV-003.pdf', 'Bank Transfer', 'Paid full via bank', 1, 391.500, 0.000, 'completed', 15
);



-- =========================
-- Table: messages
-- =========================
CREATE TABLE `messages` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `sender_id` INT(11) NOT NULL,
  `receiver_id` INT(11) NOT NULL,
  `text` VARCHAR(1000) NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `respond_id` INT(11) DEFAULT NULL,
  `status` VARCHAR(30) DEFAULT 'sent',
  `description` VARCHAR(100) DEFAULT NULL,
  `delivery` TINYINT(1) DEFAULT 0,
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- =========================
-- Table: settings
-- =========================
CREATE TABLE `settings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `campny_name` VARCHAR(200) NOT NULL,
  `active_year` INT(4) NOT NULL,
  `location` VARCHAR(300) DEFAULT NULL,
  `address` VARCHAR(300) DEFAULT NULL,
  `phone_number` VARCHAR(29) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `website` VARCHAR(100) DEFAULT NULL,
  `tax_id` VARCHAR(100) DEFAULT NULL,
  `currency` VARCHAR(20) DEFAULT 'USD',
  `logo` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_by` INT(11) DEFAULT NULL,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT(11) DEFAULT NULL,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
