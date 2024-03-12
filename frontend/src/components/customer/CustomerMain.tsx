// import { CustomerMainProps } from "@/models/customer";
import { Card, Flex, Stack, UnstyledButton } from "@mantine/core";
import Image from "next/image";
import { menuItems } from "@/models";
import { useRouter } from "next/navigation";
import { CustomerMainProps } from "@/models/customer";

export function CustomerMain(customerMainProps: CustomerMainProps) {
  const router = useRouter();
  const items: menuItems[] = customerMainProps.items;

  const generateMenuItem = (item: menuItems, k: number) => (
    <UnstyledButton onClick={() => {
      console.log("going to: " + item.menuitem_name + " page");
      router.push("/customer/item");
    }}>
      <Card key={k} shadow="sm" padding="lg" radius="md" withBorder={true}>
        <Flex direction={"row"} gap={"xl"} align={"center"}>
          <div>
            <Image src={"logo.svg"} alt={""} width={50} height={50}/>
          </div>
          <Flex direction={"column"}>
            <span>{item.menuitem_name}</span>
            <span>{item.description}</span>
            <span>${item.cost}</span>
          </Flex>
        </Flex>
      </Card>
    </UnstyledButton>
  );

  return (
    <div>
      <Stack>
        {items.map((item, k) => generateMenuItem(item, k))}
      </Stack>
    </div>
  );
}
