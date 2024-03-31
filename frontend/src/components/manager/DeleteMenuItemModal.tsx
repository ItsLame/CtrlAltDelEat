import { Button, Code, Flex, Modal, Text } from "@mantine/core";

import { DeleteMenuItemModalProps, menuItems } from "@/models";
import { deleteMenuItem } from "@/services";
import toast from "react-hot-toast";

export function DeleteMenuItemModal ({ menuItem, isOpened, onDelete, onClose }: DeleteMenuItemModalProps) {
  const handleDeleteMenuItem = (menuItem: menuItems) => {
    const { menuitem_name, url } = menuItem;

    deleteMenuItem({ uuidUrl: url }).then(status => {
      switch(status){
      case 404:
        toast.error(`Menu item "${menuitem_name}" not found!`);
        break;
      case 401:
        toast.error("Deleting a menu item requires permission!");
        break;
      case 204:
        toast.success(`Successfully deleted menu item"${menuitem_name}"`);
        onDelete(false);
        onClose();
        break;
      }
    });
  };

  return (
    <Modal
      centered
      title="WARNING"
      size="md"
      opened={isOpened}
      onClose={onClose}
    >
      <Flex direction="column" gap="sm" mb="lg">
        <Text>Are you sure you want to delete the following menu item?</Text>
        <Code block>{menuItem.menuitem_name}</Code>
      </Flex>
      <Flex gap="sm" justify="flex-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="outline" color="red" onClick={() => handleDeleteMenuItem(menuItem)}>Yes</Button>
      </Flex>
    </Modal>
  );
}
