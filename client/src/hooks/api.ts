import { useQuery } from "react-query";
import { fetcher } from "../services/api";
import { Gif } from "../services/models";

export function useFiles() {
    return useQuery(["files"], () => fetcher<"SEARCH", Gif>("/files"));
}