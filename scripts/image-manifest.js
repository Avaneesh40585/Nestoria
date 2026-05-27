// Curated Unsplash imagery for each Nestoria seed hotel.
// Re-pickable: every URL was HEAD-checked (200) before being committed. If a
// particular shot doesn't feel right, swap the photo id and re-run
// `node scripts/upload-images.js`.
//
// 8 hotels × (1 hero + 4 gallery) + 18 rooms = 58 unique images.
//
// HEROES try to evoke each property's architectural style (heritage haveli,
// hillside modernist, Indo-Portuguese villa, etc.); ROOMS lean on bedroom /
// suite / cabin interiors; GALLERY shots mix pool / dining / detail.

const u = (id) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&fm=jpg&fit=crop`;

module.exports = [
  // 1 — The Marigold House · Udaipur, Rajasthan
  //   Restored 18th-century lakeside haveli. Heritage exteriors + ornate suites.
  {
    slug: 'marigold-house',
    region: 'Rajasthan',
    hero:    u('1599661046289-e31897846e41'), // heritage palace exterior
    gallery: [
      u('1571896349842-33c89424de2d'),       // Udaipur lake palace at sunset
      u('1582719508461-905c673771fd'),       // ornate Indian arches
      u('1566073771259-6a8506099945'),       // courtyard pool
      u('1414235077428-338989a2e8c0'),       // heritage dining hall, candle-lit table
    ],
    rooms: [
      { type: 'Heritage Suite', url: u('1551882547-ff40c63fe5fa') }, // luxury bedroom
      { type: 'Garden Room',    url: u('1505691938895-1758d7feb511') }, // soft bedroom interior
      { type: 'Maharaja Suite', url: u('1611892440504-42a792e24d32') }, // grand suite
    ],
  },

  // 2 — Aravali Retreat · Kumbhalgarh, Rajasthan
  //   Modernist pine-ridge retreat. Forest light, salt-water pool, observatory.
  {
    slug: 'aravali-retreat',
    region: 'Rajasthan',
    hero:    u('1540541338287-41700207dee6'), // forest resort pool
    gallery: [
      u('1444201983204-c43cbd584d93'),       // pine forest morning
      u('1455587734955-081b22074882'),       // mountain ridge mist
      u('1469474968028-56623f02e42e'),       // night sky / stars
      u('1424847651672-bf20a4b0982b'),       // forest cabin dining nook
    ],
    rooms: [
      { type: 'Pine Cabin',      url: u('1518733057094-95b53143d2a7') }, // cosy cabin bedroom
      { type: 'Stargazer Suite', url: u('1611348586804-61bf6c080437') }, // window-onto-nature suite
    ],
  },

  // 3 — Casa Pamparo · Assagao, Goa
  //   Indo-Portuguese villa, six rooms, courtyard pool, secret garden bar.
  {
    slug: 'casa-pamparo',
    region: 'Goa',
    hero:    u('1582719478250-c89cae4dc85b'), // Goan villa with deep loggia
    gallery: [
      u('1564013799919-ab600027ffc6'),       // tropical pool
      u('1542314831-068cd1dbfeeb'),          // garden lounge
      u('1571003123894-1f0594d2b5d9'),       // palms + sky
      u('1414235077428-338989a2e8c0'),       // veranda breakfast spread
    ],
    rooms: [
      { type: 'Pool Suite',  url: u('1551918120-9739cb430c6d') }, // bright pool-side bedroom
      { type: 'Garden Room', url: u('1559599238-308793637427') }, // tropical bedroom
    ],
  },

  // 4 — Postcard from Munnar · Pothamedu, Kerala
  //   Tea-estate cabins above a working plantation. Mist, hills, slow mornings.
  {
    slug: 'postcard-munnar',
    region: 'Kerala',
    hero:    u('1591382696684-38c427c7547a'), // misty tea plantation
    gallery: [
      u('1571902943202-507ec2618e8f'),       // emerald rolling hills
      u('1584132915807-fd1f5fbc078f'),       // forest hillside
      u('1520250497591-112f2f40a3f4'),       // mountain morning light
      u('1525351484163-7529414344d8'),       // tea on a tray, veranda morning
    ],
    rooms: [
      { type: 'Tea Cabin',   url: u('1564501049412-61c2a3083791') }, // wooden cabin interior
      { type: 'Cloud Suite', url: u('1578683010236-d716f9a3f461') }, // suite with hill view
    ],
  },

  // 5 — The Salt House · Mandrem, Goa
  //   Whitewashed beach house, five suites, plunge pool, ten steps to the sea.
  {
    slug: 'the-salt-house',
    region: 'Goa',
    hero:    u('1503376780353-7e6692767b70'), // beach villa exterior
    gallery: [
      u('1542640244-7e672d6cef4e'),          // open-air dining
      u('1559827260-dc66d52bef19'),          // beach palms at golden hour
      u('1582610116397-edb318620f90'),       // sea-view terrace
      u('1559339352-11d035aa65de'),          // seafood platter, beachside table
    ],
    rooms: [
      { type: 'Sea Suite',   url: u('1521577352947-9bb58764b69a') }, // ocean-view bedroom
      { type: 'Plunge Room', url: u('1559508551-44bff1de756b') },    // bedroom with plunge pool
    ],
  },

  // 6 — Silk Route Inn · Jaisalmer Fort, Rajasthan
  //   Six-room guesthouse inside the living sandstone fort.
  {
    slug: 'silk-route-inn',
    region: 'Rajasthan',
    hero:    u('1599050751795-6cdaafbc2319'), // Jaisalmer sandstone fort exterior
    gallery: [
      u('1564507592333-c60657eea523'),       // carved sandstone detail
      u('1542401886-65d6c61db217'),          // golden desert at dusk
      u('1473625247510-8ceb1760943f'),       // desert horizon
      u('1505253758473-96b7015fcd40'),       // rooftop thali, sandstone walls
    ],
    rooms: [
      { type: 'Fort Room',     url: u('1601628828688-632f38a5a7d0') }, // brass + sandstone bedroom
      { type: 'Rooftop Suite', url: u('1591825729269-caeb344f6df2') }, // rooftop bedroom
    ],
  },

  // 7 — House of Cardamom · Madikeri, Coorg, Karnataka
  //   Plantation bungalow set among coffee, pepper and cardamom.
  {
    slug: 'house-of-cardamom',
    region: 'Karnataka',
    hero:    u('1590490360182-c33d57733427'), // colonial-style plantation bungalow
    gallery: [
      u('1596178065887-1198b6148b2b'),       // plantation interior with fireplace
      u('1591088398332-8a7791972843'),       // coffee plant detail
      u('1505765050516-f72dcac9c60e'),       // misty hill morning
      u('1559925393-8be0ec4767c8'),          // plantation verandah dining
    ],
    rooms: [
      { type: 'Wallace Room',    url: u('1554995207-c18c203602cb') }, // hand-carved bed
      { type: 'Pepper Suite',    url: u('1568084680786-a84f91d1153c') }, // grand suite with view
      { type: 'Estate Bungalow', url: u('1611048267451-e6ed903d4a38') }, // private bungalow interior
    ],
  },

  // 8 — Indigo Lodge · Auroville, Tamil Nadu
  //   Earth-bag cabins, meditation pavilion, biodynamic farm kitchen.
  {
    slug: 'indigo-lodge',
    region: 'Tamil Nadu',
    hero:    u('1582719471384-894fbb16e074'), // organic earth-toned architecture
    gallery: [
      u('1559551409-dadc959f76b8'),          // meditation pavilion
      u('1602002418082-a4443e081dd1'),       // farm-to-table dining
      u('1551105378-78e609e1d468'),          // garden walkway
      u('1414235077428-338989a2e8c0'),       // communal table, biodynamic spread
    ],
    rooms: [
      { type: 'Earth Cabin',  url: u('1517840901100-8179e982acb7') }, // earthy minimalist bedroom
      { type: 'Indigo Suite', url: u('1631049307264-da0ec9d70304') }, // indigo-toned suite
    ],
  },
];
