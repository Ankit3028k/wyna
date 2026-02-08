const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: 1000,
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
   
    features: [
      {
        type: String,
      },
    ],
    material: {
      type: String,
      trim: true,
    },
    weaveType: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    pattern: {
      type: String,
      trim: true,
    },
    length: {
      type: String,
      trim: true,
    },
    width: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    careInstructions: {
      type: String,
      maxlength: 500,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    customizable: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
productSchema.pre("save", async function (next) {
  if (this.isModified("name") || !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug exists and make it unique
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }

  // Generate SKU if not provided
  if (!this.sku) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5);
    this.sku = `SKU-${timestamp}-${random}`.toUpperCase();
  }

  next();
});

// Virtual for getting the first image URL
productSchema.virtual("image").get(function () {
  return this.images && this.images.length > 0 ? this.images[0].url : null;
});

// Ensure virtual fields are serialized
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
