const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample categories for sarees
const categories = [
  {
    name: 'Banarasi Silk',
    description: 'Traditional Banarasi silk sarees with intricate gold and silver work',
    image: '/Asset/product/1 (1).jpeg',
    featured: true,
    sortOrder: 1
  },
  {
    name: 'Kanjeevaram Silk',
    description: 'Rich South Indian Kanjeevaram silk sarees with temple borders',
    image: '/Asset/product/1 (8).jpeg',
    featured: true,
    sortOrder: 2
  },
  {
    name: 'Chantilly Lace',
    description: 'Delicate Chantilly lace sarees with floral motifs',
    image: '/Asset/product/1 (11).jpeg',
    featured: true,
    sortOrder: 3
  },
  {
    name: 'Organza',
    description: 'Lightweight organza sarees perfect for summer wear',
    image: '/Asset/product/1 (5).jpeg',
    featured: false,
    sortOrder: 4
  },
  {
    name: 'Georgette',
    description: 'Flowing georgette sarees with beautiful prints',
    image: '/Asset/product/1 (10).jpeg',
    featured: false,
    sortOrder: 5
  }
];

// Sample products
const products = [
  {
    name: 'Oranza Silk Saree',
    description: 'Exquisite handwoven saree with traditional golden zari work. Perfect for weddings and special occasions.',
    shortDescription: 'Premium handwoven saree with golden zari work',
    price: 2799,
    discountPrice: 2499,
    category: '', // Will be populated
    stock: 15,
    material: 'Pure Silk',
    weaveType: 'Handloom',
    color: 'Golden',
    pattern: 'Floral Zari Work',
    length: '5.5 meters',
    width: '44 inches',
    weight: 'Lightweight',
    careInstructions: 'Dry clean only. Store in muslin cloth. Avoid direct sunlight.',
    tags: ['wedding', 'banarasi', 'gold', 'traditional'],
    featured: true,
    newArrival: true,
    customizable: true,
    status: 'published'
  },
  {
    name: 'WYNA Premium Silk',
    description: 'Pure silk masterpiece with intricate meenakari patterns. Handcrafted with love by skilled artisans.',
    shortDescription: 'Pure silk saree with meenakari patterns',
    price: 2099,
    category: '',
    stock: 12,
    material: 'Pure Silk',
    weaveType: 'Handloom',
    color: 'Multicolor',
    pattern: 'Meenakari Work',
    length: '5.5 meters',
    width: '44 inches',
    weight: 'Medium',
    careInstructions: 'Dry clean recommended. Iron on reverse side.',
    tags: ['premium', 'meenakari', 'multicolor', 'exclusive'],
    featured: true,
    newArrival: true,
    customizable: true,
    status: 'published'
  },
  {
    name: 'Premium Muslin Silk',
    description: 'Heritage weave with antique gold zari borders. Timeless elegance for the modern woman.',
    shortDescription: 'Heritage weave with antique gold borders',
    price: 2099,
    discountPrice: 1899,
    category: '',
    stock: 8,
    material: 'Muslin Silk',
    weaveType: 'Handloom',
    color: 'Cream',
    pattern: 'Gold Border',
    length: '5.5 meters',
    width: '44 inches',
    weight: 'Lightweight',
    careInstructions: 'Gentle dry cleaning. Store properly to maintain texture.',
    tags: ['muslin', 'gold', 'heritage', 'lightweight'],
    featured: true,
    newArrival: false,
    customizable: false,
    status: 'published'
  },
  {
    name: 'Pure Katan Silk',
    description: 'Royal blue silk with golden paisley motifs and ornate border. Regal and sophisticated.',
    shortDescription: 'Royal blue silk with golden paisley motifs',
    price: 3799,
    category: '',
    stock: 6,
    material: 'Katan Silk',
    weaveType: 'Handloom',
    color: 'Royal Blue',
    pattern: 'Paisley Motifs',
    length: '5.5 meters',
    width: '44 inches',
    weight: 'Heavy',
    careInstructions: 'Professional dry cleaning required. Handle with care.',
    tags: ['katan', 'royal', 'blue', 'paisley', 'luxury'],
    featured: true,
    newArrival: true,
    customizable: true,
    status: 'published'
  },
  {
    name: 'Banarasi Bridal Silk',
    description: 'Luxurious bridal saree with heavy embroidery and embellishments. Perfect for your special day.',
    shortDescription: 'Luxurious bridal saree with heavy embroidery',
    price: 3999,
    discountPrice: 3499,
    category: '',
    stock: 4,
    material: 'Pure Silk',
    weaveType: 'Handloom',
    color: 'Red Gold',
    pattern: 'Heavy Embroidery',
    length: '5.5 meters',
    width: '44 inches',
    weight: 'Heavy',
    careInstructions: 'Professional cleaning only. Store in silk pouch.',
    tags: ['bridal', 'heavy', 'embroidery', 'wedding'],
    featured: false,
    newArrival: true,
    customizable: true,
    status: 'published'
  },
  {
    name: 'WYNA Special Pashmina Silk',
    description: 'Premium pashmina silk blend with soft texture and elegant drape. Ultimate luxury.',
    shortDescription: 'Premium pashmina silk blend with soft texture',
    price: 4999,
    category: '',
    stock: 3,
    material: 'Pashmina Silk',
    weaveType: 'Handloom',
    color: 'Ivory',
    pattern: 'Plain with Border',
    length: '5.5 meters',
    width: '44 inches',
    weight: 'Ultra-light',
    careInstructions: 'Specialized dry cleaning. Professional handling required.',
    tags: ['pashmina', 'luxury', 'ivory', 'exclusive'],
    featured: false,
    newArrival: true,
    customizable: true,
    status: 'published'
  }
];

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@wyna.com',
  password: 'admin123',
  phone: '9876543210',
  role: 'admin',
  emailVerified: true
};

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany({ email: { $ne: 'admin@wyna.com' } });
    
    console.log('Existing data cleared...');
    
    // Insert categories one by one to ensure slug generation
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = new Category(categoryData);
      const savedCategory = await category.save();
      createdCategories.push(savedCategory);
    }
    console.log(`${createdCategories.length} categories inserted...`);
    
    // Map categories to products
    const banarasiCategory = createdCategories.find(cat => cat.name === 'Banarasi Silk');
    const kanjeevaramCategory = createdCategories.find(cat => cat.name === 'Kanjeevaram Silk');
    const chantillyCategory = createdCategories.find(cat => cat.name === 'Chantilly Lace');
    
    // Assign categories to products and add images
    products.forEach((product, index) => {
      if (index < 2) {
        product.category = banarasiCategory._id;
      } else if (index < 4) {
        product.category = kanjeevaramCategory._id;
      } else {
        product.category = chantillyCategory._id;
      }
      
      // Add images
      product.images = [
        {
          url: `/Asset/product/1 (${index + 1}).jpeg`,
          alt: product.name,
          isPrimary: true
        }
      ];
      
      // Generate SKU
      const categoryPrefix = product.category === banarasiCategory._id ? 'BAN' :
                           product.category === kanjeevaramCategory._id ? 'KAN' : 'CHA';
      const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      product.sku = `${categoryPrefix}${randomNumber}`;
    });
    
    // Insert products one by one to ensure slug generation
    const createdProducts = [];
    for (const productData of products) {
      const product = new Product(productData);
      const savedProduct = await product.save();
      createdProducts.push(savedProduct);
    }
    console.log(`${createdProducts.length} products inserted...`);
    
    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@wyna.com' });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log('Admin user created...');
    } else {
      console.log('Admin user already exists...');
    }
    
    console.log('Seeding completed successfully!');
    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Products: ${createdProducts.length}`);
    console.log('Admin Credentials:');
    console.log('- Email: admin@wyna.com');
    console.log('- Password: admin123');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit();
  }
};

// Run the seeder
if (process.argv[2] === '-d') {
  // Destroy data
  const destroyData = async () => {
    try {
      await connectDB();
      await Product.deleteMany();
      await Category.deleteMany();
      await User.deleteMany({ email: { $ne: 'admin@wyna.com' } });
      console.log('Data destroyed...');
      process.exit();
    } catch (error) {
      console.error('Error destroying data:', error);
      process.exit(1);
    }
  };
  destroyData();
} else {
  seedData();
}