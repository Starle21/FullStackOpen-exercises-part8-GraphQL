import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { LOGIN, ME } from "../queries";

const LoginForm = ({ setError, setToken, show, setPage, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [getUser] = useLazyQuery(ME, {
    onCompleted: (data) => {
      console.log("from me", data);
      setUser(data.me);
      localStorage.setItem("loggedInUser", JSON.stringify(data.me));
    },
  });

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      console.log(result.data);
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      getUser();
      setPage("authors");
    }
  }, [result.data]); // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault();
    const { data } = await login({ variables: { username, password } });
    console.log(data);
    setUsername("");
    setPassword("");
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
