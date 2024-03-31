import { useState } from "react";
import { CloseButton, Button, Flex, Stack, LoadingOverlay, Box, ActionIcon, TextInput } from "@mantine/core";
import { ReloadIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useForm, zodResolver } from "@mantine/form";

import { addCategory } from "@/services";
import { ManagerSidebarProps, categorySchema } from "@/models";

export function ManagerSidebar({ category, onCategorySelect, onCategoryDelete, categoryList, isLoading, onRefresh }: ManagerSidebarProps) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const form = useForm({
    validate: zodResolver(categorySchema),
    validateInputOnChange: true,
  });

  const handleAddCategory = () => {
    const cleanedNewCategoryName = newCategoryName.trim().replace(/ +/g, " ");

    addCategory({ category_name: cleanedNewCategoryName }).then(status => {
      switch(status){
      case 400:
        toast.error(`Category "${newCategoryName}" already exists!`);
        break;
      case 401:
        toast.error("Adding new category requires permission!");
        break;
      case 201:
        toast.success(`Successfully created category "${newCategoryName}"`);
        onRefresh(false);
        break;
      }
    });
  };

  const handleClearNewCategoryName = () => {
    setNewCategoryName("");
    form.reset();
  };

  return (
    <div className="manager sidebar">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAddCategory();
        handleClearNewCategoryName();
      }}
      >
        <TextInput
          placeholder="New category name"
          value={newCategoryName}
          error={form.values?.categoryName !== "" && form.errors?.categoryName}
          onChange={(event) => {
            setNewCategoryName(event.target.value);
            form.setFieldValue("categoryName", event.target.value);
          }}
          rightSectionPointerEvents="all"
          mt="md"
          rightSection={(
            <CloseButton
              aria-label="Clear input"
              onClick={handleClearNewCategoryName}
              style={{ display: form.values?.categoryName ? undefined : "none" }}
            />
          )}
        />
        <Flex
          mih={50}
          justify="space-between"
          align="center"
          direction="row"
        >
          <ActionIcon variant="subtle" onClick={() => {onRefresh();}}><ReloadIcon /></ActionIcon>
          <Button
            type="submit"
            variant="filled"
            disabled={form.errors?.categoryName || newCategoryName === "" ? true: false}
          >
            Add
          </Button>
        </Flex>
      </form>
      <Box className="h-100" pos="relative">
        <LoadingOverlay visible={isLoading} />
        <Stack gap="xs">
          {categoryList.map((c, k) => (
            <Flex className="w-100" direction="row" key={k} gap={5} align="center">
              <Button fullWidth={true}
                variant={c.url == category.url ? "filled" : "outline"}
                onClick={() => {onCategorySelect(c);}}
              >
                {c.category_name}
              </Button>
              <CloseButton
                onClick={() => {onCategoryDelete(c);}}
              />
            </Flex>
          )
          )}
        </Stack>
      </Box>
    </div>
  );
}
