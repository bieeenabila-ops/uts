/* ===== Helper umum ===== */
const ICON_BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12H5z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>';
const ICON_HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.6-9-9.2C1.8 7.6 3.6 5 6.4 5c1.8 0 3.1 1 3.6 2 .5-1 1.8-2 3.6-2 2.8 0 4.6 2.6 3.4 5.8-2 4.6-5 9.2-5 9.2z" transform="translate(1 0) scale(.92)"/></svg>';
const $ = (s, r = document) => r.querySelector(s);
const rupiah = n => "Rp " + Number(n).toLocaleString("id-ID");
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const ONGKIR = { "JNE": 15000, "J&T": 18000, "SiCepat": 12000, "Ambil di toko": 0 };
const NAMA_STATUS = ["Pesanan dibuat", "Dikemas", "Dalam pengiriman", "Diterima"];
const emailValid = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function el(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  Object.assign(e, props);
  kids.flat().forEach(k => e.append(k));
  return e;
}
function toast(msg) {
  const t = el("div", { className: "toast", textContent: msg, role: "status" });
  document.body.append(t);
  setTimeout(() => t.remove(), 2500);
}
function bukaModal(id) { $("#" + id).classList.add("show"); }
function tutupModal() { document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show")); }
function getKatalog() { return load("katalog", null) || structuredClone(dataKatalogBuku); }
function semuaPesanan() { return [...dataPengiriman, ...load("orders", [])]; }
function buatCover(b, besar = false) {
  const c = el("div", { className: "cover" + (besar ? " big" : ""), textContent: besar ? b.judul : b.judul.slice(0, 2).toUpperCase() });
  c.style.background = `hsl(${(b.id * 47) % 360} 45% 32%)`;
  if (b.gambar) { const i = el("img", { src: b.gambar, alt: "" }); i.onerror = () => i.remove(); c.append(i); }
  return c;
}
function setInvalid(input, bad) { input.classList.toggle("invalid", bad); }

/* ===== Inisialisasi per halaman ===== */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page !== "login" && !sessionStorage.getItem("user")) { location.href = "index.html"; return; }
  document.addEventListener("click", e => {
    if (e.target.matches("[data-close]") || e.target.classList.contains("modal")) tutupModal();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") tutupModal(); });
  const user = sessionStorage.getItem("user");
  if (user && $("#avatar")) { $("#avatar").textContent = user[0].toUpperCase(); $("#profNama").textContent = user.split("@")[0]; }
  const out = $("#btnLogout");
  if (out) out.onclick = () => { sessionStorage.clear(); location.href = "index.html"; };
  ({ login: initLogin, dashboard: initDashboard, stok: initStok, checkout: initCheckout, tracking: initTracking })[page]?.();
});

/* ===== 1. Login ===== */
function initLogin() {
  const form = $("#formLogin");
  $("#togglePw").onclick = e => {
    const p = $("#password"), tampil = p.type === "password";
    p.type = tampil ? "text" : "password";
    e.target.textContent = tampil ? "Sembunyikan" : "Tampilkan";
  };
  document.querySelectorAll("[data-social]").forEach(b =>
    b.onclick = () => toast("Login " + b.dataset.social + " hanya tampilan (simulasi)."));
  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#email"), pass = $("#password");
    const akun = [akunDummy, ...load("akun", [])];
    const cocok = akun.find(a => a.email === email.value.trim() && a.password === pass.value);
    setInvalid(email, !emailValid(email.value.trim()));
    setInvalid(pass, pass.value === "");
    if (!cocok) {
      $("#msgLogin").textContent = "Email atau password salah.";
      $("#msgLogin").className = "msg err";
      alert("Email/password yang anda masukkan salah");
      return;
    }
    sessionStorage.setItem("user", cocok.email);
    location.href = "dashboard.html";
  });
  $("#btnLupa").onclick = () => { $("#msgLupa").textContent = ""; bukaModal("modalLupa"); };
  $("#btnDaftar").onclick = () => { $("#msgDaftar").textContent = ""; bukaModal("modalDaftar"); };
  $("#formLupa").addEventListener("submit", e => {
    e.preventDefault();
    const m = $("#msgLupa"), v = $("#emailLupa").value.trim();
    if (!emailValid(v)) { m.textContent = "Format email belum benar."; m.className = "msg err"; return; }
    m.textContent = "Tautan reset password sudah dikirim ke " + v + " (simulasi)."; m.className = "msg ok";
  });
  $("#formDaftar").addEventListener("submit", e => {
    e.preventDefault();
    const m = $("#msgDaftar"), em = $("#emailDaftar").value.trim(), pw = $("#passDaftar").value;
    if (!$("#namaDaftar").value.trim() || !emailValid(em) || pw.length < 6) {
      m.textContent = "Isi nama, email yang valid, dan password minimal 6 karakter."; m.className = "msg err"; return;
    }
    const akun = load("akun", []);
    if (akun.some(a => a.email === em) || em === akunDummy.email) { m.textContent = "Email sudah terdaftar."; m.className = "msg err"; return; }
    akun.push({ email: em, password: pw, nama: $("#namaDaftar").value.trim() });
    save("akun", akun);
    m.textContent = "Akun dibuat. Silakan masuk."; m.className = "msg ok";
    e.target.reset();
  });
}

