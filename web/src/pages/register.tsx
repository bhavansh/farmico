import * as apiHelper from "@/api/api.helper";
import AppFormButton from "@/components/form/AppFormButton";
import useAppToast from "@/hooks/useAppToast";
import useUser from "@/hooks/useUser";
import { ISubtitleProps, RegisterDataType } from "@/utils/types";
import * as validationSchema from "@/utils/validation.schema";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

const Register: NextPage & ISubtitleProps = () => {
  const { setIsAuthenticated } = useUser();
  const router = useRouter();
  const { triggerToast, triggerErrorToast } = useAppToast();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterDataType>({
    resolver: yupResolver(validationSchema.register),
    mode: "onChange",
  });

  const checkIfUsernameAvailble = useCallback(
    async (e: any) => {
      const username = e.target.value;
      setUsername(username);
      console.log({ username });
      if (username?.length > 3) {
        const { data } = await apiHelper.checkIfUsernameAvailable(username!);
        setIsUsernameAvailable(data.isAvailable);
      }
    },
    [username]
  );

  const handleRegister = async () => {
    console.log("fisr");
    setLoading(true);
    const { email, password, name } = getValues();
    console.log({ email, password, name });
    try {
      const response = await apiHelper.register({
        email,
        password,
        name,
        username,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      setIsAuthenticated(true);
      router.replace("/blogs");
      triggerToast("Success", "Welcome to the farmico");
    } catch (error: any) {
      console.log({ error });
      triggerErrorToast("Login error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex width="full" alignItems="center" minHeight="80vh" direction="column">
      <Box textAlign="center" mt="16">
        <Heading>Register</Heading>
      </Box>
      <Box
        py="10"
        px="8"
        minWidth="530px"
        boxShadow="sm"
        mt="8"
        textAlign="left"
        borderWidth="thin"
        borderColor="gray.300"
        borderRadius="2px"
      >
        <form onSubmit={handleSubmit(handleRegister)}>
          <FormControl isInvalid={errors.name !== undefined} my="6">
            <FormLabel htmlFor="name">name</FormLabel>
            <Input
              py="4"
              px="3"
              borderColor="gray.100"
              focusBorderColor="gray.600"
              borderRadius="2px"
              id="name"
              placeholder="john doe"
              {...register("name")}
            />
            {errors.name?.message && (
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            isInvalid={
              (username?.length > 0 && username?.length < 4) ||
              !isUsernameAvailable
            }
            my="6"
          >
            <FormLabel htmlFor="username">username</FormLabel>
            <Input
              py="4"
              px="3"
              borderColor="gray.100"
              focusBorderColor="gray.600"
              borderRadius="2px"
              id="username"
              placeholder="johnbhai"
              name="username"
              value={username}
              onChange={checkIfUsernameAvailble}
            />
            {(username?.length! < 4 && (
              <FormErrorMessage>
                username can't be smaller than 4 characters
              </FormErrorMessage>
            )) ||
              (!isUsernameAvailable && (
                <FormErrorMessage>
                  username not available 😢. try different.
                </FormErrorMessage>
              ))}
          </FormControl>
          <FormControl isInvalid={errors.email !== undefined} my="6">
            <FormLabel htmlFor="email">email</FormLabel>
            <Input
              py="4"
              px="3"
              borderColor="gray.100"
              focusBorderColor="gray.600"
              borderRadius="2px"
              id="email"
              placeholder="john.doe@example.com"
              {...register("email")}
            />
            {errors.email?.message && (
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.password !== undefined} my="6">
            <FormLabel htmlFor="password">password</FormLabel>
            <InputGroup>
              <Input
                py="4"
                px="3"
                borderColor="gray.100"
                focusBorderColor="gray.600"
                borderRadius="2px"
                id="password"
                placeholder="•••••••••••••"
                type={showPass ? "text" : "password"}
                {...register("password")}
              />
              <InputRightElement
                className="cursor"
                onClick={() => setShowPass((c) => !c)}
              >
                {showPass ? <ViewIcon /> : <ViewOffIcon />}
              </InputRightElement>
            </InputGroup>
            {errors.password?.message && (
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.confPassword !== undefined} my="6">
            <FormLabel htmlFor="confirm-password">confirm password</FormLabel>
            <InputGroup>
              <Input
                py="4"
                px="3"
                borderColor="gray.100"
                focusBorderColor="gray.600"
                borderRadius="2px"
                id="confirm-password"
                placeholder="•••••••••••••"
                type={showConfPass ? "text" : "password"}
                {...register("confPassword")}
              />
              <InputRightElement
                className="cursor"
                onClick={() => setShowConfPass((c) => !c)}
              >
                {showConfPass ? <ViewIcon /> : <ViewOffIcon />}
              </InputRightElement>
            </InputGroup>
            {errors.confPassword?.message && (
              <FormErrorMessage>
                {errors.confPassword?.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <AppFormButton loading={loading} text="register" />
        </form>
      </Box>
      <Heading as="h5" fontSize="sm" fontWeight="normal" mt="5">
        Already have an account?{" "}
        <NextLink href="/login" passHref>
          <Link>
            <Heading
              as="small"
              color="dark-bg"
              fontSize="sm"
              fontWeight="semibold"
            >
              log in
            </Heading>
          </Link>
        </NextLink>
      </Heading>
    </Flex>
  );
};

Register.subtitle = "Register";

export default Register;
