# Ruang-fungsi

Situs statis ini disajikan melalui Cloudflare Workers Static Assets. Worker memetakan URL `/` ke `Index.HTML`; file CSS dan JavaScript tetap disajikan langsung sebagai aset.

Untuk deploy menggunakan Wrangler:

```sh
npx wrangler deploy
```