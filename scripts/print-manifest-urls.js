#!/usr/bin/env node
// Print every URL in scripts/image-manifest.js so you can eyeball each shot
// before re-uploading. Opens nothing — just prints. Use with `pbcopy`/`open` etc.
//
//   node scripts/print-manifest-urls.js

const manifest = require('./image-manifest');

for (const h of manifest) {
  console.log(`\n=== ${h.slug} (${h.region}) ===`);
  console.log(`hero:    ${h.hero}`);
  h.gallery.forEach((u, i) => console.log(`gallery ${i + 1}: ${u}`));
  h.rooms.forEach((r) => console.log(`room ${r.type}: ${r.url}`));
}
