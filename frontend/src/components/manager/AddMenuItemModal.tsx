"use client";

import { useEffect, useState } from "react";
import { FileButton, Flex, LoadingOverlay, Modal, MultiSelect, NumberInput, Stack, Switch, TagsInput, Textarea, TextInput, Button, Group, Image } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import toast from "react-hot-toast";

import { AddMenuItemModalProps, menuItemSchema } from "@/models";
import { addMenuItem, uploadMenuItemImage } from "@/services";
import { imagePlaceholder } from "@/constants";
import { displayImage } from "@/helpers";

export function AddMenuItemModal({ category, categoryList, menuItemList, isOpened, isLoading, onClose, onSubmit }: AddMenuItemModalProps) {
  const [itemImage, setItemImage] = useState<File | null>();

  const form = useForm({
    validate: zodResolver(menuItemSchema),
    validateInputOnChange: true,
  });

  const handleAddMenuItem = async () => {
    const cleanedUpMenuItemFields = {
      menuitem_name: form.values.itemName.trim(),
      cost: form.values.itemPrice,
      description: form.values.itemDescription.trim(),
      available: form.values.itemAvailable,
      category: categoryList.filter(c => form.values.itemCategories.includes(c.category_name)).map(c => c.url),
      ingredients: form.values.itemIngredients,
      tags: form.values.itemTags,
      image: itemImage && await handleUploadImageToServer(),
      position: menuItemList.length
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
        itemImage && handleUploadImageToServer();
        onSubmit(false);
        !isLoading && handleClear();
        break;
      }
    });
  };

  const handleUploadImageToServer = async () => {
    const cleanedUpMenuItemFields = {
      image: itemImage || null
    };

    return uploadMenuItemImage(cleanedUpMenuItemFields).then(data => data.image);
  };

  const handleUploadImage = (file: File | null) => {
    displayImage(file).then((res) => {
      form.setFieldValue("itemImage", res);
      setItemImage(file);
    });
  };

  const handleClearImage = () => {
    form.setFieldValue("itemImage", "");
    setItemImage(null);
  };

  const handleClear = () => {
    onClose();
    form.reset();
    handleClearImage();
  };

  const initForm = () => {
    form.setValues({
      itemName: "",
      itemPrice: 0,
      itemDescription: "",
      itemCategories: [category.category_name] as string[],
      itemAvailable: true,
      itemIngredients: [] as string[],
      itemTags: [] as string[],
      itemImage: ""
    });
  };

  useEffect(() => {
    isOpened && initForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]);

  return (
    <Modal opened={isOpened} onClose={handleClear} title="Add Item" size="lg">
      <form onSubmit={(e) => {
        e.preventDefault();
        !form.validate().hasErrors && handleAddMenuItem();
      }}>
        <Flex gap={30}>
          <LoadingOverlay visible={isLoading}/>
          <Stack>
            <Flex w={200} h={200}>
              <Image
                mt={10}
                src={form.values?.itemImage}
                fallbackSrc={imagePlaceholder}
                alt="Preview of uploaded image"
              />
            </Flex>
            <FileButton
              onChange={handleUploadImage}
              accept="image/png,image/jpeg"
            >
              {(props) => <Button {...props}>Upload Image</Button>}
            </FileButton>
            <Button
              color="red"
              disabled={!form.values?.itemImage}
              onClick={handleClearImage}
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
              onChange={(e) => {form.setFieldValue("itemCategories", e as string[]);}}
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
