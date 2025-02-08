import Product from "../db/Product";
import { productSchema } from "../validation/types";

export const getProductsController = async (req, res) => {
  try {
    const products = await Product.find({});
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (err) {
      res.status(500).json({ message: err.message || "Server error"});
  }
};

export const getProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const createProductController = async (req, res) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const newProduct = new Product(validatedData);
    await newProduct.save()
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message || "Validation error" });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const updatedProductSchema = productSchema.omit({ user: true }).partial();
    const updateddetails = updatedProductSchema.parse(req.body);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateddetails,
      {new: true, runValidators: true}
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message || "Validation error" });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(!product) {
      return res.status(404).json({message: "Product not found"});
    }
    await product.deleteOne();
    res.status(200).json({message: "Product removed"});
  } catch (err) {
    res.status(500).json({message: err.message || "Server error"});
  }
};