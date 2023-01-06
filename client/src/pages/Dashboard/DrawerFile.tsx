import React, { useCallback, useEffect, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import { TagsInput } from "react-tag-input-component";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useQueryClient } from "react-query";
import Drawer from "../../components/Drawer";
import { fetcher } from "../../services/api";
import { useSnackbar } from "../../hooks/ui";
import { Gif } from "../../services/models";
import Button from "../../components/Button";


const FormContainer = styled("form")({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
});

const schema = yup
  .object({
    name: yup.string().required("Name is required."),
    tags: yup.array().required("Tags are required."),
  })

export type FormData = {
  name: string;
  tags: string[];
};

type Props = {
  gif: Gif | null;
  open: boolean;
  close: (e?: any) => any;
};

const DrawerFile: React.FC<Props> = (props) => {
  const [publicToken, setPublicToken] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({
      name: props.gif?.name || "",
      tags: props.gif?.tags || [],
    });
    if (props.gif?.token) {
      setPublicToken(props.gif.token);
    } else {
      setPublicToken(null);
    }
  }, [props.gif]);

  const updateMutation = useMutation(
    "updateFile",
    (data: any) => {
      return fetcher<"PUT", any>(`/files/${props.gif?.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...data })
      });
    },
    {
      onSuccess: () => {
        props.close();
        reset();
        queryClient.invalidateQueries(["files"]);
        snackbar.show({ message: "Gif updated successfully." });
      },
      onError: () => {
        snackbar.show({ message: "An unexpected error occured. Please retry.", type: "error" });
      },
    }
  );

  const deleteMutation = useMutation(
    "deleteFile",
    (data: any) => {
      return fetcher<"DELETE", any>(`/files/${props.gif?.id}`, {
        method: "DELETE",
      });
    },
    {
      onSuccess: () => {
        props.close();
        reset();
        queryClient.invalidateQueries(["files"]);
        snackbar.show({ message: "Gif deleted successfully." });
      },
      onError: () => {
        snackbar.show({ message: "An unexpected error occured. Please retry.", type: "error" });
      },
    }
  );

  const publicMutation = useMutation(
    "publicFile",
    () => {
      return fetcher<"POST", Gif>(`/files/${props.gif?.id}/public`, {
        method: "POST",
      });
    },
    {
      onSuccess: ({ data }) => {
        setPublicToken(data.token!);
        queryClient.invalidateQueries(["files"]);
        snackbar.show({ message: "Public URL created successfully." });
      },
      onError: () => {
        snackbar.show({ message: "An unexpected error occured. Please retry.", type: "error" });
      },
    }
  );

  const onSubmit = useCallback(async ({ name, tags }: FormData) => {
      updateMutation.mutate({ name, tags });
  }, [updateMutation]);

  const handleClickCreate = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    publicMutation.mutate();
  }, []);

  return (
    <Drawer
      open={props.open}
      close={props.close}
      title="Edit Gif"
      onSave={handleSubmit(onSubmit)}
      onDelete={deleteMutation.mutate}
      loadingSave={updateMutation.isLoading}
      loadingDelete={deleteMutation.isLoading}
      disabledSave={updateMutation.isLoading || deleteMutation.isLoading}
      disabledCancel={updateMutation.isLoading || deleteMutation.isLoading}
      disabledDelete={deleteMutation.isLoading || updateMutation.isLoading}
    >
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Name *"
              size="medium"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              sx={{ mb: 5 }}
            />
          )}
        />
        <Controller
          name="tags"
          control={control}
          render={({ field, fieldState }) => (
            <TagsInput
              {...field}
              placeHolder="Add a new tag"
            />
          )}
        />
        <Box sx={{ mt: 5}}>
          {publicToken && (
            <TextField
              value={`${import.meta.env.VITE_API_BASE_URL}/files/public/${publicToken}`}
              label="Public link"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          )}
          {!publicToken && (
            <span
              onClick={handleClickCreate}
              style={{ cursor: "pointer" }}
            >
              <Button 
                type="button"
                onClick={handleClickCreate}
                loading={publicMutation.isLoading}
                disabled={publicMutation.isLoading}
                size="large"
                fullWidth
              >
                Create public link
              </Button> 
            </span>
          )}

        </Box>
      </FormContainer>
    </Drawer>
  );

};

export default DrawerFile;