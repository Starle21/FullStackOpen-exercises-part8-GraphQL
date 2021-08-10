import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    // refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    update: (store, response) => {
      // const dataInStore = store.readQuery({ query: ALL_BOOKS });
      // store.writeQuery({
      //   query: ALL_BOOKS,
      //   data: {
      //     ...dataInStore,
      //     allBooks: [...dataInStore.allBooks],
      //   },
      // });
      props.updateCacheWith(response.data.addBook);
    },
    onError: (error) => {
      error.graphQLErrors[0] && props.notify(error.graphQLErrors[0].message);
      error.graphQLErrors[0] || props.notify("Fill out all the input fields");
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    createBook({
      variables: { title, published: parseInt(published), author, genres },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");

    props.setPage("books");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
