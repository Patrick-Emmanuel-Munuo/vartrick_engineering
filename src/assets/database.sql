SET time_zone = "+03:00"; 


CREATE TABLE `settings` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `delated` TINYINT(1) NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',

    -- Settings info
    `active_year` int(10) NOT NULL,
    `name` TEXT NOT NULL,
    `descriptions` TEXT,
    `comment` TEXT,
    `date_format` VARCHAR(50) NOT NULL DEFAULT 'DD-MM-YYYYTH24:MI',

    -- Audit trail
    `created_by` INT NULL,
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_by` INT NULL,
    `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    -- Foreign keys
    FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- Start users Table
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',

    -- login info
    `user_name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(200) NOT NULL,

    -- Personal Information
    `full_name` TEXT NOT NULL,
    `gender` TEXT NOT NULL,
    `designation` TEXT NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(29) NOT NULL,
    `image` VARCHAR(100) NOT NULL,
    `phone_verify` TINYINT(1) NOT NULL DEFAULT 0,
    `email_verify` TINYINT(1) NOT NULL DEFAULT 0,
    `otp_code` INT,
    `address` TEXT NOT NULL,
    `birth_date` DATE NULL,
    `national_id` VARCHAR(50) NULL,
    `job_code` VARCHAR(50) NULL,
    `date_hired` DATE NULL,
    `retirement_date` DATE NULL,
    `confirmation_date` DATE NULL,
    `department_name` TEXT NULL,
    `department_code` VARCHAR(50) NULL,
    
    -- reference
    `role_id` INT NULL,
    `department_id` INT NULL,

    -- Audit trail
    `created_by` INT NULL,
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_by` INT NULL,
    `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Primary & Unique keys
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_name` (`user_name`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `phone_number` (`phone_number`),

    -- Foreign keys
    FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `users`
INSERT INTO `users` (
    `id`,
    `deleted`,
    `status`,
    `user_name`,
    `password`,
    `full_name`,
    `gender`,
    `designation`,
    `email`,
    `phone_number`,
    `image`,
    `phone_verify`,
    `email_verify`,
    `otp_code`,
    `address`,
    `role_id`,
    `department_id`,
    `created_by`,
    `created_date`,
    `updated_by`,
    `updated_date`
) VALUES
(
    1,
    0,
    'active',
    'patrick.munuo',
    'encrypted_password_here',
    'Patrick Munuo',
    'Male',
    'Engineer',
    'patrick.munuo@bmh.or.tz',
    '+255712345678',
    'patrick.jpg',
    0,
    0,
    NULL,
    'Block I, Benjamin Mkapa Hospital',
    5,  -- role_id
    1,  -- department_id
    NULL,
    '2025-08-24 11:00:00',
    NULL,
    '2025-08-24 11:00:00'
),
(
    2,
    0,
    'active',
    'azizi.dtsemu',
    'encrypted_password_here',
    'Azizi DTSEMU',
    'Male',
    'HOD',
    'azizi.dtsemu@bmh.or.tz',
    '+255713456789',
    'azizi.jpg',
    0,
    0,
    NULL,
    'Block II, Benjamin Mkapa Hospital',
    3,  -- role_id
    2,  -- department_id
    1,
    '2025-08-24 11:05:00',
    1,
    '2025-08-24 11:05:00'
);
-- End users Table


-- Start jobs Table
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `delated` TINYINT(1) NOT NULL DEFAULT 0,
    `year`  TEXT NOT NULL,

    -- Department and job details
    `requested_department` INT NULL,
    `user_department` INT NULL,
    `descriptions` TEXT NOT NULL,
    `specifications` TEXT,
    `materials_required` TEXT,
    `material_used` TEXT,
    `instrument` TEXT,
    `location` TEXT,
    `status` VARCHAR(20) DEFAULT 'active'
    `progress` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `emergency` BOOLEAN NOT NULL DEFAULT 0,

    -- Comments and approvals
    `comment` TEXT,
    `customer_comment` TEXT,
    `customer_approve` BOOLEAN NOT NULL DEFAULT 0,          
    `supervisor_comment` TEXT,
    `supervisor_approve` BOOLEAN NOT NULL DEFAULT 0,        
    `completed` BOOLEAN NOT NULL DEFAULT 0,

    -- Assignment info
    `assigned_department` INT NULL,
    `assigned_to` INT NULL,
    `assigned_by` INT NULL,
    `assigned_date` DATETIME,
    `assigned_comment` TEXT,
    `assigned_report_time` DATETIME,
    `assigned_referred` INT NULL,                   

    -- Attempt info
    `attempt_by` INT NULL,
    `attempt_date` DATETIME,
    `attempt_comment` TEXT,
    `attempted` BOOLEAN NOT NULL DEFAULT 0,

    -- Audit trail
    `created_by` INT NULL,
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_by` INT NULL,
    `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `printed` BOOLEAN NOT NULL DEFAULT 0,
    `printed_date` DATETIME,
    `printed_by` INT NULL,

    PRIMARY KEY (`id`),
    -- Foreign keys (nullable allowed)
    FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`assigned_referred`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`printed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`attempt_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`assigned_department`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`requested_department`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `jobs` 
(`id`, `deleted`, `created_date`, `created_by`, `updated_date`, `updated_by`, `status`, `descriptions`, 
 `assigned_to`, `technical_specifications`, `materials_required`, `material_used`, `emergency`, `comment`, `customer_approve`, `jobcard_number`, `progress`, `user_department_id`, `instrument`, `location`, `customer_comment`, 
 `assigned_by`, `assigned_date`, `assigned_comment`, `assigned_report_time`, `attempt_by`, `assigned_referred`, 
 `requested_department_id`, `completed`, `attempt_date`, `supervisor_comment`, `supervisor_approve`, `attempt_comment`) 
VALUES
(42, 0, '2025-08-16 04:37:10', '66ac3c2255cab51576cd4d102', '2025-08-18 14:29:32', '66ac3c2255cab51576cd4d102',
 'assigned', 'ccccccccc', '66ac3c2255cab51576cd4d91', '', '', '', 1, 'task assigned wait for attempting', 0, 
 '689fe26d8ef86c20e53ee332', '', 0.00, '66b525751d5391b802c34f9c', 'ccccccc', 'cccccccc', NULL, 
 '66ac3c2255cab51576cd4d102', '2025-08-18 14:29:32', 'proceed to job', '2025-08-18 16:29:00', NULL, NULL, 
 '66b7b2cb2fb693d1bd84b415', 0, NULL, NULL, 0, NULL);
-- End jobs Table




-- Start Departments Table
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `deleted` TINYINT(1) NOT NULL DEFAULT 0,

    -- Department information
    `name` TEXT NOT NULL,                       -- Department name (e.g., Electrical and AC)
    `description` TEXT,                                 -- Description of the department
    `status` VARCHAR(20) DEFAULT 'active',              -- Department status (active/inactive/etc.)
    `location`TEXT NOT NULL,,                            -- Department location (e.g., ROOM 200)
    `phone` VARCHAR(20) DEFAULT 'active',                              -- Contact phone number

    -- Department leadership
    `hod` INT NULL,                                     -- Head of Department (User ID reference)
    `assist_hod` INT NULL,                              -- Assistant Head of Department (User ID reference)

    -- Audit trail
    `created_by` INT NULL,                              -- User ID of who created the record
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,  -- When the record was created
    `updated_by` INT NULL,                              -- User ID of who last updated the record
    `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP 
                    ON UPDATE CURRENT_TIMESTAMP,        -- When the record was last updated

    PRIMARY KEY (`id`),
    -- Foreign keys (nullable allowed, references users table)
    FOREIGN KEY (`hod`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`assist_hod`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Initial Department Records
INSERT INTO `departments`
(`id`, `name`, `description`, `hod`, `created_by`, `created_date`, `updated_date`, `updated_by`, `assist_hod`, `status`, `location`, `phone`, `deleted`) VALUES
(2, 'Electrical and AC', 'Engineering works related to electrical and AC systems', 15, 15, '2024-08-16 12:18:36', '2025-08-24 11:02:26', 15, 15, 'active', 'ROOM 200', '+255625449295', 0),
(4, 'Biomedical Equipments', 'Maintenance and management of biomedical equipment', 15, 15, '2024-08-16 12:18:36', '2025-08-24 11:01:35', 15, 15, 'active', 'ROOM 203', '1234', 0),
(67, 'Plumbing and Water Sanitary', 'Plumbing, sanitation, and water system management', 15, 15, '2024-08-16 12:18:36', '2025-08-24 11:02:42', 15, 15, 'active', 'ROOM 204', '+255625449295', 0),
(68, 'Civil and Building Engineering', 'Civil works, construction, and building maintenance', 15, 15, '2025-05-12 09:32:10', '2025-08-24 11:03:04', 15, 15, 'active', 'Basement Block 2', '1234', 0),
(70, 'Mechanical Boiler and Welding', 'Boiler operations, welding, and related mechanical works', 15, 15, '2025-05-17 03:32:58', NULL, 15, 15, 'active', 'Workshop Area', '0712345678', 1);
-- End Departments Table

  -- start table roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
    -- Control
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  
  -- Role Info
  `name` VARCHAR(200) NOT NULL, -- 'Name of the role (e.g., Admin, Manager, Technician)',
  `descriptions` TEXT NULL, -- 'Detailed description of the role responsibilities',
  `data` LONGTEXT NOT NULL, -- 'List of permissions or modules associated with this role',
  `comment` TEXT NULL, -- 'Additional notes or remarks about the role',
  `status` VARCHAR(20) DEFAULT 'active',   -- 'Operational status of the role',

  -- Audit Information
  `created_by` INT NULL, -- 'User who created the record',
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 'Date and time when the record was created',
  `updated_by` INT NULL, -- 'User who last updated the record',
  `updated_date` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP, -- 'Date and time of last update',


  PRIMARY KEY (`id`),
  UNIQUE KEY (`name`),
  -- Foreign keys (nullable allowed, references users table)
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Table for managing user roles in the organization';
-- Dumping data for table `roles`
INSERT INTO `roles` (
    `id`,
    `created_date`,
    `created_by`,
    `name`,
    `updated_date`,
    `updated_by`,
    `status`,
    `deleted`,
    `comment`,
    `data`,
    `descriptions`
) VALUES
(
    1,
    '2025-05-14 01:04:32',
    15,
    'users',
    '2025-05-18 12:16:27',
    15,
    'active',
    0,
    '',
    '2000,2005,9000,1004,4001,4002,4003,4004,4005,4006,4007,5000,5001,5002,4000,5004,5003,5005,2007,1000',
    'for system users'
),
(
    2,
    '2025-05-14 03:35:42',
    15,
    'ED',
    '2025-08-19 03:20:13',
    15,
    'active',
    0,
    '',
    '3000,3001,3002,3003,3005,2000,2003,3004,2005,1000,1004,1003,1001,1002,2002,2001,2007,2008,2006,2004,4006,4005,5000,5001,5002,5005,5004,5003,2009,4000,4001,4007,4009,4008,4002,4003,9000,2010',
    'executive director role'
),
(
    3,
    '2025-05-15 08:27:01',
    15,
    'HOD',
    '2025-08-19 03:15:04',
    15,
    'active',
    0,
    '',
    '2000,2003,2005,9000,1000,1004,2006,2007,2001,2002,2008,4000,4006,4005,4004,4002,4001,4007,5000,5001,5002,5005,5004,5003,4010,4011,1001,1002,1003,4008,4009,2009,3000,4003',
    'Head of department'
),
(
    4,
    '2025-05-15 09:54:31',
    16,
    'Technician',
    '2025-05-17 09:23:21',
    18,
    'active',
    0,
    '',
    '9000,1000,1004,2008,2005,4000,4001,4002,4003,4004,4005,4006,5002,5001,5000,4007,5005,5004,5003,2000,2007,2006,2001,2002',
    'engineering technician role'
),
(
    5,
    '2025-05-17 09:02:12',
    15,
    'Engineer',
    '2025-08-19 10:45:55',
    15,
    'active',
    0,
    '',
    '4004,4006,4009,4014,9000,2003,2005,2000,4000,4001,4002,4007,4005',
    'role for engineer assisting head of director'
),
(
    6,
    '2025-05-22 01:23:55',
    15,
    'Test',
    '2025-08-15 15:23:26',
    15,
    'active',
    0,
    '',
    '9000,2005,3000,3001,3002,3003,3004,3005,4000,4001,4008,4003,4002,4007,4006,4009,4005,1000,1001,2004,2003,2002,2001,2008,2009,1002,1003,1004,2000,2007,2006,5000,5001,5005,5004,5003,5002',
    'Test'
);
-- end table roles


-- Start login_history Table
DROP TABLE IF EXISTS `login_history`;

CREATE TABLE `login_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `delated` TINYINT(1) NOT NULL DEFAULT 0,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',

  -- browser and device info
  `ip_address` VARCHAR(100) NOT NULL,
  `login_device` VARCHAR(200) NOT NULL,
  `browser_name` VARCHAR(100) NOT NULL,
  `browser_version` VARCHAR(100) NOT NULL,
  `host` VARCHAR(200) NOT NULL,
  `time_zone` VARCHAR(100) NOT NULL,

  -- Audit trail
  `created_by` INT NULL,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample insert
INSERT INTO `login_history` (
    `user_id`,
    `delated`,
    `status`,
    `ip_address`,
    `login_device`,
    `browser_name`,
    `browser_version`,
    `host`,
    `time_zone`,
    `created_by`,
    `updated_by`
) VALUES (
    15,
    0,
    'active',
    '192.168.1.10',
    'Laptop',
    'Chrome',
    '114.0',
    'host.example.com',
    'EAT',
    1,
    1
);
-- End login_history Table


-- Start morning_inspections Table
DROP TABLE IF EXISTS `inspections`;
CREATE TABLE `inspections` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `delated` TINYINT(1) NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',

    -- Inspection details
    `inspection_department_id` INT NOT NULL DEFAULT 0,          -- Department being inspected
    `inspected_name` VARCHAR(200) NOT NULL,           -- Name of the person conducting the inspection
    `inspection_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date and time of the inspection
    `inspection_status` VARCHAR(100) NOT NULL,        -- Status of the inspection (e.g., Good, Needs Repair)
    `recommendations` TEXT NULL,                            -- Recommendations based on the inspection
    `comments` TEXT NULL,  
    `technical_finding` TEXT NULL,               -- Technical findings from the inspection
    `reported_department` INT NULL,       -- Department reporting the inspection


    -- Audit trail
    `created_by` INT NULL,                             -- User ID of who created the record
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,  -- When the record was created
    `updated_by` INT NULL,                             -- User ID of who last updated the record
    `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- When the record was last updated

    PRIMARY KEY (`id`),
    -- Foreign keys (nullable allowed)
    FOREIGN KEY (`inspection_department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`reported_department`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;