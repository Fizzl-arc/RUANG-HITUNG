# Ruang Hitung

Situs statis ini dapat di-deploy langsung ke Vercel dari root repository. Pastikan root directory Vercel mengarah ke repository ini dan framework preset menggunakan `Other`; halaman utama tersedia di `index.html`.

Untuk Cloudflare Workers Static Assets, Worker memetakan URL `/` ke `index.html`; file CSS dan JavaScript tetap disajikan langsung sebagai aset.

Untuk deploy menggunakan Wrangler:

```sh
npx wrangler deploy
```