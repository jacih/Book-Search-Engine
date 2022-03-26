import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login( $email: String!, $password: String!) {
    login( email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser( $username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($book: savedBook!) {
    saveBook(book: $book) {
      username
      email
      bookCount
      savedBooks {
        # _id
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      username
      email
      bookCount
      savedBooks {
        #_id
        bookId
        title        
        authors
        description
        image
        link
      }
    }
  }
`;