import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(6),
});

export const productSchema = z.object({
  user: z.string().min(1, "User ID is required"), // Assuming user ID is a string (MongoDB ObjectId as a string)
  name: z.string().min(1, "Name is required"),
  image: z.string().min(1, "Image URL is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be at least 0"),
  countInStock: z.number().min(0, "Stock count must be at least 0"),
});

export const orderSchema = z.object({
    orderItems: z.array(
      z.object({
        name: z.string().min(1, "Product name is required"),
        qty: z.number().int().positive("Quantity must be greater than 0"),
        image: z.string().url("Invalid image URL"),
        price: z.number().positive("Price must be greater than 0"),
        product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),
      })
    ).nonempty("Order must contain at least one item"),
    
    shippingAddress: z.object({
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      postalCode: z.string().min(1, "Postal code is required"),
      country: z.string().min(1, "Country is required"),
    }),
    
    paymentMethod: z.string().min(1, "Payment method is required"),
    
    totalPrice: z.number().positive("Total price must be greater than 0"),
  });
  
