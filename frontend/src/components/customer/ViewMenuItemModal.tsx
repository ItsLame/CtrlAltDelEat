"use client";

import { useRef, useState } from "react";
import { Flex, LoadingOverlay, Modal, NumberInput, Stack, Textarea, Button, Group, Image, NumberInputHandlers, ActionIcon, Title, Text, Badge } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

import { ViewMenuItemModalProps } from "@/models";
import { imagePlaceholder } from "@/constants";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

const schema = z.object({
  itemName: z.string().min(2, { message: "Name should have at least 2 letters" }),
  itemPrice: z.number().min(0, { message: "Price can't be empty" }),
  itemDescription: z.string().min(1, { message: "Description can't be empty" }),
  itemAvailable: z.boolean(),
  itemCategories: z.array(z.string()).min(1, { message: "Should at least pick 1 category" }),
  itemIngredients: z.array(z.string()).optional(),
  itemTags: z.array(z.string()).optional(),
});

// eslint-disable-next-line no-unused-vars
export function ViewMenuItemModal({ tableNo, menuItem, isOpened, isLoading, onClose, onSubmit }: ViewMenuItemModalProps) {
  const handlersRef = useRef<NumberInputHandlers>(null);
  const [itemImage, setItemImage] = useState<string | undefined>();

  const form = useForm({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      itemQuantity: 0,
      itemOptionalRequest: "",
    },
  });

  const handleAddMenuItem = () => {
    const _cleanedUpMenuItemFields = {
      quantity: form.values.itemQuantity,
      optionalRequeset: form.values.itemOptionalRequest.trim(),
    };
  };

  const handleClear = () => {
    setItemImage(undefined);
    form.reset();
    onClose();
  };

  return (
    <Modal opened={isOpened} onClose={handleClear} title="View Item" size="md" centered>
      <form onSubmit={(e) => {
        e.preventDefault();
        !form.validate().hasErrors && handleAddMenuItem();
        !form.validate().hasErrors && handleClear();
      }}>

        <LoadingOverlay visible={isLoading}/>
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
              {menuItem.tags.map((tag, k) =>
                <Badge key={k} variant="light" color="dark">{tag}</Badge>
              )}
            </Flex>
          )}
          <Stack gap="xs">
            <Title order={3}>{menuItem.menuitem_name}</Title>
            <Text>{menuItem.description}</Text>
          </Stack>
          <Textarea
            label="Optional requests"
            placeholder="e.g., less spicy, no tomato"
            onChange={(e) => {form.setFieldValue("itemDescription", e.target.value);}}
          />
        </Stack>

        <Group justify="space-between" mt="md">
          <Flex align="center" gap={5}>
            <ActionIcon onClick={() => handlersRef.current?.decrement()} variant="filled"><MinusIcon /></ActionIcon>
            <NumberInput w={50} min={1} defaultValue={1} handlersRef={handlersRef} hideControls/>
            <ActionIcon onClick={() => handlersRef.current?.increment()} variant="filled"><PlusIcon /></ActionIcon>
          </Flex>
          <Button type="submit">Add to Cart</Button>
        </Group>
      </form>
    </Modal>
  );
}