"use client";

import { useEffect, useState } from "react";
import { FileButton, Flex, LoadingOverlay, Modal, MultiSelect, NumberInput, Stack, Switch, TagsInput, Textarea, TextInput, Button, Group, Image } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import toast from "react-hot-toast";
import { z } from "zod";

import { AddMenuItemModalProps } from "@/models";
import { addMenuItem } from "@/services";

const schema = z.object({
  itemName: z.string().min(2, { message: "Name should have at least 2 letters" }),
  itemPrice: z.number().min(0, { message: "Price can't be empty" }),
  itemDescription: z.string().min(1, { message: "Description can't be empty" }),
  itemAvailable: z.boolean(),
  itemCategories: z.array(z.string()).min(1, { message: "Should at least pick 1 category" }),
  itemIngredients: z.array(z.string()).optional(),
  itemTags: z.array(z.string()).optional(),
});

export function AddMenuItemModal({ category, categoryList, isOpened, isLoading, onClose, onSubmit }: AddMenuItemModalProps) {
  const [itemCategories, setItemCategories] = useState([] as string[]);
  const [itemImage, setItemImage] = useState<string | undefined>();

  const form = useForm({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      itemName: "",
      itemPrice: 0,
      itemDescription: "",
      itemCategories: [category.category_name] as string[],
      itemAvailable: true,
      itemIngredients: [] as string[],
      itemTags: [] as string[],
    },
  });

  const handleAddMenuItem = () => {
    const cleanedUpMenuItemFields = {
      menuitem_name: form.values.itemName.trim(),
      cost: form.values.itemPrice,
      description: form.values.itemDescription.trim(),
      available: form.values.itemAvailable,
      category: categoryList.filter(c => itemCategories.includes(c.category_name)).map(c => c.url),
      ingredients: form.values.itemIngredients,
      tags: form.values.itemTags,
      image: itemImage
    };
    addMenuItem(cleanedUpMenuItemFields).then(status => {
      switch(status){
      case 400:
        toast.error(`Menu item "${cleanedUpMenuItemFields.menuitem_name}" already exists!`);
        break;
      case 401:
        toast.error("Adding new menu item requires permission!");
        break;
      case 201:
        toast.success(`Successfully created menu item "${cleanedUpMenuItemFields.menuitem_name}"`);
        onSubmit();
        !isLoading && onClose();
        break;
      }
    });
  };

  const handleClear = () => {
    setItemCategories([category.category_name]);
    setItemImage(undefined);
    form.reset();
    onClose();
  };

  const previewImage = (file: File | null) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      setItemImage(reader.result?.toString());
    });
    file && reader.readAsDataURL(file);
  };

  useEffect(() => {
    setItemCategories([category.category_name]);
  }, [category]);

  return (
    <Modal opened={isOpened} onClose={handleClear} title="Add Item" size="lg">
      <form onSubmit={(e) => {
        e.preventDefault();
        !form.validate().hasErrors && handleAddMenuItem();
        !form.validate().hasErrors && handleClear();
      }}>
        <Flex gap={30}>
          <LoadingOverlay visible={isLoading}/>
          <Stack>
            <Flex w={200} h={200}>
              <Image
                mt={10}
                src={itemImage}
                fallbackSrc="https://placehold.co/600x400?text=Image%20Preview"
                alt="Preview of uploaded image"
              />
            </Flex>
            <FileButton
              onChange={previewImage}
              accept="image/png,image/jpeg"
            >
              {(props) => <Button {...props}>Upload Image</Button>}
            </FileButton>
            <Button
              color="red"
              disabled={!itemImage}
              onClick={() => {setItemImage(undefined);}}
            >
              Clear Image
            </Button>
            <Switch
              label="In stock"
              defaultChecked={true}
              onChange={(e) => {form.setFieldValue("itemAvailable", e.target.checked);}}
            />
          </Stack>
          <Stack w="100%">
            <TextInput
              withAsterisk
              label="Item name"
              placeholder="e.g., Chicken rice"
              error={form.errors?.itemName}
              onChange={(e) => {form.setFieldValue("itemName", e.target.value);}}
            />
            <NumberInput
              withAsterisk
              label="Item price"
              min={0}
              defaultValue={form.values?.itemPrice}
              error={form.errors?.itemPrice}
              onChange={(e) => {form.setFieldValue("itemPrice", e as number);}}
            />
            <Textarea
              withAsterisk
              label="Item description"
              placeholder="e.g., Hainanese style marinated in soy sauce"
              error={form.errors?.itemDescription}
              onChange={(e) => {form.setFieldValue("itemDescription", e.target.value);}}
            />
            <TagsInput
              label="Item ingredients"
              placeholder="e.g., chicken, rice, soy sauce"
              error={form.errors?.itemIngredients}
              onChange={(e) => {form.setFieldValue("itemIngredients", e as string[]);}}
            />
            <TagsInput
              label="Tags"
              placeholder="e.g., vegan, spicy"
              error={form.errors?.itemTags}
              onChange={(e) => {form.setFieldValue("itemTags", e as string[]);}}
            />
            <MultiSelect
              withAsterisk
              label="Category"
              data={categoryList.map(c => c.category_name)}
              defaultValue={itemCategories}
              error={form.errors?.itemCategories}
              onChange={(e) => {
                setItemCategories(e as string[]);
                form.setFieldValue("itemCategories", e as string[]);
              }}
            />
          </Stack>
        </Flex>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={handleClear}>Cancel</Button>
          <Button type="submit">Add</Button>
        </Group>
      </form>
    </Modal>
  );
}
