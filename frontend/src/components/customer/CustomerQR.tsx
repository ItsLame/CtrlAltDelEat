"use client";

import { Button, Flex, Modal } from "@mantine/core";
import { useQRCode } from "next-qrcode";
import { useEffect, useState } from "react";

import { CustomerQRProps } from "@/models";

export function CustomerQR({ isOpened, onClose }: CustomerQRProps) {
  const { Canvas } = useQRCode();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <>
      <Modal
        opened={isOpened}
        onClose={onClose}
        title="Table QR Code"
      >
        <Flex direction="column" align="center" justify="center" gap="sm">
          {currentUrl !== "" && (
            <Canvas
              text={currentUrl}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 300,
              }}
            />
          )}
          <Button
            onClick={onClose}
            w={200}
            color="gray"
            aria-label="Press enter to close QR code modal"
          >
            Close
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