/* ===== 2. Dashboard ===== */
function sapaan(jam) {
  if (jam < 11) return "pagi";
  if (jam < 15) return "siang";
  if (jam < 18) return "sore";
  return "malam";
}
function initDashboard() {
  const nama = sessionStorage.getItem("user").split("@")[0];
  const tick = () => {
    const d = new Date();
    $("#greeting").textContent = `Selamat ${sapaan(d.getHours())}, ${nama}`;
    $("#clock").textContent = d.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" });
  };
  tick(); setInterval(tick, 1000);

  /* Laporan & histori (modal) */
  const bukaLaporan = () => {
    const p = semuaPesanan();
    $("#lapPesanan").textContent = p.length;
    $("#lapBuku").textContent = p.reduce((s, o) => s + o.paket.reduce((a, i) => a + i.qty, 0), 0);
    $("#lapOmzet").textContent = rupiah(p.reduce((s, o) => s + o.total, 0));
    bukaModal("modalLaporan");
  };
  const bukaHistori = () => {
    const body = $("#bodyHistori"); body.replaceChildren();
    semuaPesanan().slice().reverse().forEach(o =>
      body.append(el("tr", {}, el("td", { textContent: o.noDO }), el("td", { textContent: o.tglKirim }),
        el("td", { textContent: o.nama }), el("td", { textContent: rupiah(o.total) }))));
    bukaModal("modalHistori");
  };
  document.querySelectorAll("[data-modal]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); a.dataset.modal === "laporan" ? bukaLaporan() : bukaHistori();
  }));
  if (location.hash === "#laporan") bukaLaporan();
  if (location.hash === "#histori") bukaHistori();

  /* Grid buku + filter */
  const katalog = getKatalog(), grid = $("#gridBuku"), sel = $("#fKategori");
  [...new Set(katalog.map(b => b.kategori))].forEach(k => sel.append(el("option", { value: k, textContent: k })));
  $("#fMaks").addEventListener("input", e => $("#outMaks").textContent = rupiah(e.target.value));
  const render = () => {
    const [min, max] = document.querySelector("input[name=rentang]:checked").value.split("-").map(Number);
    const maks = Number($("#fMaks").value), q = $("#cariTop").value.toLowerCase();
    const hasil = katalog.filter(b => (!sel.value || b.kategori === sel.value) && b.harga >= min && b.harga <= max &&
      b.harga <= maks && (b.judul + b.penulis).toLowerCase().includes(q));
    grid.replaceChildren();
    hasil.forEach(b => {
      const bag = el("button", { className: "ibtn", title: "Tambah ke pesanan", ariaLabel: "Pesan " + b.judul, disabled: b.stok < 1 });
      bag.innerHTML = ICON_BAG; bag.onclick = () => tambahKeranjang(b);
      const fav = el("button", { className: "ibtn", title: "Favorit", ariaLabel: "Favorit " + b.judul });
      fav.innerHTML = ICON_HEART; fav.onclick = () => fav.classList.toggle("on");
      grid.append(el("article", { className: "pcard" }, buatCover(b, true),
        el("h3", { textContent: b.judul }), el("p", { className: "muted", textContent: b.penulis }),
        el("div", { className: "pfoot" }, el("strong", { textContent: rupiah(b.harga) }), el("div", { className: "ibtns" }, fav, bag))));
    });
    if (!hasil.length) grid.append(el("p", { className: "muted", textContent: "Tidak ada buku yang cocok dengan filter." }));
    $("#hitungBuku").textContent = `Menampilkan ${hasil.length} dari ${katalog.length} buku`;
  };
  $("#btnTerapkan").onclick = render;
  $("#cariTop").addEventListener("input", render);
  $("#btnReset").onclick = () => {
    sel.value = ""; $("#fMaks").value = 150000; $("#outMaks").textContent = rupiah(150000);
    document.querySelector("input[name=rentang][value^='0-99']").checked = true; $("#cariTop").value = ""; render();
  };
  render();
}

