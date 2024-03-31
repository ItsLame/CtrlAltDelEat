import { useEffect, useState } from "react";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { ActionIcon, Button, Flex, Title, Text, TextInput, Group } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import { ManagerMainHeaderProps, categorySchema } from "@/models";
import toast from "react-hot-toast";
import { editCategory } from "@/services";

export function ManagerMainHeader ({ category, onRefresh, onAddMenuItem, onEditCategory }: ManagerMainHeaderProps) {
  const [isEditCategory, setEditCategory] = useState(false);

  const form = useForm({
    validate: zodResolver(categorySchema),
    validateInputOnChange: true,
  });

  const toggleEditCategory = () => {
    setEditCategory(!isEditCategory);
    form.setFieldValue("categoryName", category.category_name);
  };

  const handleEditCategory = () => {
    const cleanedUpMenuItemFields = {
      category_name: form.values.categoryName.trim(),
      uuidUrl: category.url,
    };

    editCategory(cleanedUpMenuItemFields).then(status => {
      switch(status){
      case 400:
        toast.error(`Category "${cleanedUpMenuItemFields.category_name}" already exists!`);
        break;
      case 401:
        toast.error("Editing category requires permission!");
        break;
      case 200:
        toast.success(`Successfully renamed to "${cleanedUpMenuItemFields.category_name}"`);
        onEditCategory({ category_name: form.values?.categoryName, url: category.url });
        toggleEditCategory();
        break;
      }
    });
  };

  useEffect(() => {
    category.category_name !== form.values?.categoryName && setEditCategory(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <>
      {category.url ? (
        <Flex justify="space-between" pos="sticky">
          {
            !isEditCategory ? (
              <Title
                className="category-name pointer"
                order={2}
                onClick={toggleEditCategory}
              >
                {category.category_name}
              </Title>
            ) : (
              <form
                className="w-75"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (form.values?.categoryName === category.category_name) toggleEditCategory();
                  else !form.validate().hasErrors && handleEditCategory();
                }}
                onKeyDown={(event) => {event.key === "Escape" && toggleEditCategory();}}
              >
                <Group gap={10} align="top">
                  <TextInput
                    autoFocus
                    className="w-75"
                    placeholder="Category name"
                    error={form.errors?.categoryName}
                    defaultValue={form.values?.categoryName}
                    onChange={(event) => {form.setFieldValue("categoryName", event.target.value);}}
                    rightSection={(
                      <ActionIcon
                        type="submit"
                        disabled={form.values?.categoryName === category.category_name || form.errors?.categoryName ? true : false}
                      >
                        <CheckIcon />
                      </ActionIcon>
                    )}
                  />
                  <Button variant="subtle" color="gray" onClick={toggleEditCategory}>Cancel</Button>
                </Group>
              </form>
            )
          }
          <Group gap={15} align="top">
            <ActionIcon variant="subtle" size="lg" py={17} onClick={onRefresh}><ReloadIcon /></ActionIcon>
            <Button onClick={onAddMenuItem}>Add Item</Button>
          </Group>
        </Flex>
      ): (
        <Text c="dimmed">
        No category selected.
        </Text>
      )}
    </>
  );
}
