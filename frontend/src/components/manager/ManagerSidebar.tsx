import { useCallback, useEffect, useState } from "react";
import { Input, CloseButton, Button, Flex, Stack, LoadingOverlay, Box, ActionIcon, Tooltip } from "@mantine/core";
import { ReloadIcon } from "@radix-ui/react-icons";

import { addCategory, getCategories } from "@/services";
import { categories } from "@/models";
import toast from "react-hot-toast";

export function ManagerSidebar() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoriesList, setCategoriesList] = useState([] as categories[]);

  const [isCategoriesLoaded, setCategoriesLoaded] = useState(false);
  const [isNewCategoryNameValid, setNewCategoryNameValid] = useState(false);

  const handleAddCategory = useCallback(() => {
    const cleanedNewCategoryName = newCategoryName.trim().replace(/ +/g, " ");
    addCategory({ name: cleanedNewCategoryName }).then((status) => {
      switch(status){
      case 400:
        toast.error(`Category "${newCategoryName}" already exists!`);
        break;
      case 201:
        toast.success(`Successfully created category "${newCategoryName}"`);
        refreshList();
        break;
      }
    });
  }, [newCategoryName]);

  const refreshList = () => {
    setCategoriesLoaded(false);
    getCategories().then((res) => {
      setCategoriesList(res);
      setCategoriesLoaded(true);
    });
  };

  useEffect(() => {
    refreshList();
  }, []);

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
              onClick={() => setNewCategoryName("")}
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
        <ActionIcon variant="subtle" onClick={refreshList}><ReloadIcon /></ActionIcon>
        <Button
          variant="filled"
          onClick={handleAddCategory}
          disabled={!isNewCategoryNameValid}
        >
          Add
        </Button>
      </Flex>
      <Box className="h-100" pos="relative" >
        <LoadingOverlay visible={!isCategoriesLoaded} />
        <Stack gap={10}>
          {categoriesList.map((c, k) => <Button key={k} variant="outline">{c.name}</Button>)}
        </Stack>
      </Box>
    </div>
  );
}
