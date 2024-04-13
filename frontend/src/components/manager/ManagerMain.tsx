import { useEffect, useState } from "react";
import { Box, Card, Flex, LoadingOverlay, Stack, Text, Image } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

import { ManagerMainProps, menuItems } from "@/models";
import { imagePlaceholder } from "@/constants";
import { ManagerMainHeader } from "@/components";
// import { editMenuItem } from "@/services";

export function ManagerMain({ category, menuItemList, isLoading, onRefresh, onAddMenuItem, onEditMenuItem, onEditCategory }: ManagerMainProps) {
  const [menuItemListFiltered, setMenuItemListFiltered] = useState([] as menuItems[]);
  const [menuItemListState, menuItemListHandlers] = useListState([] as menuItems[]);

  const handleReorderCategory = () => {
    const reorder = (uuidUrl: string, position: number) => {
      const _cleanedUpMenuItemFields = {
        uuidUrl: uuidUrl,
        position: position
      };

      // editMenuItem(cleanedUpMenuItemFields);
    };

    menuItemListState.forEach((c, index) => reorder(c.url, index));
  };

  useEffect(() => {
    menuItemListHandlers.setState(menuItemListFiltered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItemListFiltered]);

  useEffect(() => {
    handleReorderCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItemListState]);

  useEffect(() => {
    const filtered = menuItemList.filter(item => item.category.includes(category.url));
    setMenuItemListFiltered(filtered);
  }, [menuItemList, category]);

  const DraggableMenuItemCard = menuItemListState.map((item, index) => {
    return (
      <Draggable key={item.url} index={index} draggableId={item.url}>
        {(provided, snapshot) => (
          <Box
            {...provided.draggableProps}
            ref={provided.innerRef}
            onClick={() => onEditMenuItem(item)}
            mb="xs"
          >
            <Card
              className={`menu-item ${snapshot.isDragging ? "dragging" : ""}`}
              shadow="sm"
              radius="md"
              padding="md"
              color="blue"
              withBorder
            >
              <Flex gap="md">
                <Flex {...provided.dragHandleProps} className="drag-handle" align="center" py="xl" pl="xs" pr="xs">
                  <DragHandleDots2Icon width={20} height={20}/>
                </Flex>
                <Flex w={80}>
                  <Image
                    src={item.image}
                    alt={`A picture of ${item.menuitem_name}`}
                    fallbackSrc={imagePlaceholder}
                  />
                </Flex>
                <Stack gap={0}>
                  <Text size="lg" c="blue" fw={700}>{item.menuitem_name}</Text>
                  <Text size="sm" c="dimmed">{item.description}</Text>
                  <Text size="md">${item.cost}</Text>
                </Stack>
              </Flex>
            </Card>
          </Box>
        )}
      </Draggable>
    );
  });

  return (
    <Box pos="relative">
      <ManagerMainHeader
        category={category}
        onRefresh={onRefresh}
        onAddMenuItem={onAddMenuItem}
        onEditCategory={onEditCategory}
      />
      <LoadingOverlay zIndex={1000} visible={isLoading}/>
      {menuItemListFiltered.length >= 1 ? (
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            menuItemListHandlers.reorder({ from: source.index, to: destination?.index || 0 });
          }}
        >
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <Stack
                className="menu-item-list h-100 scrollable"
                {...provided.droppableProps}
                ref={provided.innerRef}
                gap={0}
              >
                {DraggableMenuItemCard}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      ) : category.url && (
        <Text c="dimmed">
              Category is empty.
        </Text>
      )}
    </Box>
  );
}
