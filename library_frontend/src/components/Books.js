import React, { useState } from "react";
import Table from "./Table";

import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const result = useQuery(ALL_BOOKS);
  const [genre, setGenre] = useState("all");

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }
  const books = result.data.allBooks;

  // filtering functionality
  const genres = [...new Set(books.flatMap((b) => b.genres))];
  const filteredBooks = books.filter((b) => {
    if (genre === "all") return books;
    return b.genres.includes(genre);
  });

  const filterGenre = (genreToFilter) => {
    setGenre(genreToFilter);
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
