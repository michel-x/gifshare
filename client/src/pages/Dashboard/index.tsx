import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useMemo,
} from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "react-query";
import Spinner from "../../components/Spinner";
import GifPreview from "../../components/GifPreview";
import Uploads from "../../components/Upload";
import { useFiles } from "../../hooks/api";
import { useSnackbar } from "../../hooks/ui";
import DrawerFile from "./DrawerFile";
import { auth } from "../../services/firebase";
import { Gif } from "../../services/models";
import { apiBaseUrl } from "../../utils/config";

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "transparent";
};
const Container = styled("main")((props: any) => ({
  borderRadius: "10px",
  border: `2px dashed ${getColor(props)}`,
  outline: "none",
  transition: "border 0.34s ease-in-out",
}));

type UploadProgress = {
  filename: string;
  total: number;
  loaded: number;
  uploadId: string;
  status: "uploading" | "done" | "error";
  message?: string;
};

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedGif, setSelectedGif] = useState<Gif | null>(null);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  const { data: dataFiles, isLoading: isLoadingFile } = useFiles();

  const handleDeleteUpload = useCallback((uploadId: string) => {
    setUploads((uploads) =>
      uploads.filter((upload) => upload.uploadId !== uploadId)
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isFocused,
    isDragReject,
  } = useDropzone({
    accept: {
      'image/gif': ['.gif'],
    },
    maxSize: 10 * 1024 * 1024,
    noClick: true,
    noKeyboard: true,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) { 
        const initialUploads: UploadProgress[] = [];

        fileRejections.forEach((rejection) => {
          const uploadId = Math.floor(Math.random() * 1000000).toString();
          initialUploads.unshift({
            filename: rejection.file.name,
            total: rejection.file.size,
            loaded: 0,
            uploadId,
            status: "error",
            message: rejection.errors[0].message,
          });
        });
        setUploads((prevUploads) => ([...initialUploads, ...prevUploads]));
      }

      if (acceptedFiles.length > 0) {
        const uploadPromises: Promise<any>[] = [];
        const initialUploads: UploadProgress[] = [];

        acceptedFiles.forEach((file) => {
          const uploadId = Math.floor(Math.random() * 1000000).toString();
          initialUploads.unshift({  
            filename: file.name,
            total: file.size,
            loaded: 0,
            status: "uploading",
            uploadId
          });
          uploadPromises.push(uploadFile(file, uploadId.toString()));
        });

        setUploads((prevUploads) => ([...initialUploads, ...prevUploads]));

        try {
          await Promise.all(uploadPromises);
          snackbar.show({ message: "Gifs uploaded successfully." });
        } catch (error) {
          snackbar.show({ message: "An unexpected error occured. Please retry", type: "error" });
        } finally {
          queryClient.invalidateQueries(["files"]);
        }
      }
    },
  });

  const uploadFile = useCallback(async (file: File, uploadId: string) => {
    const formData = new FormData();
    formData.append('gif', file);
    const token = await auth.currentUser?.getIdToken();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
      onUploadProgress: function(progressEvent: any) {
        setUploads((uploads) => uploads.map((upload) => {
          if (upload.uploadId === uploadId) {
            return {
              ...upload,
              loaded: progressEvent.loaded,
              status: progressEvent.loaded === progressEvent.total ? "done" : "uploading",
            };
          }
          return upload;
        }));
      }
    };

    await axios.post(`${apiBaseUrl}/files`, formData, config);
  }, []);

  const filteredGifs = useMemo(() => {
    return dataFiles?.data.filter((gif: Gif) => {
      return (
        gif.name.toLowerCase().includes(search.toLowerCase()) ||
        gif.tags.some((tag: string) =>
          tag.toLowerCase().includes(search.toLowerCase())
        )
      );
    });
  }, [dataFiles, search]);

  
  const closeDrawer = useCallback(() => {
    setOpenDrawer(false);
    setSelectedGif(null);
  }, []);
  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  return (
    <>
      <div className="container my-10 mx-auto">
        <input
          value={search}
          onChange={onChangeSearch}
          placeholder="Search your GIFs by name or tags..."
          className="py-4 px-4 w-full drop-shadow-sm rounded-md outline-blue-100"
        />
      </div>

      <Container
        {...getRootProps({ isDragAccept, isFocused, isDragReject })}
        className="container mx-auto flex justify-center"
      >
        <input {...getInputProps()} />
        <div className="w-full xl:w-2/3">
          <Box 
            className="py-4 px-4 my-4 bg-white rounded-md drop-shadow-sm flex flex-wrap items-center gap-4"
            sx={{ minHeight: "250px" }}
          >
            {isLoadingFile ? (
              <Spinner />
            ) : (
              <>
                {filteredGifs!?.length > 0 && (
                  filteredGifs?.map((gif) => (
                    <GifPreview
                      key={gif.id}
                      gif={gif}
                      onClick={() => {
                        setOpenDrawer(true);
                        setSelectedGif(gif);
                      }}
                    />
                  ))
                )}
                {filteredGifs?.length === 0 && (
                  <Box
                    className="flex justify-center items-center w-full"
                  >
                    <Typography variant="h5" color="textSecondary"> 
                      {dataFiles?.data?.length === 0 ? "Drag and drop your GIFs here !" : "No GIF matches your search."}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </div>
      </Container>
      
      {uploads.length > 0 && (
        <Uploads 
          uploads={uploads} 
          onDelete={handleDeleteUpload}
        />
      )}

      <DrawerFile 
        gif={selectedGif} 
        open={openDrawer} 
        close={closeDrawer} 
      />
    </>
  );
};

export default Dashboard;
