import { z } from "zod";

export const loginSchema = z.object({
  pin: z.string().min(4, { message: "Pin should contain 4 digits" }),
});

export const categorySchema = z.object({
  categoryName: z.string()
    .refine((value) => /^[a-zA-Z ]{1,60}$/.test(value ?? ""), "Must contain 1-60 alphabetical characters (spaces are allowed)"),
});

export const menuItemSchema = z.object({
  itemName: z.string()
    .min(2, { message: "Name should have at least 2 characters" })
    .max(60, { message: "Name can't be longer than 60 characters" }),

  itemPrice: z.number()
    .min(0, { message: "Price can't be empty" })
    .lte(100000, { message: "Price must be less than 100,000" })
    .multipleOf(0.01, { message: "Price must only contain 2 decimal places" }),

  itemDescription: z.string()
    .min(1, { message: "Description can't be empty" })
    .max(255, { message: "Description can't be longer than 255 characters" }),

  itemAvailable: z.boolean(),
  itemCategories: z.array(z.string()).min(1, { message: "Should at least pick 1 category" }),
  itemIngredients: z.array(z.string()).optional(),
  itemTags: z.array(z.string()).optional(),
});

export const orderItemSchema = z.object({
  itemQuantity: z.number()
    .min(1, { message: "Quantity can't be empty or less than 0" })
    .lte(100000, { message: "Quantity must be less than 100,000" })
    .multipleOf(1, { message: "Quantity can't be a decimal number" }),

  itemOptionalRequest: z.string()
    .max(255, { message: "Optional request can't be longer than 255 characters" }),
});
