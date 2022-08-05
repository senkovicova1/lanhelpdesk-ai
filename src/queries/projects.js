import {
  gql
} from '@apollo/client';

import {
  filter,
} from './filters';

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

export const projectAttributes = `
  status {
    fixed
    value {
      id
      title
    }
  }
  tags {
    fixed
    value {
      id
      title
    }
  }
  assigned {
    fixed
    value {
      id
      email
      fullName
    }
  }
  requester {
    fixed
    value {
      id
      email
      fullName
    }
  }
  company {
    fixed
    value {
      id
      title
    }
  }
  startsAt {
    fixed
    value
  }
  deadline {
    fixed
    value
  }
`;

export const GET_MY_PROJECTS = gql `
  query myProjects( $fromInvoice: Boolean ) {
    myProjects( fromInvoice: $fromInvoice ) {
      project {
        id
        title
        lockedRequester
        autoApproved
        hideApproved
        archived
        milestones {
          id
          title
          endsAt
        }
        tags {
          id
          title
          order
          color
        }
        statuses {
          id
          title
          order
          color
          icon
          action
        }
        projectAttributes {
          ${projectAttributes}
        }
        projectFilters {
          id
          title
          order
          ${filter}
        }
        viewCustomAttributes{
          id
          title
          order
          type
          required
          defaultValue{
            number
            text
          }
          selectValues{
            id
            def
            order
            value
          }
        }
        editCustomAttributes{
          id
          title
          order
          type
          required
          defaultValue{
            number
            text
          }
          selectValues{
            id
            def
            order
            value
          }
        }
        addCustomAttributes{
          id
          title
          order
          type
          required
          defaultValue{
            number
            text
          }
          selectValues{
            id
            def
            order
            value
          }
        }
      }
      right {
        ${groupRights}
      }
      attributeRights {
        ${projectAttributeRights}
      }
      usersWithRights {
        user{
          id
          fullName
        }
        assignable
      }
    }
  }
`;

export const GET_PROJECTS = gql `
  query {
    projects {
      id
      title
      right{
        projectWrite
      }
      attributeRights{
        assigned {
          view
        }
      }
    }
  }
`;

const responseProject = `
  id
  title
  description
  lockedRequester
  autoApproved
  hideApproved
  archived
  statuses {
    id
    title
    order
    color
    icon
    action
  }
  attachments {
    id
    path
    filename
    size
    mimetype
  }
  groups {
    id
    title
    def
    admin
    description
    order
    rights{
      ${groupRights}
    }
    attributeRights {
      ${projectAttributeRights}
    }
    users {
      id
      email
    }
    companies {
      id
      title
    }
  }
  tags {
    id
    title
    order
    color
  }
  projectFilters {
    id
    title
    description
    active
    order
    ${filter}
    groups {
      id
      title
    }
  }
  customAttributes{
    id
    title
    order
    type
    required
    selectValues{
      id
      def
      order
      value
    }
    addGroups{
      id
      admin
      def
      title
      description
      order
      users{
        id
      }
      companies{
        id
      }
      project{
        id
      }
    }
    viewGroups{
      id
      admin
      def
      title
      description
      order
      users{
        id
      }
      companies{
        id
      }
      project{
        id
      }
    }
    editGroups{
      id
      admin
      def
      title
      description
      order
      users{
        id
      }
      companies{
        id
      }
      project{
        id
      }
    }
    defaultValue{
      text
      number
    }
  }
  automationEvents{
    id
    active
    title
    description
    order
    taskChange
    conditions{
      id
      orGroup
      condition
      source
      targetDatas{
        id
        type
        text
        date
        number
        boolean
        isNull
      }
      users{
        id
        fullName
      }
      companies{
        id
        title
      }
      project{
        id
        title
      }
      customSelectValues{
        id
        value
      }
      customAttribute{
        id
        title
        selectValues{
          id
          value
        }
      }
    }
    actions{
      id
      target
      action
      values{
        id
        type
        text
        date
        number
        boolean
        isNull
      }
      users{
        id fullName
      }
      company{
        id
        title
      }
      customSelectValues{
        id
        value
      }
      customAttribute{
        id
        title
        selectValues{
          id
          value
        }
      }
    }
  }
  automationTimers{
    id
    active
    title
    description
    order
    conditions{
      id
      orGroup
      condition
      source
      targetDatas{
        id
        type
        text
        date
        number
        boolean
        isNull
      }
      users{
        id
        fullName
      }
      companies{
        id
        title
      }
      projects{
        id
        title
      }
      customSelectValues{
        id
        value
      }
      customAttribute{
        id
        title
        selectValues{
          id
          value
        }
      }
    }
    actions{
      id
      target
      action
      values{
        id
        type
        text
        date
        number
        boolean
        isNull
      }
      users{
        id fullName
      }
      company{
        id
        title
      }
      customSelectValues{
        id
        value
      }
      customAttribute{
        id
        title
        selectValues{
          id
          value
        }
      }
    }
  }
  projectAttributes {
    ${projectAttributes}
  }
`

