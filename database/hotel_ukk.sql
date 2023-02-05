-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 05 Feb 2023 pada 06.55
-- Versi server: 10.4.27-MariaDB
-- Versi PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_ukk`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_pemesanans`
--

CREATE TABLE `detail_pemesanans` (
  `id` int(11) NOT NULL,
  `id_pemesanan` int(11) NOT NULL,
  `id_kamar` int(11) NOT NULL,
  `tgl_akses` date DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detail_pemesanans`
--

INSERT INTO `detail_pemesanans` (`id`, `id_pemesanan`, `id_kamar`, `tgl_akses`, `harga`, `createdAt`, `updatedAt`) VALUES
(38, 50, 9, '2023-02-25', 100000, '2023-02-02 12:44:18', '2023-02-02 12:44:18'),
(39, 51, 7, '2023-02-26', 100000, '2023-02-02 12:44:58', '2023-02-02 12:44:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kamars`
--

CREATE TABLE `kamars` (
  `id` int(11) NOT NULL,
  `nomor_kamar` int(11) DEFAULT NULL,
  `id_tipe_kamar` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kamars`
--

INSERT INTO `kamars` (`id`, `nomor_kamar`, `id_tipe_kamar`, `createdAt`, `updatedAt`) VALUES
(7, 101, 1, '2023-02-02 07:44:22', '2023-02-02 07:44:22'),
(8, 250, 1, '2023-02-02 07:44:32', '2023-02-02 07:44:32'),
(9, 300, 1, '2023-02-02 07:44:57', '2023-02-02 07:44:57');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pemesanans`
--

CREATE TABLE `pemesanans` (
  `id` int(11) NOT NULL,
  `nomor_pemesanan` int(11) DEFAULT NULL,
  `nama_pemesanan` varchar(255) DEFAULT NULL,
  `email_pemesanan` varchar(255) DEFAULT NULL,
  `tgl_pemesanan` datetime DEFAULT NULL,
  `tgl_check_in` date DEFAULT NULL,
  `tgl_check_out` date DEFAULT NULL,
  `nama_tamu` varchar(255) DEFAULT NULL,
  `jumlah_kamar` int(11) DEFAULT NULL,
  `id_tipe_kamar` int(11) NOT NULL,
  `status_pemesanan` enum('baru','checkin','checkout') DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pemesanans`
--

INSERT INTO `pemesanans` (`id`, `nomor_pemesanan`, `nama_pemesanan`, `email_pemesanan`, `tgl_pemesanan`, `tgl_check_in`, `tgl_check_out`, `nama_tamu`, `jumlah_kamar`, `id_tipe_kamar`, `status_pemesanan`, `id_user`, `createdAt`, `updatedAt`) VALUES
(50, 12, 'p', 'p@gmail.com', '2022-01-22 00:00:00', '2023-02-25', '2023-01-28', 'ahmad', 1, 1, 'baru', 1, '2023-02-02 12:44:18', '2023-02-02 12:44:18'),
(51, 12, 'p', 'p@gmail.com', '2022-01-22 00:00:00', '2023-02-26', '2023-01-28', 'ahmad', 1, 1, 'baru', 1, '2023-02-02 12:44:58', '2023-02-02 12:44:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data untuk tabel `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230116065333-create-user.js'),
('20230116070046-create-tipe-kamar.js'),
('20230116070156-create-kamar.js'),
('20230116071120-create-pemesanan.js'),
('20230116071134-create-detail-pemesanan.js');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tipe_kamars`
--

CREATE TABLE `tipe_kamars` (
  `id` int(11) NOT NULL,
  `nama_tipe_kamar` varchar(255) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `foto` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tipe_kamars`
--

INSERT INTO `tipe_kamars` (`id`, `nama_tipe_kamar`, `harga`, `deskripsi`, `foto`, `createdAt`, `updatedAt`) VALUES
(1, 'delux', 100000, 'bagus', 'draw-bag hitam.png', '2023-01-24 06:51:57', '2023-01-24 06:51:57'),
(2, 'VVIP', 100000, 'bagus', 'draw-bag hitam.png', '2023-01-24 06:52:05', '2023-01-24 06:52:05');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama_user` varchar(255) DEFAULT NULL,
  `foto` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `role` enum('admin','resepsionis') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama_user`, `foto`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'diansa', 'ig orange.png', 'reyhandiansa@gmail.com', '202cb962ac59075b964b07152d234b70', 'admin', '2023-01-24 06:51:47', '2023-01-24 06:51:47');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pemesanan` (`id_pemesanan`),
  ADD KEY `id_kamar` (`id_kamar`);

--
-- Indeks untuk tabel `kamars`
--
ALTER TABLE `kamars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tipe_kamar` (`id_tipe_kamar`);

--
-- Indeks untuk tabel `pemesanans`
--
ALTER TABLE `pemesanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tipe_kamar` (`id_tipe_kamar`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `tipe_kamars`
--
ALTER TABLE `tipe_kamars`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT untuk tabel `kamars`
--
ALTER TABLE `kamars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `pemesanans`
--
ALTER TABLE `pemesanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT untuk tabel `tipe_kamars`
--
ALTER TABLE `tipe_kamars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  ADD CONSTRAINT `detail_pemesanans_ibfk_1` FOREIGN KEY (`id_pemesanan`) REFERENCES `pemesanans` (`id`);

--
-- Ketidakleluasaan untuk tabel `kamars`
--
ALTER TABLE `kamars`
  ADD CONSTRAINT `kamars_ibfk_1` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `tipe_kamars` (`id`);

--
-- Ketidakleluasaan untuk tabel `pemesanans`
--
ALTER TABLE `pemesanans`
  ADD CONSTRAINT `pemesanans_ibfk_1` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `tipe_kamars` (`id`),
  ADD CONSTRAINT `pemesanans_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
