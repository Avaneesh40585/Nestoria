#!/usr/bin/env node
// Fetch hotel-themed photos via the Unsplash Search API and (re)write
// scripts/image-manifest.js with verified entries.
//
//   NODE_PATH=backend/node_modules node scripts/fetch-hotel-photos.js
//
// Reads UNSPLASH_ACCESS_KEY from backend/.env (free demo tier, 50 req/hour).
// Sign-up: https://unsplash.com/developers
//
// For each of the 8 seed hotels:
//   - issues one search for the property "shoot" → keeps 5 hotel/room/interior
//     results → first becomes the hero, rest become the 4-up gallery
//   - issues one search per room → keeps the first hotel/room result
//
// Every manifest entry is annotated with `// alt — photographer` so the diff
// is auditable.

const path = require('path');
const fs   = require('fs');

require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) {
  console.error('UNSPLASH_ACCESS_KEY missing in backend/.env');
  console.error('Get one at https://unsplash.com/developers');
  process.exit(1);
}

// Words that strongly suggest the photo is actually a hotel / room / property
// rather than a generic landscape, person, or unrelated subject.
// Broad hotel/interior/architecture vocabulary so we keep results from
// "hotel"-themed searches even when the alt description focuses on a single
// feature like "bed" or "marble" rather than the word "hotel" itself.
const HOTEL_WORDS = [
  'hotel', 'room', 'suite', 'bedroom', 'bed', 'lobby', 'interior',
  'villa', 'lodge', 'cabin', 'bungalow', 'resort', 'inn',
  'pool', 'garden', 'dining', 'restaurant', 'patio', 'terrace', 'balcony',
  'courtyard', 'haveli', 'palace', 'mansion', 'estate', 'fort',
  'pillow', 'sheets', 'linen', 'headboard', 'bathtub', 'bathroom',
  'lounge', 'living room', 'sofa', 'couch', 'chandelier',
  'building', 'house', 'architecture', 'window', 'archway',
];

const SHOOTS = [
  {
    slug:  'marigold-house',
    region:'Rajasthan',
    theme: 'heritage hotel suite',
    rooms: [
      { type: 'Heritage Suite', query: 'heritage hotel bedroom' },
      { type: 'Garden Room',    query: 'boutique hotel bedroom garden' },
      { type: 'Maharaja Suite', query: 'palace hotel suite' },
    ],
  },
  {
    slug:  'aravali-retreat',
    region:'Rajasthan',
    theme: 'forest hotel cabin',
    rooms: [
      { type: 'Pine Cabin',      query: 'cabin bedroom' },
      { type: 'Stargazer Suite', query: 'hotel suite window' },
    ],
  },
  {
    slug:  'casa-pamparo',
    region:'Goa',
    theme: 'boutique villa hotel',
    rooms: [
      { type: 'Pool Suite',  query: 'hotel bedroom pool' },
      { type: 'Garden Room', query: 'hotel bedroom tropical' },
    ],
  },
  {
    slug:  'postcard-munnar',
    region:'Kerala',
    theme: 'mountain resort hotel',
    rooms: [
      { type: 'Tea Cabin',   query: 'mountain hotel bedroom' },
      { type: 'Cloud Suite', query: 'hotel bedroom mountain' },
    ],
  },
  {
    slug:  'the-salt-house',
    region:'Goa',
    theme: 'beach hotel villa',
    rooms: [
      { type: 'Sea Suite',   query: 'hotel bedroom ocean' },
      { type: 'Plunge Room', query: 'hotel bedroom bathtub' },
    ],
  },
  {
    slug:  'silk-route-inn',
    region:'Rajasthan',
    theme: 'heritage hotel sandstone',
    rooms: [
      { type: 'Fort Room',     query: 'heritage hotel bedroom' },
      { type: 'Rooftop Suite', query: 'rooftop hotel bedroom' },
    ],
  },
  {
    slug:  'house-of-cardamom',
    region:'Karnataka',
    theme: 'plantation bungalow hotel',
    rooms: [
      { type: 'Wallace Room',    query: 'colonial hotel bedroom' },
      { type: 'Pepper Suite',    query: 'plantation hotel suite' },
      { type: 'Estate Bungalow', query: 'luxury bungalow bedroom' },
    ],
  },
  {
    slug:  'indigo-lodge',
    region:'Tamil Nadu',
    theme: 'minimalist hotel lodge',
    rooms: [
      { type: 'Earth Cabin',  query: 'minimalist hotel bedroom' },
      { type: 'Indigo Suite', query: 'boutique hotel suite' },
    ],
  },
];

