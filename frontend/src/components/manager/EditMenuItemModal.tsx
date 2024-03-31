"use client";

import { useEffect, useState } from "react";
import { FileButton, Flex, LoadingOverlay, Modal, MultiSelect, NumberInput, Stack, Switch, TagsInput, Textarea, TextInput, Button, Group, Image } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import toast from "react-hot-toast";
import { z } from "zod";

import { EditMenuItemModalProps } from "@/models";
import { editMenuItem } from "@/services";
import { imagePlaceholder } from "@/constants";

const schema = z.object({
  itemName: z.string().min(2, { message: "Name should have at least 2 letters" }),
  itemPrice: z.number().min(0, { message: "Price can't be empty" }),
  itemDescription: z.string().min(1, { message: "Description can't be empty" }),
  itemAvailable: z.boolean(),
  itemCategories: z.array(z.string()).min(1, { message: "Should at least pick 1 category" }),
  itemIngredients: z.array(z.string()).optional(),
  itemTags: z.array(z.string()).optional(),
});

export function EditMenuItemModal({ menuItem, categoryList, isOpened, isLoading, onClose, onSubmit }: EditMenuItemModalProps) {
  const [itemImage, setItemImage] = useState<string | undefined>();

  const form = useForm({
    validate: zodResolver(schema),
    validateInputOnChange: true,
  });

  const handleEditMenuItem = () => {
    const cleanedUpMenuItemFields = {
      menuitem_name: form.values.itemName.trim(),
      cost: form.values.itemPrice,
      description: form.values.itemDescription.trim(),
      available: form.values.itemAvailable,
      category: categoryList.filter(c => form.values.itemCategories.includes(c.category_name)).map(c => c.url),
      ingredients: form.values.itemIngredients,
      tags: form.values.itemTags,
      uuidUrl: menuItem.url,
      image: itemImage
    };

    editMenuItem(cleanedUpMenuItemFields).then(status => {
      switch(status){
      case 400:
        toast.error(`Menu item "${cleanedUpMenuItemFields.menuitem_name}" already exists!`);
        break;
      case 401:
        toast.error("Editing menu item requires permission!");
        break;
      case 200:
        toast.success(`Successfully edited menu item "${cleanedUpMenuItemFields.menuitem_name}"`);
        onSubmit(false);
        !isLoading && onClose();
        break;
      }
    });
  };

  const handleClear = () => {
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

  const initForm = async () => {
    const categories = categoryList.filter(c => menuItem.category.includes(c.url)).map(c => c.category_name);

    form.setValues({
      itemName: menuItem.menuitem_name,
      itemPrice: parseFloat(menuItem.cost),
      itemDescription: menuItem.description,
      itemCategories: categories,
      itemAvailable: menuItem.available,
      itemIngredients: menuItem.ingredients,
      itemTags: menuItem.tags,
    });
  };

  useEffect(() => {
    isOpened && initForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]);

  return (
    <Modal opened={isOpened} onClose={handleClear} title="Edit Item" size="lg">
      <form onSubmit={(e) => {
        e.preventDefault();
        !form.validate().hasErrors && handleEditMenuItem();
        !form.validate().hasErrors && handleClear();
      }}>
        <Flex gap={30}>
          <LoadingOverlay visible={isLoading}/>
          <Stack>
            <Flex w={200} h={200}>
              <Image
                mt={10}
                src={itemImage}
                fallbackSrc={imagePlaceholder}
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
            <Button
              variant="outline"
              color="red"
              disabled={!itemImage}
              onClick={() => {setItemImage(undefined);}}
            >
              Reset Image
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
              defaultValue={form.values?.itemName}
              onChange={(e) => {form.setFieldValue("itemName", e.target.value);}}
            />
            <NumberInput
              withAsterisk
              label="Item price"
              min={0}
              error={form.errors?.itemPrice}
              defaultValue={form.values?.itemPrice}
              onChange={(e) => {form.setFieldValue("itemPrice", e as number);}}
            />
            <Textarea
              withAsterisk
              label="Item description"
              placeholder="e.g., Hainanese style marinated in soy sauce"
              error={form.errors?.itemDescription}
              defaultValue={form.values?.itemDescription}
              onChange={(e) => {form.setFieldValue("itemDescription", e.target.value);}}
            />
            <TagsInput
              label="Item ingredients"
              placeholder="e.g., chicken, rice, soy sauce"
              error={form.errors?.itemIngredients}
              defaultValue={form.values?.itemIngredients}
              onChange={(e) => {form.setFieldValue("itemIngredients", e as string[]);}}
            />
            <TagsInput
              label="Tags"
              placeholder="e.g., vegan, spicy"
              error={form.errors?.itemTags}
              defaultValue={form.values?.itemTags}
              onChange={(e) => {form.setFieldValue("itemTags", e as string[]);}}
            />
            <MultiSelect
              withAsterisk
              label="Category"
              data={categoryList.map(c => c.category_name)}
              error={form.errors?.itemCategories}
              defaultValue={form.values?.itemCategories}
              onChange={(e) => {
                form.setFieldValue("itemCategories", e as string[]);
              }}
            />
          </Stack>
        </Flex>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" color="red" onClick={handleClear}>Delete</Button>
          <Button type="submit" px="xl">Save</Button>
        </Group>
      </form>
    </Modal>
  );
}
