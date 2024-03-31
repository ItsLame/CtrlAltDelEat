import { Button, Code, Flex, Modal, Text } from "@mantine/core";

import { DeleteCategoryModalProps, category } from "@/models";
import { deleteCategory } from "@/services";
import toast from "react-hot-toast";

export function DeleteCategoryModal ({ category, isOpened, onDelete, onClose }: DeleteCategoryModalProps) {
  const handleDeleteCategory = (category: category) => {
    const { category_name, url } = category;

    deleteCategory({ uuidUrl: url }).then(status => {
      switch(status){
      case 404:
        toast.error(`Category "${category_name}" not found!`);
        break;
      case 401:
        toast.error("Deleting a category requires permission!");
        break;
      case 204:
        toast.success(`Successfully deleted category "${category_name}"`);
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
        <Text>Are you sure you want to delete the following category?</Text>
        <Code block>{category.category_name}</Code>
      </Flex>
      <Flex gap="sm" justify="flex-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="outline" color="red" onClick={() => handleDeleteCategory(category)}>Yes</Button>
      </Flex>
    </Modal>
  );
}
