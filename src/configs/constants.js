
let fakeID = -1;

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


export const backendCleanRights = ( access = false ) => {
  return remapRightsToBackend( {
    title: '',
    id: 0,
    order: 0,
    rights: createCleanRights( access ),
    attributeRights: getEmptyAttributeRights()
  } )
}


export const allACLs = [
  {
    id: 'header1',
    title: 'projectACL',
    header: true
  },
  {
    id: 'projectRead',
    title: 'viewProjectNameDescription',
    disabled: [
      {
        key: 'projectWrite',
      }
    ],
    both: false
  },
  {
    id: 'projectWrite',
    title: 'projectSettings',
    dependancy: [
      {
        key: 'projectRead',
      }
    ],
    both: false
  },
  {
    id: 'separator1',
    separator: true,
  },
  {
    id: 'header2',
    title: 'tasklist',
    header: true,
  },
  {
    id: 'myTasks',
    title: 'viewMyTasks',
    both: false,
    fake: true,
    value: true,
    disabled: [
      {
        key: 'myTasks',
      }
    ]
  },
  {
    id: 'companyTasks',
    title: 'viewMyCompanyTasks',
    both: false,
    disabled: [
      {
        key: 'allTasks'
      }
    ]
  },
  {
    id: 'allTasks',
    title: 'viewAllTasks',
    dependancy: [
      {
        key: 'companyTasks',
      }
    ],
    both: false
  },
  {
    id: 'separator2',
    separator: true,
  },
  {
    id: 'headerTaskList',
    title: 'tasklistView',
    header: true,
  },
  {
    id: 'taskTable',
    title: 'taskTable',
    both: false,
    fake: true,
    value: true,
    disabled: [
      {
        key: 'taskTable',
      }
    ]
  },
  {
    id: 'tasklistDnD',
    title: 'dnd',
    both: false,
  },
  {
    id: 'tasklistKalendar',
    title: 'calendar',
    both: false,
  },
  {
    id: 'tasklistGantt',
    title: 'projectManagement',
    both: false,
  },
  {
    id: 'tasklistStatistics',
    title: 'statistics',
    both: false,
  },
  {
    id: 'separator3',
    separator: true,
  },
  {
    id: 'headerAdd',
    title: 'addTask',
    header: true,
  },
  {
    id: 'addTask',
    title: 'addTaskRight',
    both: false
  },
  {
    id: 'separator4',
    separator: true,
  },
  {
    id: 'headerTaskEdit',
    title: 'editTask',
    header: true,
  },
  {
    id: 'deleteTask',
    title: 'deleteTask',
    both: false
  },
  {
    id: 'taskImportant',
    title: 'importantRight',
    both: false
  },
  {
    id: 'taskTitleWrite',
    title: 'taskTitleEdit',
    both: false
  },
  {
    id: 'taskProjectWrite',
    title: 'changeTaskProject',
    both: false
  },
  {
    id: 'taskDescription',
    title: 'taskDescription',
    both: true
  },
  {
    id: 'taskAttachments',
    title: 'taskAttachments',
    both: true
  },
  {
    id: 'taskSubtasks',
    title: 'taskSubtasksRight',
    both: true
  },
  {
    id: 'taskWorks',
    title: 'taskWorksRight',
    both: true
  },
  {
    id: 'taskWorksAdvanced',
    title: 'taskWorksAdvancedRight',
    both: true
  },
  {
    id: 'taskMaterials',
    title: 'taskMaterialsRight',
    both: true
  },
  /*  {
    id: 'taskPausalInfo',
    title: 'taskPausalInfoRight',
    both: false
  },*/
  {
    id: 'separator5',
    separator: true,
  },
  {
    id: 'headerComments',
    title: 'commentsHistory',
    header: true,
  },
  {
    id: 'viewComments',
    title: 'viewComments',
    both: false,
    disabled: [ {
      key: 'addComments'
    }, {
      key: 'internal'
    }, {
      key: 'emails'
    } ]
  },
  {
    id: 'addComments',
    title: 'addComments',
    dependancy: [ {
      key: 'viewComments',
    } ],
    both: false
  },
  {
    id: 'internal',
    title: 'internalComments',
    dependancy: [ {
      key: 'viewComments',
    } ],
    both: false
  },
  {
    id: 'emails',
    title: 'sendEmailsFromComments',
    dependancy: [ {
      key: 'viewComments',
    } ],
    both: false
  },
  {
    id: 'history',
    title: 'taskHistory',
    both: false
  },

];

