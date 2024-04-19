"use client";

import { useEffect, useRef } from "react";
import { Flex, LoadingOverlay, Modal, NumberInput, Stack, Textarea, Button, Group, Image, NumberInputHandlers, ActionIcon, Title, Text, Badge } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

import { ViewMenuItemModalProps, addToCartRequest, orderItemSchema } from "@/models";
import { imagePlaceholder } from "@/constants";
import { addItemToCart } from "@/services";

export function ViewMenuItemModal({ tableNo,menuItem,isOpened,isLoading,onClose }: ViewMenuItemModalProps) {
  const handlersRef = useRef<NumberInputHandlers>(null);

  const form = useForm({
    validate: zodResolver(orderItemSchema),
    validateInputOnChange: true,
  });

  const handleSubmit = () => {
    const menu_item_request: addToCartRequest = {
      itemName: menuItem.menuitem_name,
      cost: menuItem.cost,
      tableNumber: tableNo,
      quantity: form.values.itemQuantity,
      alterations: form.values.itemOptionalRequest.trim(),
    };

    addItemToCart(menu_item_request).then((res) => {
      switch (res) {
      case 400:
        toast.error("Error, failed to add item to cart");
        break;
      case 201:
        toast.success("Added item to cart");
        form.setFieldValue("itemOptionalRequest", "");
        form.setFieldValue("itemQuantity", 1);
        onClose();
        break;
      }
    });
  };

  const handleClear = () => {
    form.reset();
    onClose();
  };

  const initForm = () => {
    form.setValues({
      itemQuantity: 1,
      itemOptionalRequest: "",
    });
  };

  useEffect(() => {
    isOpened && initForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]);

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
          !form.validate().hasErrors && handleSubmit();
          !form.validate().hasErrors && handleClear();
        }}
      >
        <LoadingOverlay visible={isLoading}/>
        <Stack w="100%">
          <Flex h={200}>
            <Image
              mt={10}
              src={menuItem.image}
              fallbackSrc={imagePlaceholder}
              alt="Preview of uploaded image"
            />
          </Flex>
          {menuItem.tags?.length >= 1 && (
            <Flex gap={5}>
              {menuItem.tags.map((tag, k) => (
                <Badge key={k} variant="light" color="gray">
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
            defaultValue={form.values?.itemDescription}
            onChange={(e) => form.setFieldValue("itemOptionalRequest", e.target.value)}
            error={form.errors?.itemOptionalRequest}
          />
        </Stack>

        <Group justify="space-between" mt="md">
          <Flex align="center" gap="xs">
            <ActionIcon
              onClick={() => handlersRef.current?.decrement()}
              variant="outline"
              size="lg"
              radius="xl"
              aria-label="Decrease quantity"
            >
              <MinusIcon/>
            </ActionIcon>
            <NumberInput
              w={50}
              min={1}
              allowNegative={false}
              allowDecimal={false}
              defaultValue={form.values?.itemQuantity}
              onChange={(value) => form.setFieldValue("itemQuantity", +value as number)}
              handlersRef={handlersRef}
              error={form.errors.itemQuantity ? true : false}
              hideControls
              aria-label="Item quantity"
            />
            <ActionIcon
              onClick={() => handlersRef.current?.increment()}
              variant="outline"
              size="lg"
              radius="xl"
              aria-label="Increase quantity"
            >
              <PlusIcon/>
            </ActionIcon>
          </Flex>
          <Button type="submit">
            Add to Cart
          </Button>
        </Group>
        <Text size="xs" c="red">{form.errors.itemQuantity}</Text>
      </form>
    </Modal>
  );
}
