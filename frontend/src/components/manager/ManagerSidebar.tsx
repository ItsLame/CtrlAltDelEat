import { useState } from "react";
import { Input, CloseButton, Button, Flex, Stack, LoadingOverlay, Box, ActionIcon, Tooltip } from "@mantine/core";
import { ReloadIcon } from "@radix-ui/react-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";

import { addCategory } from "@/services";
import { ManagerCategoryProps, ManagerSidebarProps } from "@/models";

export function CategoryButton({ index, category, c, onCategorySelect }: ManagerCategoryProps) {
  return (
    <Draggable key={c.url} draggableId={c.url} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Button
            key={c.category_name} // Removed key prop from Button
            variant={c.url === category.url ? "filled" : "outline"} // Fixed comparison operator
            onClick={() => { onCategorySelect(c); }}
          >
            {c.category_name}
          </Button>
        </div>
      )}
    </Draggable>
  );
}

export function ManagerSidebar({ category, onCategorySelect, categoryList, isLoading, onRefresh }: ManagerSidebarProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isNewCategoryNameValid, setNewCategoryNameValid] = useState(false);
  const [categoryListState, setCategoryList] = useState({} as typeof category[]);
  console.log(categoryListState);

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

  const onDragEnd = (result : any) => {
    const { destination, source, draggableId } = result;
    console.log("Dest", "Source");
    console.log(destination, source);
    console.log(draggableId);
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Reorder the items
    const reorderedItems = Array.from(categoryList);
    console.log("Start");
    console.log(reorderedItems);
    const [removedItem] = reorderedItems.splice(source.index, 1); // Remove the item from its original position
    console.log("Spliced");
    console.log(reorderedItems);
    reorderedItems.splice(destination.index, 0, removedItem); // Insert the item into its new position
    console.log("Finished");

    // Update the state with the reordered items
    setCategoryList(reorderedItems);
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Stack gap={10}>
            <Droppable droppableId="category-sidebar">
              {(provided) => (
                <Stack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {categoryList.map((c, k) => (
                    <CategoryButton
                      key={k} // Added key prop to CategoryButton
                      index={k}
                      category={category}
                      c={c}
                      onCategorySelect={onCategorySelect}
                    />
                  ))}
                  {provided.placeholder} {/* Added placeholder for Droppable */}
                </Stack>
              )}
            </Droppable>
          </Stack>
        </DragDropContext>
      </Box>
    </div>
  );
}
