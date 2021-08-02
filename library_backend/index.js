const { ApolloServer, UserInputError, gql } = require("apollo-server");
// const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");

//connect to the database
const MONGODB_URI =
  "mongodb+srv://fullstack:stack987_full@cluster0.qa3o1.mongodb.net/library?retryWrites=true";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

console.log("connecting to", MONGODB_URI);

// let authors = [
//   {
//     name: "Robert Martin",
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: "Martin Fowler",
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963,
//   },
//   {
//     name: "Fyodor Dostoevsky",
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821,
//   },
//   {
//     name: "Joshua Kerievsky", // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   {
//     name: "Sandi Metz", // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ];

// /*
//  * Suomi:
//  * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
//  * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
//  *
//  * English:
//  * It might make more sense to associate a book with its author by storing the author's name in the context of the book instead of the author's id
//  * However, for simplicity, we will store the author's name in connection with the book
//  */

// let books = [
//   {
//     title: "Clean Code",
//     published: 2008,
//     author: "Robert Martin",
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Agile software development",
//     published: 2002,
//     author: "Robert Martin",
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ["agile", "patterns", "design"],
//   },
//   {
//     title: "Refactoring, edition 2",
//     published: 2018,
//     author: "Martin Fowler",
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Refactoring to patterns",
//     published: 2008,
//     author: "Joshua Kerievsky",
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "patterns"],
//   },
//   {
//     title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
//     published: 2012,
//     author: "Sandi Metz",
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "design"],
//   },
//   {
//     title: "Crime and punishment",
//     published: 1866,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "crime"],
//   },
//   {
//     title: "The Demon ",
//     published: 1872,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "revolution"],
//   },
// ];

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String
      published: Int
      genres: [String!]
    ): Book
    editAuthor(name: String!, born: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    // authorCount: () => {
    //   return books
    //     .map((item) => item.author)
    //     .filter((el, index, self) => self.indexOf(el) === index).length;
    // },
    allBooks: (root, args) => {
      // if (args.author && args.genre) {
      //   return books.filter(
      //     (book) =>
      //       args.author === book.author && book.genres.includes(args.genre)
      //   );
      // }
      // if (args.author)
      //   return books.filter((book) => args.author === book.author);
      // if (args.genre) {
      //   return books.filter((book) => book.genres.includes(args.genre));
      // }
      return Book.find({});
    },
    allAuthors: () => Author.find({}),
  },

  // Author: {
  //   bookCount: (root) => {
  //     return books.filter((book) => book.author === root.name).length;
  //   },
  // },

  Mutation: {
    addBook: async (root, args) => {
      // console.log(args);
      // const authorExisting = await Author.findOne({ name: args.author });
      // console.log(authorExisting);
      // if (!authorExisting) {
      //   const author = new Author({ name: args.author });
      //   console.log(author);
      //   await author.save();
      // }
      const book = new Book({ ...args });
      console.log(book);
      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return book;
    },
    editAuthor: (root, args) => {
      //
      const foundAuthor = authors.find((author) => author.name === args.name);
      if (!foundAuthor) {
        return null;
      }

      const updatedAuthor = { ...foundAuthor, born: args.born };
      authors = authors.map((a) =>
        a.id === foundAuthor.id ? updatedAuthor : a
      );
      return updatedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
