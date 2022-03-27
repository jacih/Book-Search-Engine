import { gql } from 'graphql-tag';

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook( $input: SavedBook) {
    saveBook(input: $input) {
      _id
      username
      bookCount
      savedBooks {
        bookId
        title
        authors
        image
        description
        link
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: String!) {
    deleteBook(book: $bookId) {
      _id
      username
      bookCount
      savedBooks {
        bookId
        title
        authors
        image
        description
        link
      }
    }
  }
`;