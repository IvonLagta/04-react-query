import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import ReactPaginateModule from "react-paginate";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import { Movie } from "../../types/movie";
import css from "./App.module.css";
import { TMDBSearchResponse } from "../../services/movieService";

const ReactPaginate =
  (ReactPaginateModule as any)?.default ?? ReactPaginateModule;

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<TMDBSearchResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query.trim(),
    placeholderData: (previousData) => previousData,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast.error("No movies found");
    }
  }, [isSuccess, movies.length]);

  const handleSearchSubmit = (searchQuery: string) => {
    if (searchQuery.trim() === query.trim()) return;
    setQuery(searchQuery.trim());
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearchSubmit} />

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {!isLoading && !isError && query && (
        <>
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
              breakLabel="..."
            />
          )}
        </>
      )}

      <MovieModal movie={selectedMovie} onClose={handleCloseModal} />

      <Toaster position="top-center" />
    </>
  );
};

export default App;
