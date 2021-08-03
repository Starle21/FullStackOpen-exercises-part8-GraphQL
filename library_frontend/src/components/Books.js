import React, { useState, useEffect } from "react";
import Table from "./Table";

import { useQuery, useLazyQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const result = useQuery(ALL_BOOKS);
  const [genre, setGenre] = useState("all");
  const [filteredBooks, setFilteredBooks] = useState(null);
  const [getBooksGenres, resultGenres] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (result.data) {
      setFilteredBooks(result.data.allBooks);
    }
  }, [result.data]); // eslint-disable-line

  useEffect(() => {
    if (resultGenres.data) {
      console.log("setFilteredBooks", resultGenres.data.allBooks);
      setFilteredBooks(resultGenres.data.allBooks);
    }
  }, [resultGenres.data]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;
  const genres = [...new Set(books.flatMap((b) => b.genres))];

  // filtering functionality with React
  // const filteredBooks = books.filter((b) => {
  //   if (genre === "all") return books;
  //   return b.genres.includes(genre);
  // });

  // const filterGenre = (genreToFilter) => {
  //   setGenre(genreToFilter);
  // };

  // filtering functionality with Apollo
  const filterGenre = async (genreToFilter) => {
    setGenre(genreToFilter);
    if (genreToFilter === "all") {
      return getBooksGenres();
    }
    getBooksGenres({
      variables: { genres: [genreToFilter] },
    });
  };

  return (
    <div>
      <h2>books</h2>
      <div>
        filtering in genre <b>{genre}</b>
      </div>
      <Table booksToShow={filteredBooks} />
      <div>
        {genres.map((g) => {
          return (
            <button key={g} onClick={() => filterGenre(g)}>
              {g}
            </button>
          );
        })}
        <button onClick={() => filterGenre("all")}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
