import React, { useState } from "react";

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

  // filtering functionality
  const books = result.data.allBooks;
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

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
