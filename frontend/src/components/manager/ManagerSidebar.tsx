import { useState } from "react";
import { Input, CloseButton, Button, Flex, Stack, LoadingOverlay, Box, ActionIcon, Tooltip } from "@mantine/core";
import { ReloadIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

import { addCategory } from "@/services";
import { ManagerSidebarProps } from "@/models";

export function ManagerSidebar({ category, onCategorySelect, categoryList, isLoading, onRefresh }: ManagerSidebarProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isNewCategoryNameValid, setNewCategoryNameValid] = useState(false);

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
        onRefresh();
        break;
      }
    });
  };

  const handleClearNewCategoryName = () => {
    setNewCategoryName("");
    setNewCategoryNameValid(false);
  };

  return (
    <div className="manager sidebar">
      <Tooltip
        opened={newCategoryName ? !isNewCategoryNameValid : false}
        label="Must contain 1-60 alphabetical characters (spaces are allowed)"
        color="red"
        position="bottom"
        withArrow
      >
        <Input
          placeholder="New category name"
          value={newCategoryName}
          onChange={(event) => {
            setNewCategoryName(event.currentTarget.value);
            setNewCategoryNameValid(event.currentTarget.value.match("^[a-zA-Z ]{1,60}$") ? true : false);
          }}
          rightSectionPointerEvents="all"
          mt="md"
          rightSection={(
            <CloseButton
              aria-label="Clear input"
              onClick={handleClearNewCategoryName}
              style={{ display: newCategoryName ? undefined : "none" }}
            />
          )}
        />
      </Tooltip>
      <Flex
        mih={50}
        justify="space-between"
        align="center"
        direction="row"
      >
        <ActionIcon variant="subtle" onClick={onRefresh}><ReloadIcon /></ActionIcon>
        <Button
          variant="filled"
          onClick={handleAddCategory}
          disabled={!isNewCategoryNameValid}
        >
          Add
        </Button>
      </Flex>
      <Box className="h-100" pos="relative">
        <LoadingOverlay visible={isLoading} />
        <Stack gap={10}>
          {categoryList.map((c, k) => (
            <Button
              key={k}
              variant={c.url == category.url ? "filled" : "outline"}
              onClick={() => {onCategorySelect(c);}}
            >
              {c.category_name}
            </Button>
          )
          )}
        </Stack>
      </Box>
    </div>
  );
}