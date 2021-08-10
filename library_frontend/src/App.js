import React, { useEffect, useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

import { BOOK_ADDED, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [type, setType] = useState(null);

  const [user, setUser] = useState(null);

  const client = useApolloClient();

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      console.log(subscriptionData);
      notify(`Book named ${addedBook.title} was added!`, "notify");
      updateCacheWith(addedBook);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    const user = localStorage.getItem("loggedInUser");
    if (token) {
      setToken(token);
    }
    if (user) setUser(JSON.parse(user));
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  const notify = (message, type = "error") => {
    setErrorMessage(message);
    setType(type);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const showPage = async (page) => {
    setPage(page);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token === null ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => showPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <Notify errorMessage={errorMessage} type={type} />

      <Authors show={page === "authors"} notify={notify} token={token} />

      <Books show={page === "books"} />

      <NewBook
        show={page === "add"}
        setPage={setPage}
        notify={notify}
        updateCacheWith={updateCacheWith}
      />

      <Recommendations show={page === "recommend"} user={user} />

      <LoginForm
        show={page === "login"}
        setError={notify}
        setToken={setToken}
        setPage={setPage}
        setUser={setUser}
      />
    </div>
  );
};

const Notify = ({ errorMessage, type }) => {
  if (!errorMessage) {
    return null;
  }
  if (type === "notify") {
    return <div style={{ color: "green" }}>{errorMessage}</div>;
  }

  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

export default App;
