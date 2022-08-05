import {
  gql
} from '@apollo/client';

export const filter = `
filter {
  oneOf
  assignedToCur
  assignedTos {
    id
    email
  }
  requesterCur
  requesters {
    id
    email
  }
  companyCur
  companies {
    id
    title
  }
  tags {
    id
    order
    title
    color
  }
  statuses {
    id
    order
    title
    action
    color
  }
  important
  invoiced
  statusDateFrom
  statusDateFromNow
  statusDateTo
  statusDateToNow
  pendingDateFrom
  pendingDateFromNow
  pendingDateTo
  pendingDateToNow
  closeDateFrom
  closeDateFromNow
  closeDateTo
  closeDateToNow
  deadlineFrom
  deadlineFromNow
  deadlineTo
  deadlineToNow
  scheduledFrom
  scheduledFromNow
  scheduledTo
  scheduledToNow
  createdAtFrom
  createdAtFromNow
  createdAtTo
  createdAtToNow

  customAttributes{
    customAttribute{
      id
      title
    }
    text
    number
    selectValues{
      id
      value
    }
  }

}
`

export const GET_MY_FILTERS = gql `
query {
  myFilters {
    title
    id
    order
    createdAt
    updatedAt
    id
    title
    pub
    global
    dashboard
    project {
      id
      title
    }
    roles {
      id
      title
    }
    ${filter}
  }
}
`;

export const DELETE_FILTER = gql `
mutation deleteFilter($id: Int!) {
  deleteFilter(
    id: $id,
  ){
    id
  }
}
`;

export const GET_MY_FILTER = gql `
query myFilter($id: Int!) {
  myFilter(
    id: $id
  ){
    id
    title
    global
    dashboard
    order
    roles {
      id
      title
    }
    ${filter}
    project {
      id
    }
  }
}
`;

export const ADD_FILTER = gql `
mutation addFilter(
  $title: String!,
  $dashboard: Boolean!,
  $filter: FilterInput!
  $projectId: Int,
) {
  addFilter(
    title: $title,
    dashboard: $dashboard,
    filter: $filter,
    projectId: $projectId
){
  title
  id
  createdAt
  updatedAt
  id
  title
  pub
  global
  dashboard
  project {
    id
    title
  }
  roles {
    id
    title
  }
  ${filter}
}
}
`;

export const UPDATE_FILTER = gql `
mutation updateFilter( $id: Int!, $title: String, $dashboard: Boolean!, $filter: FilterInput, $projectId: Int) {
  updateFilter(
    id: $id,
    title: $title,
    dashboard: $dashboard,
    filter: $filter,
    projectId: $projectId
){
  title
  id
  createdAt
  updatedAt
  id
  title
  pub
  global
  dashboard
  project {
    id
    title
  }
  roles {
    id
    title
  }
  ${filter}
}
}
`;


export const FILTERS_SUBSCRIPTION = gql `
  subscription filtersSubscription {
    filtersSubscription
  }
`;
