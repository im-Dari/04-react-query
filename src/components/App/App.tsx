import { useState, useEffect, type ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate, { type ReactPaginateProps } from "react-paginate";
import { fetchMovies, type MoviesResponse } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

const Paginate = (
  (ReactPaginate as unknown as { default: ComponentType<ReactPaginateProps> })
    .default || ReactPaginate
) as ComponentType<ReactPaginateProps>;

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching, isSuccess } = useQuery<MoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim().length > 0,
    placeholderData: (previousData: MoviesResponse | undefined) => previousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0 && query !== "") {
      toast.error("No movies found for your request.", {
        duration: 4000,
        position: "top-right",
      });
    }
  }, [isSuccess, data, query]);

  const handleSearch = (searchQuery: string): void => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = (event: { selected: number }): void => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const movies: Movie[] = data?.results ?? [];
  const totalPages: number = data?.total_pages ?? 0;

  return (
    <div className={css.appContainer}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />

          {totalPages > 1 && (
            <Paginate
              pageCount={totalPages > 500 ? 500 : totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {}
      {!isLoading && !isError && query !== "" && movies.length === 0 && (
        <p className={css.infoText}>No movies found for your request.</p>
      )}

      {isFetching && !isLoading && (
        <div className={css.fetchingBadge}>Updating...</div>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}