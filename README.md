# Toko Buku Pustaka — UTS Pemrograman Web 1

Aplikasi web pemesanan buku untuk toko online. Seluruhnya **front-end** (HTML, CSS, JavaScript) tanpa server/database. Data berasal dari variabel JavaScript di `js/data.js`, dan data baru (akun, stok tambahan, pesanan) disimpan di `localStorage` browser.

## Cara menjalankan
1. Unduh atau clone repository ini.
2. Buka `index.html` di browser (atau gunakan ekstensi Live Server di VS Code).
3. Masuk dengan akun demo: `mahasiswa@kampus.ac.id` / `123456`.

## Struktur folder
```
tugas-uts-web1/
|-- index.html        (halaman login)
|-- dashboard.html
|-- stok.html
|-- tracking.html
|-- checkout.html
|-- css/style.css
|-- js/script.js      (logika semua halaman)
|-- js/data.js        (data dummy: katalog, pengiriman, akun)
|-- assets/
|-- img/              (buku1.jpg, buku2.jpg, ... opsional)
```

## Penjelasan per halaman

### 1. Login (`index.html`)
- Input email dan password dengan validasi format email.
- Jika email/password salah, muncul `alert` berisi "Email/password yang anda masukkan salah".
- Tombol **Lupa Password** dan **Daftar** membuka modal box.
- Akun yang didaftarkan disimpan di `localStorage` dan bisa dipakai untuk masuk.

### 2. Dashboard (`dashboard.html`)
- Greeting berdasarkan waktu lokal: pagi, siang, sore, dan malam.
- Menu: Informasi Stok/Katalog, Tracking Pengiriman, Laporan Pemesanan, Histroy Transaksi.
- Laporan Pemesanan dan Histroy Transaksi tampil sebagai modal berisi ringkasan dan tabel transaksi.

### 3. Stok/Katalog (`stok.html`)
- Tabel buku dirender dinamis dari konstanta `dataKatalogBuku` (`js/data.js`).
- Pencarian langsung (judul, penulis, kategori).
- Form tambah stok: baris baru ditambahkan lewat DOM (`createElement`) dengan validasi input.
- Tombol **Pesan** memasukkan buku ke halaman pemesanan.

### 4. Pemesanan (`checkout.html`)
- Daftar pesanan bisa ditambah, dikurangi, atau dihapus, dengan batas jumlah sesuai stok.
- Data penerima, ekspedisi, dan metode pembayaran dengan validasi.
- Total (subtotal + ongkir) dihitung otomatis. Setelah berhasil, modal menampilkan nomor Delivery Order.

### 5. Tracking (`tracking.html`)
- Input nomor Delivery Order, lalu tombol **Cari**.
- Menampilkan nama pemesan, progress bar status (dibuat, dikemas, dalam pengiriman, diterima), ekspedisi, tanggal kirim, isi paket, dan total pembayaran.
- Nomor contoh: `DO-1001`, `DO-1002`, `DO-1003`.

## Catatan
- Gambar buku bersifat opsional. Jika `img/buku1.jpg` dst. tersedia, gambar tampil. Jika tidak, cover berwarna dengan inisial judul dipakai.
- Untuk mengembalikan data awal, hapus data situs di browser (localStorage).

## Dashboard (tampilan baru)
Dashboard memakai layout sidebar + grid buku dengan filter kategori, rentang harga, harga maksimal, dan pencarian. Sidebar dipakai di semua halaman.

## Cara menambah foto buku
1. Simpan foto di folder `img/` (contoh: `img/buku1.jpg`).
2. Di `js/data.js`, isi `gambar` pada buku terkait, misalnya `gambar: "img/buku1.jpg"`.
3. Untuk buku baru lewat form di `stok.html`, isi kolom "Nama file foto" (contoh: `buku10.jpg`). Fotonya tetap harus lebih dulu disalin ke folder `img/`.
4. Jika file foto tidak ada, cover berwarna dengan judul buku tampil otomatis.
