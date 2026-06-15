CREATE TABLE IF NOT EXISTS siswa (
      id INT AUTO_INCREMENT,
      nama VARCHAR(255) NOT NULL,
      nis  VARCHAR(20) @unique,
      alamat TEXT,
      is_active BOOLEAN 
);