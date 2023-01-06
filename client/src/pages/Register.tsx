import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { useSnackbar } from "../hooks/ui";
import { auth } from "../services/firebase";
import Button from "../components/Button";

const ErrorBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "55px",
  marginTop: "16px",
  backgroundColor: theme.palette.error.main,
  borderRadius: 4,
}));

const Error = styled(Typography)(({ theme }) => ({
  color: "white",
}));

const schema = yup
  .object({
    name: yup.string().required("Name is required."),
    email: yup
      .string()
      .email("Email must be a valid email.")
      .required("Email is required."),
    password: yup
      .string()
      .min(5, "Password must have at least 6 characters.")
      .required("Password is required."),
  })
  .required();

export type FormData = {
  name: string;
  email: string;
  password: string;
};

const Register: React.FC = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation(
    "signup",
    async (data: FormData) => {
      return await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
    },
    {
      onSuccess: async (userCredential, data) => {
        await updateProfile(userCredential.user, { displayName: data.name });
        await auth.signOut();
        snackbar.show({ message: "Account created! Please login to get started." });
        navigate("/login");
      },
      onError: (error: AuthError) => {
        if (error.code === "auth/email-already-in-use") {
          setError("Email already used.");
        } else {
          setError("An unexpected error occured. Please retry.");
        }
      },
    }
  );

  const onSubmit = useCallback(async (data: FormData) => {
    mutation.mutate(data);
  }, []);

  return (
    <div className="w-full h-screen">
      <nav className="w-full bg-slate-800 flex items-center justify-between py-2 px-8">
        <div>
          <h1 className="text-3xl text-white">
            <a href="#">Gifs Drive</a>
          </h1>
        </div>
        <div className="flex gap-4 text-white text-lg">
          <a className="cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </a>
        </div>
      </nav>

      <main className="container my-8 mx-auto flex justify-center">
        <div className="w-full xl:w-1/2 py-4 px-8 border-2 border-slate-100 rounded-md">
          <h1 className="text-xl font-medium text-center">
            Create A New Account
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-lg font-medium">
                Enter Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="John Doe"
                    size="small"
                    autoFocus
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-lg font-medium">
                Enter Email
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="email"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="john@example.com"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-lg font-medium">
                Enter Password
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="password"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="xxxxxxx"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </div>

            {error && (
              <ErrorBox sx={{ mb: 3 }}>
                <Error variant="subtitle2">{error}</Error>
              </ErrorBox>
            )}

            <div className="mt-3">
              <Button
                disabled={mutation.isLoading}
                loading={mutation.isLoading}
              >
                REGISTER
              </Button>
            </div>
          </form>
          <div className="flex mt-8 justify-center">
            <h2 className="text-lg">
              Already have an account?
              <a className="cursor-pointer underline" onClick={() => navigate("/login")}>
                Click Here to Login
              </a>
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
