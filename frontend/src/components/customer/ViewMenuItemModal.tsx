"use client";

import { useRef, useState } from "react";
import {
  Flex,
  LoadingOverlay,
  Modal,
  NumberInput,
  Stack,
  Textarea,
  Button,
  Group,
  Image,
  NumberInputHandlers,
  ActionIcon,
  Title,
  Text,
  Badge,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

import {
  ViewMenuItemModalProps,
  menuItemSchema,
  addToCartRequest,
} from "@/models";
import { imagePlaceholder } from "@/constants";
import { addItemToCart } from "@/services";
import toast from "react-hot-toast";

export function ViewMenuItemModal({
  tableNo,
  menuItem,
  isOpened,
  isLoading,
  onClose,
  // eslint-disable-next-line no-unused-vars
  onSubmit,
}: ViewMenuItemModalProps) {
  const handlersRef = useRef<NumberInputHandlers>(null);
  const [itemImage, setItemImage] = useState<string | undefined>();

  const form = useForm({
    validate: zodResolver(menuItemSchema),
    validateInputOnChange: true,
    initialValues: {
      itemQuantity: 1,
      itemOptionalRequest: "",
    },
  });

  const handleSubmit = () => {
    // create menu item to post to api
    const menu_item_request: addToCartRequest = {
      itemName: menuItem.menuitem_name,
      cost: menuItem.cost,
      tableNumber: tableNo,
      quantity: form.values.itemQuantity,
      alterations: form.values.itemOptionalRequest,
    };

    addItemToCart(menu_item_request).then((res) => {
      switch (res) {
      case 400:
        toast.error("some sort of error here");
        break;
      case 200:
        toast.success("added item to cart");
        onClose();
        break;
      }
    });
  };

  const handleAddMenuItem = () => {
    const _cleanedUpMenuItemFields = {
      quantity: form.values.itemQuantity,
      optionalRequest: form.values.itemOptionalRequest.trim(),
    };
  };

  const handleClear = () => {
    setItemImage(undefined);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={isOpened}
      onClose={handleClear}
      title="View Item"
      size="md"
      centered
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          !form.validate().hasErrors && handleAddMenuItem();
          !form.validate().hasErrors && handleClear();
        }}
      >
        <LoadingOverlay visible={isLoading} />
        <Stack w="100%">
          <Flex h={200}>
            <Image
              mt={10}
              src={itemImage}
              fallbackSrc={imagePlaceholder}
              alt="Preview of uploaded image"
            />
          </Flex>
          {menuItem.tags?.length >= 1 && (
            <Flex gap={5}>
              {menuItem.tags.map((tag, k) => (
                <Badge key={k} variant="light" color="dark">
                  {tag}
                </Badge>
              ))}
            </Flex>
          )}
          <Stack gap="xs">
            <Title order={3}>{menuItem.menuitem_name}</Title>
            <Text>{menuItem.description}</Text>
          </Stack>
          <Textarea
            label="Optional requests"
            placeholder="e.g., less spicy, no tomato"
            onChange={(e) => {
              form.setFieldValue("itemOptionalRequest", e.target.value);
            }}
          />
        </Stack>

        <Group justify="space-between" mt="md">
          <Flex align="center" gap={5}>
            <ActionIcon
              onClick={() => handlersRef.current?.decrement()}
              variant="filled"
            >
              <MinusIcon />
            </ActionIcon>
            <NumberInput
              w={50}
              min={1}
              defaultValue={1}
              onChange={(value) => {
                form.setFieldValue("itemQuantity", value as number);
              }}
              handlersRef={handlersRef}
              hideControls
            />
            <ActionIcon
              onClick={() => handlersRef.current?.increment()}
              variant="filled"
            >
              <PlusIcon />
            </ActionIcon>
          </Flex>
          <Button type="submit" onClick={handleSubmit}>
            Add to Cart
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
