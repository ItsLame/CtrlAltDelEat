import { useEffect, useState } from "react";
import { CloseButton, Button, Flex, Stack, LoadingOverlay, Box, ActionIcon, TextInput, Text, Card } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragHandleDots2Icon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useForm, zodResolver } from "@mantine/form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { addCategory, editCategory } from "@/services";
import { ManagerSidebarProps, category, categorySchema } from "@/models";

export function ManagerSidebar({ category, onCategorySelect, onCategoryDelete, categoryList, isLoading, onRefresh }: ManagerSidebarProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryListState, categoryListHandlers] = useListState([] as category[]);

  const form = useForm({
    validate: zodResolver(categorySchema),
    validateInputOnChange: true,
  });

  const handleAddCategory = () => {
    const cleanedUpNewCategoryItem = {
      category_name: newCategoryName.trim().replace(/ +/g, " "),
      position: categoryList.length
    };

    addCategory(cleanedUpNewCategoryItem).then(status => {
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

  const handleReorderCategory = () => {
    const reorder = (uuidUrl: string, position: number) => {
      const cleanedUpCategoryItemFields = {
        uuidUrl: uuidUrl,
        position: position
      };

      editCategory(cleanedUpCategoryItemFields);
    };

    categoryListState.forEach((c, index) => reorder(c.url, index));
  };

  const handleClearNewCategoryName = () => {
    setNewCategoryName("");
    form.reset();
  };

  useEffect(() => {
    categoryListHandlers.setState(categoryList.sort((a, b) => a.position > b.position ? 1 : -1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryList]);

  useEffect(() => {
    handleReorderCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryListState]);

  const draggableCategoryCard = categoryListState.map((c, index) => {
    const isSelected = c.url === category.url;

    return (
      <Draggable key={c.url} index={index} draggableId={c.url}>
        {(provided, snapshot) => (
          <Box
            {...provided.draggableProps}
            ref={provided.innerRef}
            mb="xs"
            tabIndex={0}
            onClick={() => onCategorySelect(c)}
            onKeyDown={(e) => e.key === "Enter" && onCategorySelect(c)}
            aria-label={`${c.category_name} category`}
          >
            <Card
              className={`category-item ${isSelected ? "selected" : ""} ${snapshot.isDragging ? "dragging" : ""}`}
              shadow="sm"
              radius="md"
              padding={0}
              color="blue"
              withBorder
            >
              <Flex align="center">
                <Flex className="w-100" align="center">
                  <Flex
                    {...provided.dragHandleProps}
                    className="drag-handle"
                    align="center" py="md" pl="md" pr="xs"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.key === "Enter" && e.stopPropagation()}
                  >
                    <DragHandleDots2Icon width={20} height={20} />
                  </Flex>
                  <Text fw={500}>{c.category_name}</Text>
                </Flex>
                <ActionIcon
                  variant="subtle"
                  color={isSelected ? "white" : "red"}
                  mr="md"
                  aria-label={`Delete ${c.category_name} category`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryDelete(c);
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    e.key === "Enter" && onCategoryDelete(c);
                  }}
                >
                  <TrashIcon/>
                </ActionIcon>
              </Flex>
            </Card>
          </Box>
        )}
      </Draggable>
    );
  });

  return (
    <div className="sidebar">
      <form
        onSubmit={(e) => {
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
              style={{ display: form.values?.categoryName ? undefined : "none" }}
              onClick={handleClearNewCategoryName}
              aria-label="Clear input"
            />
          )}
        />
        <Flex
          mih={50}
          justify="space-between"
          align="center"
          direction="row"
        >
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={() => onRefresh()}
            aria-label="Reload category list"
          >
            <ReloadIcon />
          </ActionIcon>
          <Button
            type="submit"
            variant="filled"
            disabled={form.errors?.categoryName || newCategoryName === "" ? true: false}
            aria-label={`Add new category ${newCategoryName}`}
          >
            Add
          </Button>
        </Flex>
      </form>
      <Box className="h-100" pos="relative">
        <LoadingOverlay visible={isLoading} />
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            categoryListHandlers.reorder({ from: source.index, to: destination?.index || 0 });
          }}
        >
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <Stack
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="category-list h-100 scrollable"
                pb="xs"
                gap={0}
              >
                {draggableCategoryCard}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </div>
  );
}
