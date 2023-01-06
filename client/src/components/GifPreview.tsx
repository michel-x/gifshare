import React from "react";
import { Gif } from "../services/models";


type Props = {
  gif: Gif;
  onClick?: () => void;
};

const GifPreview: React.FC<Props> = ({ gif: { name, url, tags }, onClick }) => {
  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer"
      onClick={onClick}
    >
      <div
        className="w-40 h-40 border border-slate-100 rounded-md flex items-center justify-center relative"
        data-modal="gif-modal"
      >
        {tags?.length > 0 && (
          <div className="absolute top-1 left-1 right-1 flex flex-wrap text-xs">
            {tags.map((tag) => (
              <div key={tag} className="bg-gray-600 text-white py-1 px-2 rounded-md m-1 drop-shadow-sm">
                {tag}
              </div>
            ))}
          </div>
        )}
        <img className="w-full h-full" src={url} alt="gif" style={{ width: "auto", maxWidth: "100%", objectFit: "contain" }} />
      </div>
      <div>
        <h3 className="font-medium"> {name} </h3>
      </div>
    </div>
  );
};

export default GifPreview;
