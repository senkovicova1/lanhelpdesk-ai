import {
  gql
} from '@apollo/client';

export const LOGIN_USER = gql `
mutation loginUser($email: String!, $password: String!) {
  loginUser(
    email: $email,
    password: $password
  ){
    user{
      fullName
      email
      name
      surname
      id
      role {
        id
        accessRights {
          viewErrors
          publicFilters
          users
          companies
          projects
          statuses
          roles
          tripTypes
          imaps
          smtps
        }
      }
    },
    accessToken
  }
}
`;

export const LOGOUT_USER = gql `
mutation logoutUser {
  logoutUser
}
`;
