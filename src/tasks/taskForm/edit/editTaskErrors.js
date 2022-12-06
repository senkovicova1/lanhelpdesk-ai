import React from 'react';
import { ScrollView, View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon, Alert, VStack, HStack  } from "native-base";

export default function EditTaskErrorDisplay( props ) {
  const {
    userRights,
    projectAttributes,
    title,
    status,
    project,
    assignedTo,
    t,
  } = props;


  //errors
  const titleError = title.length === 0;
  const statusError = status === null && userRights.attributeRights.status.view;
  const projectError = project === null;
  const missingAssignedError = assignedTo.length === 0 && userRights.attributeRights.assigned.view && !projectAttributes.assigned.fixed;

  const generalErrors = (
    titleError ||
    statusError ||
    projectError ||
    missingAssignedError
  );

  const assignedMissingWarning = ( assignedTo.length === 0 &&
    (
      userRights.rights.taskWorksRead ||
      userRights.rights.taskWorksAdvancedRead
    ) &&
    userRights.attributeRights.assigned.view
  );
  const assignedNotVisibleWarning = ( assignedTo.length === 0 &&
    (
      userRights.rights.taskWorksRead ||
      userRights.rights.taskWorksAdvancedRead
    ) &&
    !userRights.attributeRights.assigned.view
  );
  const warnings = (
    assignedMissingWarning ||
    assignedNotVisibleWarning
  )

  return (
    <Box>
      { generalErrors &&
        <Box mb="4">
          <Heading size="sm">{t('generalErrors')}</Heading>
          { titleError &&
            <Alert w="100%" status={"error"} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      {t('titleCantBeEmpty')}
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
                      {t('statusMissing')}
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
                      {t('projectMissing')}
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
                      {t('taskMustBeAssigned')}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          }
        </Box>
      }
      { warnings &&
        <Box mb="4">
          <Heading size="sm">{t('warnings')}</Heading>
          { assignedMissingWarning &&
            <Alert w="100%" status={"error"} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      {t('cantCreateWorksTrips')}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          }
          { assignedNotVisibleWarning &&
            <Alert w="100%" status={"error"} mb="1">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      {t('cantSeeAssigned')}
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
