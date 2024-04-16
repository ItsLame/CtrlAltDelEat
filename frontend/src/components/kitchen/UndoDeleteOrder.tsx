import { Button, Flex } from "@mantine/core";
import { UndoOrderProps } from "@/models";

export function UndoDeleteOrder({ item, handleUndoClick }: UndoOrderProps) {
  return (
    <>
      <Flex align="center">
        <span className="undo-span">Table No.{item.tableNumber} Item No.{item.id} READY!</span>
        <Button
          variant="filled"
          className="undo-button"
          color="red"
          w={150}
          onClick={handleUndoClick}
        >
          Tap to undo
        </Button>
      </Flex>
    </>
  );
}
