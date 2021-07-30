import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { EDIT_AUTHOR } from "../queries";

const AuthorForm = ({ notify }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [updateAuthor, response] = useMutation(EDIT_AUTHOR);

  const submit = async (event) => {
    event.preventDefault();

    updateAuthor({
      variables: { name, born },
    });

    setName("");
    setBorn("");
  };

  useEffect(() => {
    if (response.data && response.data.editAuthor === null) {
      notify("author not found");
    }
  }, [response.data]); // eslint-disable-line

  return (
    <div>
      <h2>update author</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>
        <button type="submit">update birth year of the author</button>
      </form>
    </div>
  );
};

export default AuthorForm;
