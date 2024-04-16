import { Button, Flex } from "@mantine/core";
import { UndoOrderProps } from "@/models";

export function UndoDeleteOrder({ item, handleUndoClick }: UndoOrderProps) {
  return (
    <>
      <Flex align="center">
        <span className="undo-span">Order #{item.id} READY!</span>
        <Button
          variant="filled"
          className="undo-button"
          color="red"
          onClick={handleUndoClick}
        >
          Tap to undo
        </Button>
      </Flex>
    </>
  );
}
