import { z } from "zod";

export const loginSchema = z.object({
  pin: z.string().min(4, { message: "Pin should contain 4 digits" }),
});

export const categorySchema = z.object({
  categoryName: z.string().refine((value) => /^[a-zA-Z ]{1,60}$$/.test(value ?? ""), "Must contain 1-60 alphabetical characters (spaces are allowed)"),
});

export const menuItemSchema = z.object({
  itemName: z.string().min(2, { message: "Name should have at least 2 letters" }),
  itemPrice: z.number().min(0, { message: "Price can't be empty" }),
  itemDescription: z.string().min(1, { message: "Description can't be empty" }),
  itemAvailable: z.boolean(),
  itemCategories: z.array(z.string()).min(1, { message: "Should at least pick 1 category" }),
  itemIngredients: z.array(z.string()).optional(),
  itemTags: z.array(z.string()).optional(),
});
