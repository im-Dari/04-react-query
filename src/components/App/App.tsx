import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";


const Paginate = (ReactPaginate as unknown as { default: React.ElementType }).default || ReactPaginate;
export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0, 
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (searchQuery: string): void => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = (event: { selected: number }): void => {
    const selectedPage = event.selected + 1;
    setPage(selectedPage);
  
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const movies: Movie[] = data?.results ?? [];
  const totalPages: number = data?.total_pages ?? 0;

  return (
    <div className={css.appContainer}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      {}
      {isLoading && <Loader />}

      {}
      {isError && <ErrorMessage />}

      {}
      {!isLoading && !isError && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />

          {}
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

      {}
      {isFetching && !isLoading && (
        <div className={css.fetchingBadge}>Update...</div>
      )}

      {}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}