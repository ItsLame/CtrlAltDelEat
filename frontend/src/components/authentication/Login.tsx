import { Button, Stack, Flex, Title, PinInput, Text, Group } from "@mantine/core";
import { useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/navigation";

import { generateAuthToken, storeToken } from "@/services";
import { apiPassword } from "@/constants";
import { LoginProps, loginSchema } from "@/models";
import { mapUserToRoute } from "@/helpers";

export function Login({ onReturn } : LoginProps) {
  const router = useRouter();

  const form = useForm({
    validate: zodResolver(loginSchema),
    validateInputOnBlur: true,
  });

  const initForm = () => {
    form.setValues({
      pin: ""
    });
  };

  useEffect(() => {
    initForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (pin: string) => {
    generateAuthToken( { username: pin, password: apiPassword } ).then((res) => {
      storeToken(res);
      res && router.push(mapUserToRoute(res.groups[0]?.name));
    }).catch(() => {
      form.setFieldError("pin", "Failed to authenticate");
    });
  };

  const LoginForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      !form.validate().hasErrors && handleLogin(form.values?.pin);
    }}>
      <Stack gap={0} align="center">
        <PinInput
          autoFocus
          onComplete={(value: string) => handleLogin(value)}
          onChange={(value) => form.setFieldValue("pin", value)}
          error={form.errors?.pin ? true : false}
          defaultValue={form.values?.pin}
          type={/^\d*$/}
          inputType="tel"
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
    </form>
  );

  return (
    <Flex className="vh-100" justify="center">
      <Stack gap={5} mih={200} miw={200} align="center" mt="xl">
        <Title order={1} mb="xl">
          Staff Login
        </Title>
        {LoginForm()}
      </Stack>
    </Flex>
  );
}
