import axios from "axios";
import type { Movie } from "../types/movie";

export interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const BASE_URL = "https://api.themoviedb.org/3/search/movie";

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<MoviesResponse> {
  if (!query) {
    return {
      results: [],
      page: 1,
      total_pages: 0,
      total_results: 0,
    };
  }

  const response = await axios.get<MoviesResponse>(BASE_URL, {
    params: {
      query,
      language: "en-US",
      page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      accept: "application/json",
    },
  });

  return response.data;
}