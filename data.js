// Data dummy (pengganti database). Dipakai oleh stok.html, checkout.html, tracking.html, dashboard.html
const akunDummy = { email: "mahasiswa@kampus.ac.id", password: "123456" };

const dataKatalogBuku = [
  { id: 1, judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Novel", harga: 85000, stok: 20, gambar: "img/buku1.jpg" },
  { id: 2, judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: "Novel", harga: 110000, stok: 12, gambar: "img/buku2.jpg" },
  { id: 3, judul: "Berani Tidak Disukai", penulis: "Ichiro Kishimi & Fumitake Koga", kategori: "Pengembangan Diri", harga: 108000, stok: 15, gambar: "img/buku3.jpg" },
  { id: 4, judul: "Pulang", penulis: "Leila S. Chudori", kategori: "Novel", harga: 89000, stok: 8, gambar: "img/buku4.jpg" },
  { id: 5, judul: "Tentang Kamu", penulis: "Tere Liye", kategori: "Novel", harga: 75000, stok: 4, gambar: "img/buku5.jpg" },
  { id: 6, judul: "Akar", penulis: "Dee Lestari", kategori: "Novel", harga: 98000, stok: 10, gambar: "img/buku6.jpg" },
  { id: 7, judul: "Re: dan peRempuan", penulis: "Maman Suherman", kategori: "Non-Fiksi", harga: 92000, stok: 3, gambar: "img/buku7.jpg" },
  { id: 8, judul: "Perawan Remaja dalam Cengkeraman Militer", penulis: "Pramoedya Ananta Toer", kategori: "Sejarah", harga: 99000, stok: 6, gambar: "img/buku8.jpg" },
  { id: 9, judul: "Madilog", penulis: "Tan Malaka", kategori: "Filsafat", harga: 125000, stok: 7, gambar: "img/buku9.jpg" }
];

// status: 0 = Pesanan dibuat, 1 = Dikemas, 2 = Dalam pengiriman, 3 = Diterima
const dataPengiriman = [
  { noDO: "DO-1001", nama: "Budi Santoso", status: 2, ekspedisi: "JNE", tglKirim: "2026-11-03",
    paket: [{ judul: "Bumi Manusia", qty: 1 }, { judul: "Laskar Pelangi", qty: 1 }], total: 210000 },
  { noDO: "DO-1002", nama: "Siti Aminah", status: 3, ekspedisi: "J&T", tglKirim: "2026-10-28",
    paket: [{ judul: "Berani Tidak Disukai", qty: 2 }], total: 234000 },
  { noDO: "DO-1003", nama: "Raka Pratama", status: 1, ekspedisi: "SiCepat", tglKirim: "2026-11-06",
    paket: [{ judul: "Pulang", qty: 1 }, { judul: "Tentang Kamu", qty: 1 }], total: 176000 }
];