export const ADD_PROJECT = gql `
  mutation addProject(
    $title: String!
    $description: String!
    $lockedRequester: Boolean!
    $autoApproved: Boolean!
    $hideApproved: Boolean!
    $archived: Boolean!
    $projectAttributes: ProjectAttributesInput!
    $tags: [NewTagInput]!
    $statuses: [NewStatusInput]!
    $filters: [ProjectFilterInput]!
    $userGroups: [UserGroupInput]!
    $companyGroups: [CompanyGroupInput]!
    $groups: [ProjectGroupInput]!
    $customAttributes: [CustomAttributeAddInput]!
    $automationEvents: [AutomationEventInput]!
    $automationTimers: [AutomationTimerInput]!
  ) {
    addProject(
      title: $title
      description: $description
      lockedRequester: $lockedRequester
      autoApproved: $autoApproved
      hideApproved: $hideApproved
      archived: $archived
      projectAttributes: $projectAttributes
      tags: $tags
      statuses: $statuses
      filters: $filters
      userGroups: $userGroups
      companyGroups: $companyGroups
      groups: $groups
      customAttributes: $customAttributes
      automationEvents: $automationEvents
      automationTimers: $automationTimers
    ){
      ${responseProject}
    }
  }
`;

export const GET_PROJECT = gql `
  query project($id: Int!) {
    project(
      id: $id
    ){
      ${responseProject}
    }
  }
`;

export const UPDATE_PROJECT = gql `
  mutation updateProject(
    $id: Int!
    $title: String
    $description: String
    $lockedRequester: Boolean
    $autoApproved: Boolean
    $hideApproved: Boolean!
    $archived: Boolean
    $projectAttributes: ProjectAttributesInput

    $addTags: [NewTagInput]!
    $updateTags: [TagUpdateInput]!
    $deleteTags: [Int]!

    $addStatuses: [NewStatusInput]!
    $updateStatuses: [UpdateStatusInput]!
    $deleteStatuses: [Int]!

    $addFilters: [ProjectFilterInput]!
    $updateFilters: [ProjectFilterInput]!
    $deleteFilters: [Int]!

    $userGroups: [UserGroupUpdateInput]!
    $companyGroups: [CompanyGroupUpdateInput]!

    $addGroups: [ProjectGroupInput]!
    $updateGroups: [ProjectGroupInput]!
    $deleteGroups: [Int]!

    $addCustomAttributes: [CustomAttributeAddInput]!
    $updateCustomAttributes: [CustomAttributeUpdateInput]!
    $deleteCustomAttributes: [Int]!

    $addAutomationEvents: [AutomationEventInput]!
    $updateAutomationEvents: [AutomationEventInput]!
    $deleteAutomationEvents: [Int]!

    $addAutomationTimers: [AutomationTimerInput]!
    $updateAutomationTimers: [AutomationTimerInput]!
    $deleteAutomationTimers: [Int]!
  ) {
    updateProject(
      id: $id
      title: $title
      description: $description
      lockedRequester: $lockedRequester
      autoApproved: $autoApproved
      hideApproved: $hideApproved
      archived: $archived
      projectAttributes: $projectAttributes

      addTags: $addTags
      updateTags: $updateTags
      deleteTags: $deleteTags

      addStatuses: $addStatuses
      updateStatuses: $updateStatuses
      deleteStatuses: $deleteStatuses

      addFilters: $addFilters
      updateFilters: $updateFilters
      deleteFilters: $deleteFilters

      userGroups: $userGroups
      companyGroups: $companyGroups

      addGroups: $addGroups
      updateGroups: $updateGroups
      deleteGroups: $deleteGroups

      addCustomAttributes: $addCustomAttributes
      updateCustomAttributes: $updateCustomAttributes
      deleteCustomAttributes: $deleteCustomAttributes

      addAutomationEvents: $addAutomationEvents
      updateAutomationEvents: $updateAutomationEvents
      deleteAutomationEvents: $deleteAutomationEvents

      addAutomationTimers: $addAutomationTimers
      updateAutomationTimers: $updateAutomationTimers
      deleteAutomationTimers: $deleteAutomationTimers
    ){
      ${responseProject}
    }
  }
`;

export const DELETE_PROJECT = gql `
  mutation deleteProject($id: Int! $newId: Int!) {
    deleteProject(
      id: $id
      newId: $newId
    ){
      id
    }
  }
`;

export const DELETE_PROJECT_ATTACHMENT = gql `
  mutation deleteProjectAttachment($id: Int!) {
    deleteProjectAttachment(
      id: $id
    ){
      id
    }
  }
`;

export const GET_NUMBER_OF_TASKS = gql `
  query getNumberOfTasks($projectId: Int!) {
    getNumberOfTasks(
      projectId: $projectId
    )
  }
`;

export const ADD_USER_TO_PROJECT_GROUP = gql `
  mutation addUserToProjectGroup(
    $id: Int!
    $userId: Int!
  ) {
    addUserToProjectGroup(
      id: $id
      userId: $userId
    ){
      id
    }
  }
`;

export const PROJECTS_SUBSCRIPTION = gql `
  subscription projectsSubscription {
    projectsSubscription
  }
`;

export const GET_PROJECT_GROUPS = gql `
  query projectGroups($id: Int!) {
    projectGroups(
      id: $id
    ){
      id
      title
      description
      order
    }
  }
`;

export const PROJECT_GROUPS_SUBSCRIPTION = gql `
  subscription projectGroupsSubscription($projectId: Int!) {
    projectGroupsSubscription(projectId: $projectId)
  }
`;
