import React, { useEffect, useState } from "react";
import Table from "./Table";

import { useQuery, useLazyQuery } from "@apollo/client";

import { ALL_BOOKS } from "../queries";

const Recommendations = ({ show, user }) => {
  // const result = useQuery(ALL_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState(null);
  const [getBooksGenre, resultGenre] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: "network-only",
  });

  // first render
  useEffect(() => {
    if (user) {
      // return getBooksGenre(user.favoriteGenre);
      return getBooksGenre({ variables: { genres: [user.favoriteGenre] } });
    }
  }, [user]); // eslint-disable-line

  // when data from query changes
  useEffect(() => {
    if (resultGenre.data) {
      setFilteredBooks(resultGenre.data.allBooks);
    }
  }, [resultGenre.data]); // eslint-disable-line

  if (!show) {
    return null;
  }
  if (!user) return <div>no user...</div>;

  console.log(filteredBooks);

  if (resultGenre.loading || resultGenre.data === null) {
    return <div>loading...</div>;
  }

  // const books = result.data.allBooks;

  // const filteredBooks = books.filter((b) => {
  //   return b.genres.includes(user.favoriteGenre);
  // });

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
