export const dashboard = {
  project: {
    id: -1,
    title: 'All projects',
    label: 'All projects',
    labelId: 'allProjects',
    value: null
  },
  id: -1,
  title: 'All projects',
  label: 'All projects',
  labelId: 'allProjects',
  value: null
};

export const getEmptyGeneralFilter = () => ( {
  dashboard: false,
  global: false,
  id: null,
  project: null,
  pub: false,
  title: "",
  filter: getEmptyFilter(),
  roles: null,
} )

export const getEmptyFilter = () => ( {
  assignedToCur: false,
  assignedTos: [],
  requesterCur: false,
  requesters: [],
  companyCur: false,
  companies: [],
  tags: [],
  statuses: [],
  oneOf: [],

  statusDateFrom: null,
  statusDateFromNow: false,
  statusDateTo: null,
  statusDateToNow: false,
  closeDateFrom: null,
  closeDateFromNow: false,
  closeDateTo: null,
  closeDateToNow: false,
  pendingDateFrom: null,
  pendingDateFromNow: false,
  pendingDateTo: null,
  pendingDateToNow: false,
  deadlineFrom: null,
  deadlineFromNow: false,
  deadlineTo: null,
  deadlineToNow: false,

  scheduledFrom: null,
  scheduledFromNow: false,
  scheduledTo: null,
  scheduledToNow: false,

  createdAtFrom: null,
  createdAtFromNow: false,
  createdAtTo: null,
  createdAtToNow: false,

  important: null,
  invoiced: null,

  customAttributes: [],
} )