/* ===== 3. Stok / Katalog ===== */
function tambahKeranjang(b) {
  const cart = load("cart", []);
  const ada = cart.find(i => i.id === b.id);
  if (ada && ada.qty >= b.stok) { toast("Jumlah melebihi stok yang tersedia."); return; }
  if (ada) ada.qty++; else cart.push({ id: b.id, qty: 1 });
  save("cart", cart);
  toast(`"${b.judul}" masuk ke pesanan.`);
}
function buatBaris(b) {
  const btn = el("button", { className: "btn small", textContent: "Pesan", disabled: b.stok < 1 });
  btn.onclick = () => tambahKeranjang(b);
  return el("tr", {},
    el("td", {}, el("div", { className: "titlecell" }, buatCover(b),
      el("div", {}, el("strong", { textContent: b.judul }), el("div", { className: "muted", textContent: b.penulis })))),
    el("td", { textContent: b.kategori }),
    el("td", { textContent: rupiah(b.harga) }),
    el("td", {}, el("span", { className: "badge" + (b.stok < 5 ? " low" : ""), textContent: b.stok < 1 ? "Habis" : b.stok + " buku" })),
    el("td", {}, btn));
}
function initStok() {
  const katalog = getKatalog();
  const body = $("#bodyStok");
  const render = () => {
    const q = $("#cari").value.toLowerCase();
    body.replaceChildren();
    katalog.filter(b => (b.judul + b.penulis + b.kategori).toLowerCase().includes(q)).forEach(b => body.append(buatBaris(b)));
  };
  render();
  $("#cari").addEventListener("input", render);
  $("#formTambah").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, m = $("#msgTambah");
    const judul = f.judul.value.trim(), penulis = f.penulis.value.trim(), kategori = f.kategori.value.trim();
    const harga = Number(f.harga.value), stok = Number(f.stok.value);
    [f.judul, f.penulis, f.kategori].forEach(i => setInvalid(i, !i.value.trim()));
    setInvalid(f.harga, !(harga > 0)); setInvalid(f.stok, !(stok >= 0 && f.stok.value !== ""));
    if (!judul || !penulis || !kategori || !(harga > 0) || f.stok.value === "" || stok < 0) {
      m.textContent = "Lengkapi semua kolom. Harga harus lebih dari 0 dan stok tidak boleh negatif."; m.className = "msg err"; return;
    }
    const baru = { id: Math.max(0, ...katalog.map(b => b.id)) + 1, judul, penulis, kategori, harga, stok,
      gambar: f.gambar.value.trim() ? (f.gambar.value.trim().startsWith("img/") ? "" : "img/") + f.gambar.value.trim() : "" };
    katalog.push(baru); save("katalog", katalog);
    body.append(buatBaris(baru));            // tambah baris langsung lewat DOM
    m.textContent = `"${judul}" ditambahkan ke katalog.`; m.className = "msg ok";
    f.reset();
  });
}

