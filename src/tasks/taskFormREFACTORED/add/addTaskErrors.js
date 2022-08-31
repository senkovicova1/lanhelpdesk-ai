import React from 'react';
import { ScrollView, View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon, Alert, VStack, HStack  } from "native-base";

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

export default function AddTaskErrorDisplay( props ) {
  const {
    userRights,
    projectAttributes,
    customAttributes,
    title,
    status,
    project,
    assignedTo,
    currentUser,
  } = props;

  //errors
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
  let requiredAttributesErrors = attributesKeys.filter( ( attribute ) => project.projectAttributes[ attribute.key ].required && !props[ attribute.key ] )

  if ( assignedTo.length === 0 && project.projectAttributes.assigned.required ) {
    requiredAttributesErrors.push( {
      key: 'assignedTo',
      label: 'Assigned to',
    } )
  }

  const customAttributesErrors = customAttributes.filter((item) => {
    if (!item.required){
      return false;
    }
    return (item.value.text ? item.value.text.length : 0) + (item.value.selectValues ? item.value.selectValues.length : 0) + (item.value.number ? item.value.number.toString().length : 0) === 0;
  });

  const attributesErrors = (
    requiredAttributesErrors.length > 0 ||
    customAttributesErrors.length > 0 ||
    assignedFixedError
  )
  const assignedWarning = ( assignedTo.length === 0 &&
    (
      userRights.rights.taskWorksRead ||
      userRights.rights.taskWorksAdvancedRead
    )
  );

  const warnings = (
    assignedWarning
  )

  return (
    <Box>
      { generalErrors &&
        <Box mb="4">
          <Heading size="sm">General errors</Heading>
          { titleError &&
            <Alert w="100%" status={"error"} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      Task title can't be empty!
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          }
          { statusError &&
            <Alert w="100%" status={"error"} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      Task status is missing!
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          }
          { projectError &&
            <Alert w="100%" status={"error"} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      Task project is missing!
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          }
          { missingAssignedError &&
            <Alert w="100%" status={"error"} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      Task must be assigned to someone!
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          }
        </Box>
      }
      { attributesErrors &&
        <Box mb="4">
          <Heading size="sm">Attribute errors</Heading>
          { assignedFixedError &&
            <Alert w="100%" status={"error"} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      Assigned is fixed but either assigned user is not you, empty or set value of project
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          }
          { requiredAttributesErrors.map((attribute) => (
            <Alert w="100%" status={"error"} key={attribute.key} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      {`${attribute.label} is required but is empty!`}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          ))}

          { customAttributesErrors.map((attribute) => (
            <Alert w="100%" status={"error"} key={attribute.id} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      {`${attribute.label} is required but is empty!`}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          ))}
        </Box>
      }
      { warnings &&
        <Box mb="4">
          <Heading size="sm">Warnings</Heading>
          { assignedWarning &&
            <Alert w="100%" status={"warning"} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      Task wasn't assigned to anyone, you can't create works and trips!
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          }
        </Box>
      }
    </Box>
  );
}
