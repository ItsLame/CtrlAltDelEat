import { useEffect, useState } from "react";
import { Box, Card, Flex, LoadingOverlay, Stack, Text, Image, ActionIcon } from "@mantine/core";
import { useListState, useMediaQuery } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";

import { ManagerMainProps, menuItems } from "@/models";
import { imagePlaceholder } from "@/constants";
import { ManagerMainHeader } from "@/components";
import { editMenuItem } from "@/services";

export function ManagerMain({ category, menuItem, menuItemList, isLoading, onRefresh, onAddMenuItem, onEditMenuItem, onDeleteMenuItem, onEditCategory }: ManagerMainProps) {
  const isMobile = useMediaQuery("(max-width: 370px)");

  const [menuItemListFiltered, setMenuItemListFiltered] = useState([] as menuItems[]);
  const [menuItemListState, menuItemListHandlers] = useListState([] as menuItems[]);

  const handleReorderCategory = () => {
    const reorder = (uuidUrl: string, position: number) => {
      const cleanedUpMenuItemFields = {
        uuidUrl: uuidUrl,
        position: position
      };

      editMenuItem(cleanedUpMenuItemFields);
    };

    menuItemListState.forEach((c, index) => reorder(c.url, index));
  };

  useEffect(() => {
    const filtered = menuItemList.filter(item => item.category.includes(category.url));
    setMenuItemListFiltered(filtered);
  }, [menuItemList, category]);

  useEffect(() => {
    menuItemListHandlers.setState(menuItemListFiltered.sort((a, b) => a.position > b.position ? 1 : -1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItemListFiltered]);

  useEffect(() => {
    handleReorderCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItemListState]);

  const draggableMenuItemCard = menuItemListState.map((item, index) => {
    const isSelected = item.url === menuItem.url;

    return (
      <Draggable key={item.url} index={index} draggableId={item.url}>
        {(provided, snapshot) => (
          <Box
            {...provided.draggableProps}
            ref={provided.innerRef}
            mb="xs"
            tabIndex={0}
            onClick={() => onEditMenuItem(item)}
            onKeyDown={(e) => e.key === "Enter" && onEditMenuItem(item)}
            aria-label={`${item.menuitem_name} item, ${item.description}, ${item.cost} dollars`}
          >
            <Card
              className={`menu-item ${isSelected ? "selected" : ""} ${snapshot.isDragging ? "dragging" : ""}`}
              shadow="sm"
              radius="md"
              padding="md"
              color="blue"
              withBorder
            >
              <Flex align="center">
                <Flex gap="md" className="w-100">
                  <Flex
                    {...provided.dragHandleProps}
                    className="drag-handle"
                    align="center"
                    py="xl" pl="xs" pr="xs"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.key === "Enter" && e.stopPropagation()}
                  >
                    <DragHandleDots2Icon width={20} height={20} />
                  </Flex>
                  <Image
                    className={isMobile ? "hidden" : ""}
                    src={item.image}
                    alt={`A picture of ${item.menuitem_name}`}
                    fallbackSrc={imagePlaceholder}
                    pos="relative"
                    mah={100}
                    miw={100}
                  />
                  <Stack justify="space-between" gap={0}>
                    <Stack className="w-100" gap={5}>
                      <Text size="lg" c={isSelected ? "" : "blue"} fw={700} lineClamp={1}>{item.menuitem_name}</Text>
                      <Text size="sm" c={isSelected ? "" : "dimmed"} lineClamp={2} h={45}>{item.description}</Text>
                    </Stack>
                    <Text size="md">${item.cost}</Text>
                  </Stack>
                </Flex>

                <ActionIcon
                  variant="subtle"
                  color={isSelected ? "white" : "red"}
                  size="xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMenuItem(item);
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    e.key === "Enter" && onDeleteMenuItem(item);
                  }}
                  aria-label={`Delete ${item.menuitem_name} item`}
                >
                  <TrashIcon width={20} height={20}/>
                </ActionIcon>
              </Flex>
            </Card>
          </Box>
        )}
      </Draggable>
    );
  });

  return (
    <Box className="appshell-h-100" pos="relative">
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
                {draggableMenuItemCard}
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