async function search(query, perPage = 15) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape&content_filter=high`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Unsplash ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()).results || [];
}

function looksLikeHotel(photo) {
  const text = `${photo.alt_description || ''} ${photo.description || ''}`.toLowerCase();
  return HOTEL_WORDS.some((w) => text.includes(w));
}

function annotate(photo) {
  const alt = (photo.alt_description || photo.description || 'untitled').replace(/\s+/g, ' ').trim();
  const who = photo.user?.name || photo.user?.username || 'unknown';
  return `${alt} — by ${who}`;
}

async function pickN(query, n, takenIds, label, fallbacks = []) {
  const tryOne = async (q) => {
    const results = await search(q, Math.max(15, n * 3));
    const out = [];
    for (const p of results) {
      if (takenIds.has(p.id)) continue;
      if (!looksLikeHotel(p)) continue;
      out.push(p);
      if (out.length === n) break;
    }
    return { results: results.length, picks: out };
  };

  const queries = [query, ...fallbacks];
  let log = [];
  for (const q of queries) {
    const { results, picks } = await tryOne(q);
    log.push(`${q} (${results}→${picks.length})`);
    if (picks.length === n) {
      picks.forEach((p) => takenIds.add(p.id));
      console.log(`  ${label.padEnd(40)} ${log.join(' · ')}`);
      return picks;
    }
  }
  throw new Error(`Not enough hotel-shaped results for "${label}": tried ${log.join(' · ')}`);
}

async function main() {
  const taken = new Set();
  const entries = [];

  for (const shoot of SHOOTS) {
    console.log(`\n→ ${shoot.slug}`);
    // 5 shots for the hotel — 1 hero (first / most engaged) + 4 gallery
    const propertyShots = await pickN(shoot.theme, 5, taken, `hotel/gallery (${shoot.theme})`, ['boutique hotel', 'hotel interior']);
    const [hero, ...gallery] = propertyShots;
    const rooms = [];
    for (const r of shoot.rooms) {
      const [pick] = await pickN(r.query, 1, taken, `room: ${r.type}`, [shoot.theme, 'hotel bedroom', 'hotel suite']);
      rooms.push({ ...r, photo: pick });
    }
    entries.push({ shoot, hero, gallery, rooms });
  }

  // Emit the manifest in the same shape upload-images.js expects.
  const out = [];
  out.push(`// AUTO-GENERATED by scripts/fetch-hotel-photos.js — do not hand-edit.`);
  out.push(`// Re-run after editing the SHOOTS array in that script. Every entry has`);
  out.push(`// the photo's Unsplash alt description + photographer in the trailing comment`);
  out.push(`// so accuracy is auditable.`);
  out.push(``);
  out.push(`module.exports = [`);
  for (const e of entries) {
    out.push(`  {`);
    out.push(`    slug:   '${e.shoot.slug}',`);
    out.push(`    region: '${e.shoot.region}',`);
    out.push(`    hero:    ${JSON.stringify(e.hero.urls.regular)}, // ${annotate(e.hero)}`);
    out.push(`    gallery: [`);
    for (const g of e.gallery) {
      out.push(`      ${JSON.stringify(g.urls.regular)}, // ${annotate(g)}`);
    }
    out.push(`    ],`);
    out.push(`    rooms: [`);
    for (const r of e.rooms) {
      out.push(`      { type: '${r.type.replace(/'/g, "\\'")}', url: ${JSON.stringify(r.photo.urls.regular)} }, // ${annotate(r.photo)}`);
    }
    out.push(`    ],`);
    out.push(`  },`);
  }
  out.push(`];`);

  const target = path.join(__dirname, 'image-manifest.js');
  fs.writeFileSync(target, out.join('\n') + '\n');
  console.log(`\nWrote ${target} (${entries.length} hotels · ${entries.reduce((n, e) => n + 1 + e.gallery.length + e.rooms.length, 0)} images).`);
}

main().catch((err) => { console.error('\n' + err.message); process.exit(1); });
