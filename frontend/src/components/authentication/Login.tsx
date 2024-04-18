import { Button, Stack, Flex, Title, PinInput, Text, Group, LoadingOverlay, Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { generateAuthToken, getUserCookies, storeToken } from "@/services";
import { apiPassword, siteRoute } from "@/constants";
import { LoginProps, loginSchema } from "@/models";
import { mapUserToRoute } from "@/helpers";

export function Login({ onReturn } : LoginProps) {
  const router = useRouter();

  const [isLoginLoading, setLoginLoading] = useState(true);

  const form = useForm({
    validate: zodResolver(loginSchema),
    validateInputOnBlur: true,
  });

  const initForm = () => {
    form.setValues({
      pin: ""
    });
  };

  const handleLogin = (pin: string) => {
    setLoginLoading(true);
    generateAuthToken( { username: pin, password: apiPassword } ).then((res) => {
      storeToken(res);
      res && router.push(mapUserToRoute(res.groups[0]?.name));
      toast.success("Login success!");
    }).catch(() => form.setFieldError("pin", "Failed to authenticate"))
      .finally(() => setLoginLoading(false));
  };

  const checkLogin = () => {
    setLoginLoading(true);
    getUserCookies().then((res) => {
      if (res.isSuperUser) {
        router.push(siteRoute.root);
        toast.loading("Redirecting...");
        return true;
      } else if (res && res.groups) {
        router.push(mapUserToRoute(JSON.parse(res.groups!)[0].name));
        toast.loading("Redirecting...");
        return true;
      }
    });

    return false;
  };

  useEffect(() => {
    if (!checkLogin()) {
      initForm();
      setLoginLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      !form.validate().hasErrors && handleLogin(form.values?.pin);
    }}>
      <Box pos="relative">
        <Stack gap={0} align="center">
          <LoadingOverlay zIndex={1000} visible={isLoginLoading}/>
          <PinInput
            autoFocus
            onComplete={(value: string) => handleLogin(value)}
            onChange={(value) => form.setFieldValue("pin", value)}
            error={form.errors?.pin ? true : false}
            defaultValue={form.values?.pin}
            type="number"
          />
          <Text c="red" h={35}>
            {form.errors?.pin}
          </Text>
          <Group>
            <Button variant="light" onClick={onReturn}>
              Back to navigation
            </Button>
            <Button type="submit" variant="filled">
              Log In
            </Button>
          </Group>
        </Stack>
      </Box>
    </form>
  );

  return (
    <Flex className="vh-100" justify="center">
      <Stack gap={5} mih={200} miw={200} align="center" mt="xl">
        <Title order={1} mb="xl">
          Staff Login
        </Title>
        {loginForm()}
      </Stack>
    </Flex>
  );
}
