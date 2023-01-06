import React from "react";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Clear from "@mui/icons-material/Clear";

type Props = {
  uploads: { 
    filename: string; 
    total: number; 
    loaded: number;
    uploadId: string;
    status: "uploading" | "done" | "error";
    message?: string; 
  }[];
  onDelete: (uploadId: string) => void;
};

const Uploads: React.FC<Props> = ({ uploads, onDelete }) => {
  const theme = useTheme();
  const errorUploads = uploads.filter(upload => upload.status === "error");
  const uploadingOrDoneUploads = uploads.filter(upload => upload.status === "uploading" || upload.status === "done");
  return (
    <div className="py-4 px-4 my-4 mx-4 bg-white rounded-md drop-shadow-md fixed right-0 bottom-0 downloading-wrapper w-1/2">
      <h2 className="text-lg font-medium">Uploading...</h2>
      {[...uploadingOrDoneUploads, ...errorUploads].map(upload => {
        const percentage = upload.status === "error" ? 100 : Math.min(Math.round((upload.loaded * 100) / upload.total), 100);
        return (
          <div className="mt-4">
            <div className="flex justify-between w-full">
              <p className="mb-2"> {upload.filename} </p>
              {upload.status !== "uploading" && (
                <IconButton onClick={() => onDelete(upload.uploadId)}>
                  <Clear />
                </IconButton>)}
            </div>
            <div className="w-full bg-gray-200 rounded-full mb-2">
              <div 
                style={{ 
                  width: `${percentage}%`, 
                  color: 'white',
                  backgroundColor: upload.status === "error" ? theme.palette.error.main : "" 
                }}
                className={`bg-slate-800 text-xs font-medium text-blue-100 
                  text-center p-0.5 leading-none rounded-l-full 
                  ${percentage >= 100 ? 'bg-green-600' : ''}
                  ${percentage >= 95 ? 'rounded-r-full' : ''}`}
              >
                { upload.status === "error" ? upload.message : `${percentage}%` }
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Uploads;
