import { CustomerSidebarProps } from "@/models/customer";
import { Box, Button, Stack } from "@mantine/core";

export function CustomerSidebar(customerProps: CustomerSidebarProps) {

  return (
    <div className="customer sidebar">
      <Box className="h-100" pos="relative">
        {/*<LoadingOverlay visible={customerProps.isLoading} />*/}
        <Stack gap={10}>
          {customerProps.categoryList.map((c, k) => (
            <Button
              key={k}
              onClick={() => {
                console.log("hi there");
                console.log(c);
                customerProps.onCategorySelect(c);
              }}
            >
              {c.category_name}
            </Button>
          )
          )}
        </Stack>
      </Box>
    </div>
  );
}
