import {
  gql
} from '@apollo/client';

export const groupRights = `
  projectRead
  projectWrite

  companyTasks
  allTasks

  tasklistDnD
  tasklistKalendar
  tasklistGantt
  tasklistStatistics

  addTask

  deleteTask
  taskImportant
  taskTitleWrite
  taskProjectWrite
  taskDescriptionRead
  taskDescriptionWrite
  taskAttachmentsRead
  taskAttachmentsWrite

  taskSubtasksRead
  taskSubtasksWrite
  taskWorksRead
  taskWorksWrite
  taskWorksAdvancedRead
  taskWorksAdvancedWrite
  taskMaterialsRead
  taskMaterialsWrite
  taskPausalInfo

  viewComments
  addComments
  internal
  emails
  history
`;

export const projectAttributeRights = `
  status {
    required
    add
    view
    edit
  }
  tags {
    required
    add
    view
    edit
  }
  assigned {
    required
    add
    view
    edit
  }
  requester {
    required
    add
    view
    edit
  }
  company {
    required
    add
    view
    edit
  }
  startsAt {
    required
    add
    view
    edit
  }
  deadline {
    required
    add
    view
    edit
  }
  repeat {
    add
    view
    edit
  }
`;

const listTasks = `
tasks {
  id
  title
  assignedTo {
    id
    fullName
    email
  }
  startsAt
  deadline
  requester{
    id
    fullName
    email
  }
  status {
    id
    title
    order
    color
    action
  }
}
count
execTime
secondaryTimes {
  time
  source
}
`

export const GET_TASKS = gql`
query tasks(
  $projectId: Int
  $milestoneId: Int
  $filter: FilterInput
  $sort: SortTasksInput
  $milestoneSort: Boolean
  $search: String
  $stringFilter: StringFilterInput
  $limit: Int
  $page: Int
  $statuses: [Int]
  $invoiced: Boolean
){
  tasks (
    milestoneId: $milestoneId
    projectId: $projectId
    filter: $filter
    sort: $sort
    milestoneSort: $milestoneSort
    search: $search
    stringFilter: $stringFilter
    limit: $limit
    page: $page
    statuses: $statuses
    invoiced: $invoiced
  ){
    ${listTasks}
  }
}
`;

const responseTask = `
  id
  important
  invoiced
  invoicedDate
  title
  ganttOrder
  updatedAt
  createdAt
  closeDate
  metadata{
    subtasksApproved
    subtasksPending
    tripsApproved
    tripsPending
    materialsApproved
    materialsPending
    itemsApproved
    itemsPending
  }
  taskAttachments{
    id
    path
    filename
    size
    mimetype
  }
  assignedTo {
    id
    name
    surname
    fullName
    email
  }
  company {
    id
    title
    dph
  }
  createdBy {
    id
    name
    surname
  }
  startsAt
  deadline
  description
  milestone{
    id
    title
  }
  pendingDate
  project{
    id
    title
    autoApproved
  }
  requester{
    id
    fullName
  }
  status {
    id
    title
    color
    action
  }
  tags {
    id
    title
    color
    order
  }
  repeat {
    id
    repeatEvery
    repeatInterval
    startsAt
    active
  }
  repeatTime{
    triggersAt
  }
  shortSubtasks{
    id
    title
    done
  }
  subtasks {
    scheduled {
      from
      to
    }
    id
    title
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    discount
    assignedTo {
      id
      fullName
      email
      company {
        id
      }
    }
    price
  }
  workTrips {
    scheduled {
      from
      to
    }
    id
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    discount
    type {
      id
      title
    }
    assignedTo {
      id
      fullName
      email
      company {
        id
      }
    }
    price
  }
  materials {
    id
    title
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    margin
    price
  }
  customAttributes{
    customAttribute{
      id
    }
    text
    number
    selectValues{
      id
      value
    }
  }
`

export const ADD_TASK = gql`
  mutation addTask(
    $important: Boolean,
    $title: String!,
    $ganttOrder: Int,
    $closeDate: String,
    $assignedTo: [Int]!,
    $company: Int!,
    $startsAt: String,
    $deadline: String,
    $description: String!,
    $milestone: Int,
    $pendingChangable: Boolean,
    $pendingDate: String,
    $project: Int!,
    $requester: Int,
    $status: Int!,
    $tags: [Int]!,
    $repeat: TaskRepeatInput,
    $subtasks: [SubtaskInput],
    $workTrips: [WorkTripInput],
    $materials: [MaterialInput],
    $shortSubtasks: [ShortSubtaskInput],
    $customAttributes: [CustomAttributeValueInput]
  ){
    addTask(
      important: $important,
      title: $title,
      ganttOrder: $ganttOrder,
      closeDate: $closeDate,
      assignedTo: $assignedTo,
      company: $company,
      startsAt: $startsAt,
      deadline: $deadline,
      description: $description,
      milestone: $milestone,
      pendingChangable: $pendingChangable,
      pendingDate: $pendingDate,
      project: $project,
      requester: $requester,
      status: $status,
      tags: $tags,
      repeat: $repeat,
      subtasks: $subtasks,
      workTrips: $workTrips,
      materials: $materials,
      shortSubtasks: $shortSubtasks,
      customAttributes: $customAttributes,
    ){
      id
      title
      repeat{
        repeatTemplate{
          id
        }
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($id: Int!, $fromInvoice: Boolean) {
    deleteTask(
      id: $id,
      fromInvoice: $fromInvoice,
    ){
      id
    }
  }
`;

export const GET_TASK = gql`
  query task($id: Int!, $fromInvoice: Boolean){
    task(
      id: $id
      fromInvoice: $fromInvoice
    )  {
      ${responseTask}
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask(
    $id: Int!,
    $important: Boolean,
    $title: String,
    $ganttOrder: Int,
    $closeDate: String,
    $assignedTo: [Int],
    $company: Int,
    $startsAt: String,
    $deadline: String,
    $description: String,
    $milestone: Int,
    $pendingChangable: Boolean,
    $pendingDate: String,
    $project: Int,
    $requester: Int,
    $status: Int,
    $tags: [Int],
    $fromInvoice: Boolean
    $customAttributes: [CustomAttributeValueInput]
  ) {
    updateTask(
      id: $id,
      important: $important,
      title: $title,
      ganttOrder: $ganttOrder,
      closeDate: $closeDate,
      assignedTo: $assignedTo,
      company: $company,
      startsAt: $startsAt,
      deadline: $deadline,
      description: $description,
      milestone: $milestone,
      pendingChangable: $pendingChangable,
      pendingDate: $pendingDate,
      project: $project,
      requester: $requester,
      status: $status,
      tags: $tags,
      fromInvoice: $fromInvoice
      customAttributes: $customAttributes,
    ){
      ${responseTask}
    }
  }
`;

export const SET_AFTER_TASK_CREATE = gql`
  mutation setAfterTaskCreate($afterTaskCreate: Int!) {
    setAfterTaskCreate(
      afterTaskCreate: $afterTaskCreate
    ){
      afterTaskCreate
    }
  }
`;

export const ADD_TASK_SUBSCRIPTION = gql`
  subscription taskAddSubscription {
    taskAddSubscription
  }
`;

export const DELETE_TASK_ATTACHMENT = gql`
  mutation deleteTaskAttachment($id: Int!) {
    deleteTaskAttachment(
      id: $id,
    ){
      id
    }
  }
`;

export const TASK_DELETE_SUBSCRIPTION = gql`
    subscription taskDeleteSubscription( $taskId: Int! ) {
      taskDeleteSubscription( taskId: $taskId )
    }
`;