import { auth } from "./firebase";
import { apiBaseUrl } from "../utils/config";
import { CustomError } from "../utils/error";

type Method = "GET" | "SEARCH" | "POST" | "PUT" | "DELETE";
type ApiResponse<T> = {
  GET: { data: T };
  SEARCH: { data: T[] };
  POST: { data: T };
  PUT: { data: T };
  DELETE: { data: T } | null;
};
type HttpMethod = {
  GET: "GET";
  SEARCH: "GET";
  POST: "POST";
  PUT: "PUT";
  DELETE: "DELETE";
};
type ResponseType<M extends Method, T> = ApiResponse<T>[M];

export async function fetcher<M extends Method, T>(
  input: RequestInfo,
  init?: RequestInit & { method: HttpMethod[M] }
) {
  const token = await auth.currentUser?.getIdToken();

  const response = await fetch(`${apiBaseUrl}${input}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  if (response.ok) {
    return (await response.json()) as ResponseType<M, T>;
  } else {
    const result = await response.json();
    const error = new CustomError(
      response.status,
      result.errors[0]?.message,
      result.errors
    );
    throw error;
  }
}
