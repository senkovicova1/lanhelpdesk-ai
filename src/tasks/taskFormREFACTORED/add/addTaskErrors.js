import React from 'react';

const attributesKeys = [
  {
    key: 'status',
    label: 'status'
  },
  {
    key: 'requester',
    label: 'requester'
  },
  {
    key: 'company',
    label: 'company'
  },
  {
    key: 'deadline',
    label: 'deadline'
  },
  {
    key: 'startsAt',
    label: 'startsAt'
  },
];
export const hasAddTaskIssues = ( props ) => {
  const {
    userRights,
    projectAttributes,
    title,
    status,
    project,
    assignedTo,
    currentUser,
    customAttributes,
  } = props;

  const titleError = title.length === 0;
  const statusError = status === null && userRights.attributeRights.status.add;
  const projectError = project === null;
  const missingAssignedError = assignedTo.length === 0 && userRights.attributeRights.assigned.add && !projectAttributes.assigned.fixed;
  const assignedFixedError = (
    projectAttributes.assigned.fixed &&
    (
      //assigned ma def hodnotu a nedodrzuje ju
      (
        projectAttributes.assigned.value.length !== 0 &&
        (
          projectAttributes.assigned.value.length !== assignedTo.length ||
          !projectAttributes.assigned.value.every( ( user1 ) => assignedTo.some( ( user2 ) => user1.id === user2.id ) )
        )
      ) ||
      //assigned nema def hodnotu a niesi priradeny alebo prazdny
      projectAttributes.assigned.value.length === 0 &&
      (
        assignedTo.length > 1 ||
        (
          assignedTo.length === 1 &&
          assignedTo[ 0 ].id !== currentUser.id
        )
      )
    )
  );

  const generalErrors = (
    titleError ||
    statusError ||
    projectError ||
    missingAssignedError
  );

  //required
  let requiredAttributesErrors = attributesKeys.filter( ( attribute ) => project.projectAttributes[ attribute.key ].required && !props[ attribute.key ] );

  const someCustomAttributesRequired = customAttributes.some((item) => {
    if (!item.required){
      return false;
    }
    return (item.value.text ? item.value.text.length : 0) + (item.value.selectValues ? item.value.selectValues.length : 0) + (item.value.number ? item.value.number.toString().length : 0) === 0;
  });

  if (someCustomAttributesRequired){
    requiredAttributesErrors.push({
      key: 'customAttribute',
      label: 'customAttribute'
    })
  }

  if ( assignedTo.length === 0 && project.projectAttributes.assigned.required ) {
    requiredAttributesErrors.push( {
      key: 'assignedTo',
      label: 'AssignedTo'
    } )
  }

  const attributesErrors = (
    requiredAttributesErrors.length > 0 ||
    assignedFixedError
  )
  return ( generalErrors || attributesErrors );
}
