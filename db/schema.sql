-- ==============================================================================
-- CBT-PPLG DATABASE SCHEMA FOR TiDB SERVERLESS (MySQL 8.0 Compatible)
-- Standar Uji Kompetensi Keahlian TKA PPLG SMK Kemendikdasmen RI
-- ==============================================================================

-- 1. TABEL PENGGUNA (Users: Siswa, Guru, Admin)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `school` VARCHAR(255) DEFAULT '',
  `class_grade` VARCHAR(50) DEFAULT '',
  `role` ENUM('siswa', 'guru', 'admin') DEFAULT 'siswa',
  `latest_irt_score` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL BANK SOAL (5 Elemen & 14 Sub-Elemen Resmi)
CREATE TABLE IF NOT EXISTS `questions` (
  `id` VARCHAR(64) NOT NULL,
  `stem` TEXT NOT NULL,
  `topic` VARCHAR(255) NOT NULL,
  `element_id` INT NOT NULL,
  `element_name` VARCHAR(255) NOT NULL,
  `difficulty` ENUM('Mudah', 'Sedang', 'Sulit') NOT NULL DEFAULT 'Sedang',
  `options` JSON NOT NULL,
  `correct_answer` VARCHAR(10) NOT NULL,
  `explanation` TEXT,
  `cognitive_level` VARCHAR(50) DEFAULT 'C3 Aplikasi',
  `source` VARCHAR(50) DEFAULT 'bank',
  `status` ENUM('draft', 'review', 'approved') DEFAULT 'approved',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_questions_topic` (`topic`),
  INDEX `idx_questions_element` (`element_id`),
  INDEX `idx_questions_difficulty` (`difficulty`),
  INDEX `idx_questions_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL RIWAYAT UJIAN & ATTEMPTS
CREATE TABLE IF NOT EXISTS `attempts` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(255),
  `package_id` VARCHAR(64),
  `package_title` VARCHAR(255),
  `score` DECIMAL(5,2) DEFAULT 0.00,
  `irt_score` INT DEFAULT 0,
  `total_questions` INT DEFAULT 0,
  `correct_count` INT DEFAULT 0,
  `incorrect_count` INT DEFAULT 0,
  `duration_seconds` INT DEFAULT 0,
  `answers` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_attempts_user_id` (`user_id`),
  INDEX `idx_attempts_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABEL PROGRES & PENGUASAAN SUB-ELEMEN (Radar Chart & Mastery)
CREATE TABLE IF NOT EXISTS `topic_progress` (
  `id` VARCHAR(128) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `topic` VARCHAR(255) NOT NULL,
  `element_id` INT NOT NULL,
  `element_name` VARCHAR(255) NOT NULL,
  `total_answered` INT DEFAULT 0,
  `total_correct` INT DEFAULT 0,
  `accuracy` DECIMAL(5,2) DEFAULT 0.00,
  `mastery_level` VARCHAR(50) DEFAULT 'Belum Dicoba',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_topic` (`user_id`, `topic`),
  INDEX `idx_progress_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABEL ANTREAN REMEDIAL
CREATE TABLE IF NOT EXISTS `remedial_queue` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `question_id` VARCHAR(64) NOT NULL,
  `mistake_reason` TEXT,
  `is_resolved` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_remedial_user_resolved` (`user_id`, `is_resolved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABEL KONFIGURASI SISTEM (KKM, IRT Parameters, Proctoring Setting)
CREATE TABLE IF NOT EXISTS `system_configs` (
  `config_key` VARCHAR(64) NOT NULL,
  `config_value` JSON NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABEL AUDIT PROCTORING (Integritas Ujian & Deteksi Pelanggaran)
CREATE TABLE IF NOT EXISTS `proctoring_logs` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64),
  `user_name` VARCHAR(255),
  `attempt_id` VARCHAR(64),
  `event_type` VARCHAR(64) NOT NULL,
  `details` TEXT,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_proctoring_user` (`user_id`),
  INDEX `idx_proctoring_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TABEL PENGUMUMAN SISTEM (Announcements)
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  `is_active` BOOLEAN DEFAULT TRUE,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DEFAULT SEED DATA
-- ==============================================================================

-- Seed Akun Administrator Resmi
-- Salted SHA-256 hash untuk password: '3j3nkf9sfcajna3982'
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `school`, `class_grade`, `role`, `latest_irt_score`, `is_active`)
VALUES (
  'usr_admin_master',
  'Administrator Sistem',
  'admin@cbt-pplg.sch.id',
  'b480adeda7ecc89d8f363388bec995bc9b7dcba21f3a00ca1a3e2d7d9e072b73',
  'SMK Pusat Keunggulan PPLG',
  'Admin',
  'admin',
  0,
  TRUE
) ON DUPLICATE KEY UPDATE `email` = VALUES(`email`), `latest_irt_score` = VALUES(`latest_irt_score`);

-- Seed Default Konfigurasi Simulasi
INSERT INTO `system_configs` (`config_key`, `config_value`)
VALUES (
  'simulation_config',
  JSON_OBJECT(
    'totalQuestions', 30,
    'durationMinutes', 50,
    'easyPercentage', 30,
    'mediumPercentage', 50,
    'hardPercentage', 20,
    'kkmThreshold', 500,
    'irtMinScore', 200,
    'irtMaxScore', 800,
    'strictProctoring', true
  )
) ON DUPLICATE KEY UPDATE `config_value` = VALUES(`config_value`);

-- Seed Default Pengumuman
INSERT INTO `announcements` (`id`, `title`, `message`, `type`, `is_active`)
VALUES (
  'ann_default_1',
  'Simulasi Uji Kompetensi Keahlian TKA PPLG 2026/2027',
  'Selamat datang di Cendekia PPLG Studio. Seluruh paket tryout menerapkan standar pengawasan resmi layar penuh (fullscreen lock) dan IRT parameter 2-PL.',
  'info',
  TRUE
) ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);
