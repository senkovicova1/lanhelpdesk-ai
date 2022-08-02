import {
  gql
} from '@apollo/client';

const accessRights = `
  login
  vykazy
  publicFilters
  addProjects
  viewErrors
  lanwiki
  cmdb
  pass

  users
  companies
  pausals
  projects
  statuses
  roles
  tripTypes
  imaps
  smtps
  tasklistLayout
  tasklistCalendar
  tasklistPreferences
  customFilters
`;

export const USER_DATA_SUBSCRIPTION = gql `
subscription userDataSubscription {
  userDataSubscription
}
`;

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    active
    username
    email
    name
    surname
    fullName
    receiveNotifications
    signature
    language
    tasklistLayout
    taskLayout
    afterTaskCreate
    tasklistSorts{
      asc
      sort
      layout
    }
    statuses {
      id
      title
      order
      color
      icon
      action
    }
    company {
      id
      title
    }
    role {
      id
      title
      order
      level
      accessRights {
        ${accessRights}
      }
    }
  }
}
`;