export const createCleanRights = ( access = false, group = 2 ) => {
  let rights = {};
  allACLs.filter( ( acl ) => !acl.header && !acl.fake && !acl.separator ).forEach( ( acl ) => {
    if (group === 2){
      if (["myTasks", "taskTable", "addTask", "viewComments", "addComments"].includes(acl.id)){
        rights[ acl.id ] = true;
      } else {
        if ( acl.both ) {
          rights[ acl.id ] = {
            read: access,
            write: access
          };
        } else {
          rights[ acl.id ] = access;
        }
      }
    }
    if (group === 1){
      if (["projectWrite", "tasklistGantt", "tasklistStatistics"].includes(acl.id)){
        rights[ acl.id ] = false;
      } else {
        if ( acl.both ) {
          rights[ acl.id ] = {
            read: access,
            write: access
          };
        } else {
          rights[ acl.id ] = access;
        }
      }
    }
    if (group === 0){
      if (["tasklistGantt", "tasklistStatistics"].includes(acl.id)){
        rights[ acl.id ] = false;
      } else {
        if ( acl.both ) {
          rights[ acl.id ] = {
            read: access,
            write: access
          };
        } else {
          rights[ acl.id ] = access;
        }
      }
    }
  } )
  return rights;
}


export const attributesNames = [ 'status', 'tags', 'assigned', 'requester', 'company', /* 'taskType',  'pausal', 'overtime', */'startsAt', 'deadline', 'repeat' ];

export const getEmptyAttributeRights = (group) => {
  let attributeRights = {};
  attributesNames.forEach( ( attribute ) => {
    if ( attribute !== 'repeat' ) {
      attributeRights[ attribute ] = {
        required: false,
        add: group < 2,
        view: true,
        edit: group < 2,
      };
    } else {
      attributeRights[ attribute ] = {
        add: group < 2,
        view: true,
        edit: group < 2,
      };
    }
  } )
  return attributeRights;
}


export const remapRightsToBackend = ( group ) => {
  return {
    id: group.id,
    title: group.title,
    def: group.def,
    admin: group.admin,
    description: group.description,
    order: parseInt( group.order ),
    attributeRights: {
      status: {
        required: group.attributeRights.status.required,
        add: group.attributeRights.status.add,
        view: group.attributeRights.status.view || group.attributeRights.status.edit,
        edit: group.attributeRights.status.edit
      },
      tags: {
        required: group.attributeRights.tags.required,
        add: group.attributeRights.tags.add,
        view: group.attributeRights.tags.view || group.attributeRights.tags.edit,
        edit: group.attributeRights.tags.edit
      },
      assigned: {
        required: group.attributeRights.assigned.required,
        add: group.attributeRights.assigned.add,
        view: group.attributeRights.assigned.view || group.attributeRights.assigned.edit,
        edit: group.attributeRights.assigned.edit
      },
      requester: {
        required: group.attributeRights.requester.required,
        add: group.attributeRights.requester.add,
        view: group.attributeRights.requester.view || group.attributeRights.requester.edit,
        edit: group.attributeRights.requester.edit
      },
      company: {
        required: group.attributeRights.company.required,
        add: group.attributeRights.company.add,
        view: group.attributeRights.company.view || group.attributeRights.company.edit,
        edit: group.attributeRights.company.edit
      },
      startsAt: {
        required: group.attributeRights.startsAt.required,
        add: group.attributeRights.startsAt.add,
        view: group.attributeRights.startsAt.view || group.attributeRights.startsAt.edit,
        edit: group.attributeRights.startsAt.edit
      },
      deadline: {
        required: group.attributeRights.deadline.required,
        add: group.attributeRights.deadline.add,
        view: group.attributeRights.deadline.view || group.attributeRights.deadline.edit,
        edit: group.attributeRights.deadline.edit
      },
      repeat: {
        add: group.attributeRights.repeat.add,
        view: group.attributeRights.repeat.view || group.attributeRights.repeat.edit,
        edit: group.attributeRights.repeat.edit
      },
    },
    rights: {
      projectRead: group.rights.projectRead,
      projectWrite: group.rights.projectWrite,
      companyTasks: group.rights.companyTasks,
      allTasks: group.rights.allTasks,
      tasklistDnD: group.rights.tasklistDnD,
      tasklistKalendar: group.rights.tasklistKalendar,
      tasklistGantt: group.rights.tasklistGantt,
      tasklistStatistics: group.rights.tasklistStatistics,
      addTask: group.rights.addTask,
      deleteTask: group.rights.deleteTask,
      taskImportant: group.rights.taskImportant,
      taskTitleWrite: group.rights.taskTitleWrite,
      taskProjectWrite: group.rights.taskProjectWrite,
      taskDescriptionRead: group.rights.taskDescription.read,
      taskDescriptionWrite: group.rights.taskDescription.write,
      taskAttachmentsRead: group.rights.taskAttachments.read,
      taskAttachmentsWrite: group.rights.taskAttachments.write,
      taskSubtasksRead: group.rights.taskSubtasks.read,
      taskSubtasksWrite: group.rights.taskSubtasks.write,
      taskWorksRead: group.rights.taskWorks.read,
      taskWorksWrite: group.rights.taskWorks.write,
      taskWorksAdvancedRead: group.rights.taskWorksAdvanced.read,
      taskWorksAdvancedWrite: group.rights.taskWorksAdvanced.write,
      taskMaterialsRead: group.rights.taskMaterials.read,
      taskMaterialsWrite: group.rights.taskMaterials.write,
      viewComments: group.rights.viewComments,
      addComments: group.rights.addComments,
      internal: group.rights.internal,
      emails: group.rights.emails,
      history: group.rights.history,
    },
  }
}
