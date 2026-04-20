/**
 * Seed script — populates categories and cloth types
 * Run: node prisma/seed.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = [
  {
    name: 'Wedding — Men',
    description: 'Formal and traditional attire for grooms and male wedding guests',
    types: [
      { name: 'Sherwani', description: 'Traditional embroidered long coat for grooms' },
      { name: 'Bandhgala Suit', description: 'Nehru-collar formal suit' },
      { name: 'Indo-Western Suit', description: 'Fusion of Indian and Western formal wear' },
      { name: 'Kurta Pajama (Wedding)', description: 'Silk or embroidered kurta with matching pajama' },
      { name: 'Jodhpuri Suit', description: 'Rajasthani-style formal suit with breeches' },
      { name: 'Achkan', description: 'Long formal coat worn over churidar' },
      { name: 'Dhoti Kurta (Wedding)', description: 'Traditional dhoti with embroidered kurta' },
    ],
  },
  {
    name: 'Wedding — Women',
    description: 'Bridal and formal attire for brides and female wedding guests',
    types: [
      { name: 'Bridal Lehenga', description: 'Heavy embroidered lehenga choli for brides' },
      { name: 'Saree (Bridal)', description: 'Silk or Banarasi saree for weddings' },
      { name: 'Anarkali Suit (Wedding)', description: 'Floor-length embroidered Anarkali' },
      { name: 'Sharara Set', description: 'Flared pants with short kurta and dupatta' },
      { name: 'Gharara Set', description: 'Traditional pleated wide-leg pants with kurta' },
      { name: 'Gown (Bridal)', description: 'Western-style bridal gown' },
      { name: 'Palazzo Suit (Wedding)', description: 'Palazzo pants with embroidered top' },
    ],
  },
  {
    name: 'Ethnic — Men',
    description: 'Everyday and festive Indian ethnic wear for men',
    types: [
      { name: 'Kurta Pajama', description: 'Classic cotton or linen kurta with pajama' },
      { name: 'Pathani Suit', description: 'Afghan-style long kurta with salwar' },
      { name: 'Dhoti Kurta', description: 'Traditional dhoti with plain kurta' },
      { name: 'Nehru Jacket', description: 'Sleeveless jacket worn over kurta' },
      { name: 'Lungi / Mundu', description: 'South Indian traditional wrap' },
    ],
  },
  {
    name: 'Ethnic — Women',
    description: 'Everyday and festive Indian ethnic wear for women',
    types: [
      { name: 'Saree', description: 'Everyday cotton, chiffon, or georgette saree' },
      { name: 'Salwar Kameez', description: 'Classic salwar suit with dupatta' },
      { name: 'Anarkali Suit', description: 'Flared Anarkali kurta with churidar' },
      { name: 'Lehenga Choli', description: 'Festive lehenga for parties and functions' },
      { name: 'Kurti', description: 'Short kurta worn with jeans or leggings' },
      { name: 'Churidar Suit', description: 'Fitted churidar with long kurta' },
    ],
  },
  {
    name: 'Western — Men',
    description: 'Western formal and casual wear for men',
    types: [
      { name: 'Suit (2-piece)', description: 'Classic two-piece formal suit' },
      { name: 'Suit (3-piece)', description: 'Three-piece suit with waistcoat' },
      { name: 'Tuxedo', description: 'Black-tie formal tuxedo' },
      { name: 'Blazer', description: 'Smart casual blazer' },
      { name: 'Chinos & Shirt', description: 'Smart casual chinos with dress shirt' },
      { name: 'Denim Jacket', description: 'Casual denim jacket' },
    ],
  },
  {
    name: 'Western — Women',
    description: 'Western formal and casual wear for women',
    types: [
      { name: 'Evening Gown', description: 'Floor-length formal gown' },
      { name: 'Cocktail Dress', description: 'Knee-length party dress' },
      { name: 'Blazer Set', description: 'Power suit or blazer with trousers' },
      { name: 'Mini Dress', description: 'Short casual or party dress' },
      { name: 'Jumpsuit', description: 'One-piece jumpsuit or romper' },
      { name: 'Maxi Dress', description: 'Long flowing casual or beach dress' },
    ],
  },
  {
    name: 'Party & Festive — Men',
    description: 'Statement pieces for parties, festivals, and events',
    types: [
      { name: 'Printed Shirt', description: 'Bold printed casual shirt' },
      { name: 'Sequin Blazer', description: 'Embellished blazer for parties' },
      { name: 'Linen Shirt Set', description: 'Relaxed linen shirt and trousers' },
    ],
  },
  {
    name: 'Party & Festive — Women',
    description: 'Statement pieces for parties, festivals, and events',
    types: [
      { name: 'Sequin Dress', description: 'Glittery party dress' },
      { name: 'Co-ord Set', description: 'Matching top and bottom set' },
      { name: 'Crop Top & Skirt', description: 'Trendy crop top with midi or mini skirt' },
      { name: 'Bodycon Dress', description: 'Fitted bodycon dress' },
    ],
  },
  {
    name: 'Accessories',
    description: 'Jewellery, bags, footwear, and other accessories',
    types: [
      { name: 'Bridal Jewellery Set', description: 'Necklace, earrings, maang tikka set' },
      { name: 'Statement Necklace', description: 'Bold necklace for parties' },
      { name: 'Clutch / Evening Bag', description: 'Small formal or party bag' },
      { name: 'Heels', description: 'Formal or party heels' },
      { name: 'Mojari / Jutti', description: 'Traditional Indian footwear' },
      { name: 'Dupatta / Stole', description: 'Embroidered or printed dupatta' },
      { name: 'Turban / Safa', description: 'Groom or festive turban' },
    ],
  },
  {
    name: 'Casual — Unisex',
    description: 'Everyday casual wear for all genders',
    types: [
      { name: 'T-Shirt', description: 'Plain or graphic tee' },
      { name: 'Hoodie / Sweatshirt', description: 'Casual hoodie or sweatshirt' },
      { name: 'Jacket', description: 'Casual jacket or bomber' },
      { name: 'Jeans', description: 'Denim jeans' },
      { name: 'Shorts', description: 'Casual shorts' },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding categories and cloth types...\n');

  for (const cat of data) {
    // Upsert category
    const existing = await prisma.category.findFirst({ where: { name: cat.name } });
    const category = existing
      ? existing
      : await prisma.category.create({ data: { name: cat.name, description: cat.description } });

    console.log(`✅ Category: ${category.name}`);

    for (const type of cat.types) {
      const existingType = await prisma.clothType.findFirst({
        where: { name: type.name, categoryId: category.id },
      });
      if (!existingType) {
        await prisma.clothType.create({
          data: { name: type.name, description: type.description, categoryId: category.id },
        });
        console.log(`   + ${type.name}`);
      } else {
        console.log(`   ~ ${type.name} (already exists)`);
      }
    }
  }

  console.log('\n✨ Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
