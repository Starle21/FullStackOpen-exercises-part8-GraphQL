import React, { useState, useEffect } from "react";
// import Select from "react-select";

import { useMutation } from "@apollo/client";

import { EDIT_AUTHOR } from "../queries";

const AuthorForm = ({ notify, authors }) => {
  // const [name, setName] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [born, setBorn] = useState("");

  const [updateAuthor, response] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      notify(error.graphQLErrors[0].message);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    await updateAuthor({
      variables: { name: selectedOption, born },
    });

    setSelectedOption("");
    setBorn("");
  };

  useEffect(() => {
    if (response.data && response.data.editAuthor === null) {
      notify("author not found");
    }
  }, [response.data]); // eslint-disable-line

  // const options = authors.map((a) => {
  //   return { label: a.name, value: a.name };
  // });

  return (
    <div>
      <h2>update author</h2>
      <form onSubmit={submit}>
        {/* <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div> */}

        {/* <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        /> */}

        <select
          value={selectedOption}
          onChange={({ target }) => setSelectedOption(target.value)}
        >
          <option default>Select...</option>
          {authors.map((a) => {
            return (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            );
          })}
        </select>
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
