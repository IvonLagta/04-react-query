import axios, { AxiosResponse } from "axios";
import { TMDBSearchResponse } from "../types/movie";

const ACCESS_TOKEN = ${{ secrets.VITE_TMDB_ACCESS_TOKEN }};
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<TMDBSearchResponse> => {
  const response: AxiosResponse<TMDBSearchResponse> = await axios.get(
    `${BASE_URL}/search/movie`,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      params: {
        query: query,
        page: page,
        language: "en-US",
        include_adult: false,
      },
    },
  );

  return response.data;
};
