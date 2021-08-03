import React from "react";
import Table from "./Table";

import { useQuery } from "@apollo/client";

import { ALL_BOOKS } from "../queries";

const Recommendations = ({ show, user }) => {
  const result = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (!user) return <div>still bad...</div>;

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  const filteredBooks = books.filter((b) => {
    return b.genres.includes(user.favoriteGenre);
  });

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <b>{user.favoriteGenre}</b>
      </div>
      <Table booksToShow={filteredBooks} />
    </div>
  );
};

export default Recommendations;
