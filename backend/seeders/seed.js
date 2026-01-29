const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

const categories = [
  {
    name: "Corporate Gifting",
    description:
      "Premium corporate gifts for clients, employees, and business partners",
    image: "/images/categories/corporate-gifting.jpg",
  },
  {
    name: "Gift Hampers",
    description: "Thoughtfully curated gift hampers for various occasions",
    image: "/images/categories/gift-hampers.jpg",
  },
  {
    name: "Wedding Boxes / Customized Boxes",
    description: "Custom wedding boxes and personalized gift packaging",
    image: "/images/categories/wedding-boxes.jpg",
  },
  {
    name: "Diwali Gifts",
    description: "Traditional and modern Diwali gift collections",
    image: "/images/categories/diwali-gifts.jpg",
  },
  {
    name: "New Year / Christmas Gifts",
    description: "Festive gifts for New Year and Christmas celebrations",
    image: "/images/categories/christmas-gifts.jpg",
  },
  {
    name: "Antique Gifts",
    description: "Vintage and antique-inspired gift items",
    image: "/images/categories/antique-gifts.jpg",
  },
];

const products = [
  // Corporate Gifting (3 products)
  {
    name: "Corporate Gift Hamper (H-102)",
    description:
      "Premium Corporate Gift Hamper – Customizable with Your Logo. Create a lasting impression with this thoughtfully designed corporate hamper that blends elegance with everyday utility. This premium set includes: A sleek notebook for capturing ideas and daily notes, A metallic pen that adds sophistication to every signature, A stylish card holder to keep business contacts organized, A durable keychain for everyday use. Presented in a modern, professional box, this hamper is more than just a gift – it is a gesture of appreciation and trust.",
    price: 2500,
    category: "Corporate Gifting",
    stock: 50,
    features: [
      "Custom branding with your company logo",
      "High-quality materials designed to impress",
      "Ideal for clients, employees, partners, festive gifting, and corporate events",
    ],
    customizable: true,
    images: [
      {
        url: "/images/products/h-102-1.jpg",
        alt: "Corporate Gift Hamper H-102",
      },
      {
        url: "/images/products/h-102-2.jpg",
        alt: "Corporate Gift Hamper H-102 - Contents",
      },
    ],
  },
  {
    name: "Digital Standee (H-101)",
    description:
      "First impressions matter – and that's exactly what this sleek digital display stand is designed for. Whether you're welcoming guests at an event, showcasing your brand in a luxury showroom, or creating that Instagram-worthy corner in your store, this premium stand does it all with elegance. Crafted with a minimal yet modern frame, it features a bright digital screen that makes your logo, promotions, or brand message pop. The clean design ensures that your brand stays the hero, while the sturdy build guarantees reliability at high-footfall venues.",
    price: 15000,
    category: "Corporate Gifting",
    stock: 10,
    features: [
      "Stand-out Branding – Catch attention instantly with vibrant digital visuals",
      "Luxury Finish – Designed to complement premium interiors and upscale events",
      "Versatile Use – Perfect for exhibitions, events, receptions, retail showrooms, and award functions",
      "Plug & Play – Easy setup so you can focus on engaging your audience",
    ],
    customizable: true,
    images: [
      { url: "/images/products/h-101-1.jpg", alt: "Digital Standee H-101" },
      {
        url: "/images/products/h-101-2.jpg",
        alt: "Digital Standee H-101 - Side View",
      },
    ],
  },
  {
    name: "Executive Desk Set",
    description:
      "Elevate any workspace with this luxurious executive desk set. Perfect for corporate gifting to senior management and valued clients. Includes premium leather desk pad, gold-plated pen holder, business card stand, and a sophisticated desk clock.",
    price: 4500,
    category: "Corporate Gifting",
    stock: 30,
    features: [
      "Genuine leather desk accessories",
      "Gold-plated metal finishes",
      "Customizable with company logo",
      "Elegant gift packaging included",
    ],
    customizable: true,
    images: [
      { url: "/images/products/exec-desk-1.jpg", alt: "Executive Desk Set" },
    ],
  },

  // Gift Hampers (3 products)
  {
    name: "Luxury Gourmet Hamper",
    description:
      "Indulge in a curated selection of premium gourmet treats. This luxury hamper includes imported chocolates, exotic dry fruits, artisan cookies, premium tea collection, and honey. Beautifully packaged in an elegant wicker basket with decorative ribbon.",
    price: 3500,
    category: "Gift Hampers",
    stock: 40,
    features: [
      "Premium imported products",
      "Elegant wicker basket packaging",
      "Perfect for all occasions",
      "Includes personalized greeting card",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/gourmet-hamper-1.jpg",
        alt: "Luxury Gourmet Hamper",
      },
    ],
  },
  {
    name: "Wellness & Spa Hamper",
    description:
      "A rejuvenating collection of premium spa essentials. Features aromatic candles, essential oils, luxury bath salts, handmade soaps, face masks, and a plush towel set. Ideal for self-care and pampering.",
    price: 2800,
    category: "Gift Hampers",
    stock: 35,
    features: [
      "All-natural and organic products",
      "Aromatherapy benefits",
      "Eco-friendly packaging",
      "Suitable for all skin types",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/spa-hamper-1.jpg",
        alt: "Wellness & Spa Hamper",
      },
    ],
  },
  {
    name: "Sweet Treats Hamper",
    description:
      "A delightful assortment of traditional and modern sweets. Includes premium mithai, chocolate truffles, cookies, dry fruits, and festive treats. Perfect for celebrations and gifting during festivals.",
    price: 2200,
    category: "Gift Hampers",
    stock: 60,
    features: [
      "Fresh and hygienic preparation",
      "Mix of traditional and contemporary sweets",
      "Beautiful decorative packaging",
      "Long shelf life products",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/sweet-hamper-1.jpg",
        alt: "Sweet Treats Hamper",
      },
    ],
  },

  // Wedding Boxes / Customized Boxes (3 products)
  {
    name: "Royal Wedding Gift Box",
    description:
      "An exquisite wedding gift box featuring intricate traditional designs. Includes compartments for sweets, dry fruits, and gifts. Finished with premium velvet lining and golden embellishments. Perfect for wedding favors and shagun.",
    price: 1500,
    category: "Wedding Boxes / Customized Boxes",
    stock: 100,
    features: [
      "Handcrafted traditional designs",
      "Premium velvet and silk material",
      "Customizable with names and dates",
      "Available in multiple colors",
    ],
    customizable: true,
    images: [
      {
        url: "/images/products/royal-wedding-box-1.jpg",
        alt: "Royal Wedding Gift Box",
      },
    ],
  },
  {
    name: "Elegant Trousseau Box",
    description:
      "Spacious and beautifully designed trousseau box with multiple compartments. Features mirror work, traditional embroidery, and durable construction. Ideal for storing jewelry, cosmetics, and precious items.",
    price: 3200,
    category: "Wedding Boxes / Customized Boxes",
    stock: 25,
    features: [
      "Multiple storage compartments",
      "Mirror and embroidery work",
      "Sturdy and long-lasting",
      "Lock and key included",
    ],
    customizable: true,
    images: [
      {
        url: "/images/products/trousseau-box-1.jpg",
        alt: "Elegant Trousseau Box",
      },
    ],
  },
  {
    name: "Personalized Gift Box Set",
    description:
      "Customizable gift boxes perfect for wedding favors and corporate events. Available in various sizes and colors. Can be personalized with names, logos, or messages. High-quality cardboard with elegant finishes.",
    price: 800,
    category: "Wedding Boxes / Customized Boxes",
    stock: 200,
    features: [
      "Fully customizable design",
      "Multiple size options",
      "Eco-friendly materials",
      "Quick turnaround time",
    ],
    customizable: true,
    images: [
      {
        url: "/images/products/custom-box-1.jpg",
        alt: "Personalized Gift Box Set",
      },
    ],
  },

  // Diwali Gifts (3 products)
  {
    name: "Premium Diwali Hamper",
    description:
      "Celebrate the festival of lights with this grand Diwali hamper. Includes decorative diyas, premium dry fruits, traditional sweets, Lakshmi-Ganesh idol, decorative rangoli, and festive candles. Beautifully packaged in traditional design.",
    price: 4200,
    category: "Diwali Gifts",
    stock: 80,
    features: [
      "Complete Diwali celebration pack",
      "Traditional and premium items",
      "Elegant festive packaging",
      "Perfect for corporate and personal gifting",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/diwali-premium-1.jpg",
        alt: "Premium Diwali Hamper",
      },
    ],
  },
  {
    name: "Silver Lakshmi Ganesh Coin Set",
    description:
      "Auspicious pure silver coins featuring Goddess Lakshmi and Lord Ganesh. Comes in an elegant velvet box with certificate of authenticity. Perfect for Diwali puja and gifting to bring prosperity and blessings.",
    price: 5500,
    category: "Diwali Gifts",
    stock: 50,
    features: [
      "99.9% pure silver",
      "Certificate of authenticity",
      "Premium velvet gift box",
      "Ideal for puja and investment",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/silver-coin-1.jpg",
        alt: "Silver Lakshmi Ganesh Coin Set",
      },
    ],
  },
  {
    name: "Designer Diya Gift Set",
    description:
      "Handcrafted decorative diyas with intricate designs and vibrant colors. Set of 6 brass diyas with traditional patterns. Includes wicks and decorative tray. Perfect for home decoration and gifting during Diwali.",
    price: 1800,
    category: "Diwali Gifts",
    stock: 120,
    features: [
      "Handcrafted brass diyas",
      "Traditional designs with modern touch",
      "Reusable and eco-friendly",
      "Comes with decorative tray",
    ],
    customizable: false,
    images: [
      { url: "/images/products/diya-set-1.jpg", alt: "Designer Diya Gift Set" },
    ],
  },

  // New Year / Christmas Gifts (3 products)
  {
    name: "Christmas Joy Hamper",
    description:
      "Spread Christmas cheer with this festive hamper. Includes premium chocolates, Christmas cookies, festive wine, decorative ornaments, Santa figurine, and holiday-themed treats. Wrapped in festive red and gold packaging.",
    price: 3800,
    category: "New Year / Christmas Gifts",
    stock: 70,
    features: [
      "Premium imported products",
      "Festive decorations included",
      "Perfect for family and friends",
      "Beautifully wrapped",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/christmas-joy-1.jpg",
        alt: "Christmas Joy Hamper",
      },
    ],
  },
  {
    name: "New Year Celebration Box",
    description:
      "Ring in the new year with style! Features premium champagne, gourmet snacks, party poppers, decorative items, 2026 planner, and motivational cards. Perfect for celebrations and corporate gifting.",
    price: 4500,
    category: "New Year / Christmas Gifts",
    stock: 60,
    features: [
      "Premium celebration items",
      "Party accessories included",
      "2026 planner and organizer",
      "Luxury gift packaging",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/new-year-box-1.jpg",
        alt: "New Year Celebration Box",
      },
    ],
  },
  {
    name: "Winter Warmth Gift Set",
    description:
      "Cozy winter essentials perfect for the holiday season. Includes premium wool scarf, leather gloves, hot chocolate mix, aromatic candles, and a beautiful coffee mug. Wrapped in elegant winter-themed packaging.",
    price: 2900,
    category: "New Year / Christmas Gifts",
    stock: 45,
    features: [
      "Premium winter accessories",
      "High-quality materials",
      "Unisex gift suitable for all",
      "Elegant winter packaging",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/winter-warmth-1.jpg",
        alt: "Winter Warmth Gift Set",
      },
    ],
  },

  // Antique Gifts (3 products)
  {
    name: "Vintage Brass Showpiece Collection",
    description:
      "Exquisite collection of antique brass artifacts. Includes traditional oil lamps, decorative bells, vintage figurines, and ornate containers. Each piece is handcrafted with intricate designs, perfect for home décor and collectors.",
    price: 6500,
    category: "Antique Gifts",
    stock: 20,
    features: [
      "Authentic antique designs",
      "Handcrafted solid brass",
      "Unique collector's items",
      "Certificate of authenticity",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/brass-antique-1.jpg",
        alt: "Vintage Brass Showpiece Collection",
      },
    ],
  },
  {
    name: "Heritage Wall Clock",
    description:
      "Stunning vintage-style wall clock with Roman numerals and ornate frame. Features brass pendulum and intricate carved wooden frame. Battery-operated with silent movement. A timeless piece that adds elegance to any space.",
    price: 4800,
    category: "Antique Gifts",
    stock: 15,
    features: [
      "Vintage design with modern mechanism",
      "Ornate carved wooden frame",
      "Silent quartz movement",
      "Perfect for traditional interiors",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/heritage-clock-1.jpg",
        alt: "Heritage Wall Clock",
      },
    ],
  },
  {
    name: "Antique Jewelry Box",
    description:
      "Beautiful vintage-style jewelry box with intricate carvings and mirror work. Features multiple compartments, velvet lining, and brass fittings. Hand-painted with traditional motifs. Perfect for storing precious jewelry and keepsakes.",
    price: 3500,
    category: "Antique Gifts",
    stock: 30,
    features: [
      "Hand-carved wooden design",
      "Mirror and brass work",
      "Velvet-lined compartments",
      "Traditional hand-painted motifs",
    ],
    customizable: false,
    images: [
      {
        url: "/images/products/antique-jewelry-box-1.jpg",
        alt: "Antique Jewelry Box",
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log("Cleared existing data");

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log("Categories seeded successfully");

    // Create products with category references
    const productsWithCategories = products.map((product) => ({
      ...product,
      category: createdCategories.find((cat) => cat.name === product.category)
        ._id,
    }));

    await Product.insertMany(productsWithCategories);
    console.log("Products seeded successfully");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