/* ===== 4. Pemesanan / Checkout ===== */
function initCheckout() {
  const list = $("#daftarPesanan");
  const hitung = () => {
    const kat = getKatalog(), cart = load("cart", []);
    const sub = cart.reduce((s, i) => s + (kat.find(b => b.id === i.id)?.harga || 0) * i.qty, 0);
    const ongkir = cart.length ? ONGKIR[$("#ekspedisi").value] : 0;
    $("#subtotal").textContent = rupiah(sub); $("#ongkir").textContent = rupiah(ongkir);
    $("#total").textContent = rupiah(sub + ongkir);
    return sub + ongkir;
  };
  const render = () => {
    const kat = getKatalog(); let cart = load("cart", []);
    cart = cart.filter(i => kat.some(b => b.id === i.id)); save("cart", cart);
    list.replaceChildren();
    if (!cart.length) list.append(el("p", { className: "muted" }, "Belum ada buku di pesanan. ", el("a", { href: "stok.html", textContent: "Pilih buku di katalog" }), "."));
    cart.forEach(i => {
      const b = kat.find(x => x.id === i.id);
      const ubah = d => {
        i.qty += d;
        if (i.qty > b.stok) { i.qty = b.stok; toast("Jumlah melebihi stok."); }
        if (i.qty < 1) cart.splice(cart.indexOf(i), 1);
        save("cart", cart); render();
      };
      const min = el("button", { type: "button", textContent: "−", ariaLabel: "Kurangi" }); min.onclick = () => ubah(-1);
      const plus = el("button", { type: "button", textContent: "+", ariaLabel: "Tambah" }); plus.onclick = () => ubah(1);
      const hapus = el("button", { type: "button", className: "linkbtn", textContent: "Hapus" });
      hapus.onclick = () => { cart.splice(cart.indexOf(i), 1); save("cart", cart); render(); };
      list.append(el("div", { className: "item-row" }, buatCover(b),
        el("div", { className: "grow" }, el("strong", { textContent: b.judul }), el("div", { className: "muted", textContent: rupiah(b.harga) })),
        el("div", { className: "qty" }, min, el("span", { textContent: i.qty }), plus),
        el("strong", { textContent: rupiah(b.harga * i.qty) }), hapus));
    });
    hitung();
  };
  render();
  $("#ekspedisi").addEventListener("change", hitung);

  $("#formPesan").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, m = $("#msgPesan"), cart = load("cart", []);
    const wajib = [f.nama, f.telp, f.alamat];
    wajib.forEach(i => setInvalid(i, !i.value.trim()));
    if (!cart.length) { m.textContent = "Pesanan masih kosong."; m.className = "msg err"; return; }
    if (wajib.some(i => !i.value.trim()) || !/^[0-9+\- ]{8,15}$/.test(f.telp.value.trim())) {
      setInvalid(f.telp, !/^[0-9+\- ]{8,15}$/.test(f.telp.value.trim()));
      m.textContent = "Lengkapi data penerima. Nomor telepon 8–15 digit."; m.className = "msg err"; return;
    }
    const kat = getKatalog(), total = hitung();
    const paket = cart.map(i => { const b = kat.find(x => x.id === i.id); b.stok -= i.qty; return { judul: b.judul, qty: i.qty }; });
    const noDO = "DO-" + String(Date.now()).slice(-6);
    const orders = load("orders", []);
    orders.push({ noDO, nama: f.nama.value.trim(), alamat: f.alamat.value.trim(), status: 0, ekspedisi: f.ekspedisi.value,
      pembayaran: f.pembayaran.value, tglKirim: new Date().toISOString().slice(0, 10), paket, total });
    save("orders", orders); save("katalog", kat); save("cart", []);
    $("#noDOBaru").textContent = noDO; $("#linkTrack").href = "tracking.html?no=" + noDO;
    bukaModal("modalSukses");
    f.reset(); m.textContent = ""; render();
  });
}

/* ===== 5. Tracking ===== */
function initTracking() {
  const hasil = $("#hasil"), msg = $("#msgCari");
  const cari = () => {
    const no = $("#noDO").value.trim().toUpperCase();
    hasil.replaceChildren(); msg.textContent = "";
    if (!no) { msg.textContent = "Masukkan nomor Delivery Order."; msg.className = "msg err"; return; }
    const o = semuaPesanan().find(x => x.noDO === no);
    if (!o) { msg.textContent = `Nomor ${no} tidak ditemukan. Periksa kembali nomornya.`; msg.className = "msg err"; return; }
    const langkah = el("ol", { className: "steps" });
    NAMA_STATUS.forEach((n, i) => langkah.append(el("li", { className: i <= o.status ? "done" : "", textContent: n })));
    const isi = el("span"); isi.style.width = "0%";
    const bar = el("div", { className: "progress", role: "progressbar" }, isi);
    setTimeout(() => isi.style.width = (o.status / 3) * 100 + "%", 50);
    const baris = (k, v) => el("tr", {}, el("th", { textContent: k }), el("td", { textContent: v }));
    hasil.append(el("div", { className: "card" },
      el("h2", { textContent: o.nama }),
      el("p", { className: "muted", textContent: "Status: " + NAMA_STATUS[o.status] }),
      bar, langkah),
      el("div", { className: "card tablewrap" }, el("table", {},
        baris("Nomor DO", o.noDO), baris("Ekspedisi", o.ekspedisi), baris("Tanggal kirim", o.tglKirim),
        baris("Isi paket", o.paket.map(p => `${p.judul} ×${p.qty}`).join(", ")),
        baris("Total pembayaran", rupiah(o.total)))));
  };
  $("#btnCari").onclick = cari;
  $("#noDO").addEventListener("keydown", e => { if (e.key === "Enter") cari(); });
  const q = new URLSearchParams(location.search).get("no");
  if (q) { $("#noDO").value = q; cari(); }
}
