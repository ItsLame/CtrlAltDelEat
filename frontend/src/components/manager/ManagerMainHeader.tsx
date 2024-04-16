import { useEffect, useState } from "react";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { ActionIcon, Button, Flex, Title, Text, TextInput, Group, UnstyledButton } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import toast from "react-hot-toast";

import { ManagerMainHeaderProps, categorySchema } from "@/models";
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
        onEditCategory({ category_name: form.values?.categoryName, url: category.url, position: category.position });
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
              <UnstyledButton
                className="category-name"
                onClick={toggleEditCategory}
              >
                <Title order={2}>
                  {category.category_name}
                </Title>
              </UnstyledButton>
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
                <Group gap="xs" align="top">
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
                        <CheckIcon height={20} width={20}/>
                      </ActionIcon>
                    )}
                  />
                  <Button variant="outline" color="gray" onClick={toggleEditCategory}>Cancel</Button>
                </Group>
              </form>
            )
          }
          <Group gap="sm" align="top">
            <ActionIcon
              variant="subtle" size="lg" py={17}
              onClick={onRefresh}
              aria-label="Reload menu item list"
            >
              <ReloadIcon />
            </ActionIcon>
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
