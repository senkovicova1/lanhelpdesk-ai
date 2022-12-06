import React, {useState} from 'react';
import { Platform, Input as RNInput } from 'react-native';
import { ScrollView, View, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign, Feather } from '@expo/vector-icons';

import CustomAttributes from './customAttributes';

import {
  toSelArr,
} from '../../../helperFunctions/select';

import {
  timestampToString,
} from '../../../helperFunctions/time';
import {
  useTranslation
} from "react-i18next";

const lanHelpdeskTheme = require("../../../configs/rn-dropdown-picker-theme");
DropDownPicker.addTheme("LanHelpdeskTheme", lanHelpdeskTheme);
DropDownPicker.setTheme("LanHelpdeskTheme");

export default function TaskAttributes ( props ) {

  const {
    currentUser,
    projectAttributes,
    userRights,
    projects,
    companies,
    assignableUsers,
    projectRequesters,
    project,
    setProject,
    setTags,
    status,
    setStatus,
    setPendingDate,
    setCloseDate,
    customAttributes,
    setCustomAttributes,
    requester,
    setRequester,
    company,
    setCompany,
    assignedTo,
    setAssignedTo,
    deadline,
    setDeadline,
  } = props;

  const {
    t
  } = useTranslation();

  const [ assignedToPickerOpen, setAssignedToPickerOpen ] = useState(false);
  const [ deadlinePickerOpen, setDeadlinePickerOpen ] = useState(false);
  const [ assignableUsersPicker, setAssignableUsersPicker ] = useState([]);
  const [ assignedUsersPicker, setAssignedUsersPicker ] = useState([]);

  const availableProjects = projects.filter((project) => currentUser.role.level === 0 || project.right.addTask );
  const availableStatuses = project ? toSelArr(project.statuses.filter((status) => status.action.toLowerCase() !== 'invoiced' )) : []

  React.useEffect(() => {
    setAssignableUsersPicker(assignableUsers);
  }, [assignableUsers]);

  React.useEffect(() => {
    setAssignedUsersPicker(assignedTo);
  }, [assignedTo]);

  const changeProject = (project) => {
    setTags([]);
    setStatus(null);
    setProject(project);

    let newCustomAttributes = [];
    project.addCustomAttributes.forEach((item, i) => {
      const value = {
        text: item.defaultValue ? item.defaultValue.text : "",
        number: item.defaultValue ? item.defaultValue.number : 0,
        selectValues: item.selectValues ? item.selectValues.filter((value) => value.def) : [],
      };
      let newAttribute = {
        ...item,
        value,
        label: item.title.substring(0,1).toUpperCase() + item.title.substring(1),
        canEdit: true,
      };
      delete newAttribute.__typename;
      newCustomAttributes.push(newAttribute);
    });

    setCustomAttributes(newCustomAttributes.sort((a1, a2) => a1.order < a2.order ? -1 : 1));
  }

  const changeStatus = (status) => {
    if(status.action==='PendingDate'){
      setStatus(status);
      setPendingDate( moment().add(1,'d') );
    }else if(status.action==='CloseDate' || status.action==='CloseInvalid'){
      setStatus(status);
      setCloseDate( moment() );
    }
    else{
      setStatus(status);
    }
  }

  const changeRequester = (requester) => {
    setRequester(requester);
    if(userRights.attributeRights.company.add && !projectAttributes.company.fixed){
      const newCompany = companies.find((company) => company.id === requester.company.id );
      setCompany(newCompany);
    }
  }

  return (
    <Box>
      {/*Status*/}
      {
        userRights.attributeRights.status.add &&
        <Box marginTop="5">
          <Heading variant="list" size="sm">{`${t('status')} ${ userRights.attributeRights.status.required ? "*" : ""}`}</Heading>
          {
            (projectAttributes.status.fixed || !userRights.attributeRights.status.edit ) &&
            <Text>{status ? status.label : t('none')}</Text>
          }
          {
            !projectAttributes.status.fixed && userRights.attributeRights.status.add &&
            <Select
              selectedValue={status ? status.id : null}
              bgColor={status ? status.color : "transparent"}
              onValueChange={itemValue => {
                changeStatus(availableStatuses.find((status) => status.id === itemValue));
              }}
              >
              {
                availableStatuses.map((status) => (
                  <Select.Item
                    key={status.id}
                    label={status.label}
                    value={status.id}
                  />
                ))
              }
            </Select>
          }
        </Box>
      }

      {/*Project*/}
      <Box marginTop="5">
        <Heading variant="list" size="sm">{`${t('project')} *`}</Heading>
          <Select
            selectedValue={project.id}
            onValueChange={itemValue => {
              changeProject(availableProjects.find((project) => project.id === itemValue));
            }}
            >
            {
              availableProjects.map((project) => (
                <Select.Item
                  key={project.id}
                  label={project.label}
                  value={project.id}
                />
              ))
            }
          </Select>
      </Box>

      {/*Requester*/}
      {
        userRights.attributeRights.requester.add &&
        <Box marginTop="5">
          <Heading variant="list" size="sm">{`${t('requester')} ${ userRights.attributeRights.requester.required ? "*" : ""}`}</Heading>
          {
            (projectAttributes.requester.fixed || !userRights.attributeRights.requester.edit ) &&
            <Text>{requester ? requester.label : t('none')}</Text>
          }
          {
            !projectAttributes.requester.fixed && userRights.attributeRights.requester.add &&
            <Select
              defaultValue={requester.id}
              onValueChange={itemValue => {
                changeRequester(projectRequesters.find((requester) => requester.id === itemValue));
              }}
              >
              {
                projectRequesters.map((user) => (
                  <Select.Item
                    key={user.id}
                    label={user.label}
                    value={user.id}
                  />
                ))
              }
            </Select>
          }
        </Box>
      }

      {/*Company*/}
      {
        userRights.attributeRights.company.add &&
        <Box marginTop="5">
          <Heading variant="list" size="sm">{`${t('company')} ${ userRights.attributeRights.company.required ? "*" : ""}`}</Heading>
            {
              (projectAttributes.company.fixed || !userRights.attributeRights.company.edit ) &&
              <Text>{company ? company.label : t('none')}</Text>
            }
            {
              !projectAttributes.company.fixed && userRights.attributeRights.company.add &&
              <Select
                defaultValue={company.id}
                onValueChange={itemValue => {
                  setCompany(companies.find((company) => company.id === itemValue));
                }}
                >
                {
                  companies.map((company) => (
                    <Select.Item
                      key={company.id}
                      label={company.label}
                      value={company.id}
                    />
                  ))
                }
              </Select>
            }
        </Box>
      }

      {/*Assigned*/}
      {
        userRights.attributeRights.assigned.add &&
        <Box marginTop="5">
            <Heading variant="list" size="sm">{`${t('assigned')} ${ userRights.attributeRights.assigned.required ? "*" : ""}`}</Heading>
              {
                (projectAttributes.assigned.fixed || !userRights.attributeRights.assigned.edit ) &&
                <Box>
                  {
                    assignedTo.length > 0 &&
                    <Text>
                      { assignedTo.map((user) => user.label).join(", ") }
                    </Text>
                  }
                  { assignedTo.length === 0 &&
                    <Text>{t('taskUnassigned')}</Text>
                  }
                </Box>
              }
              {
                !projectAttributes.assigned.fixed && userRights.attributeRights.assigned.add &&
                <DropDownPicker
                  multiple={true}
                  listMode="SCROLLVIEW"
                  mode="BADGE"
                  open={assignedToPickerOpen}
                  value={assignedTo.map((user) => user.value)}
                  setValue={setAssignedUsersPicker}
                  items={assignableUsersPicker}
                  setItems={setAssignableUsersPicker}
                  setOpen={setAssignedToPickerOpen}
                  onSelectItem={(items) => {
                    setAssignedTo(items);
                  }}
                />
            }
        </Box>
      }

      {/*Deadline*/}
      {
        userRights.attributeRights.deadline.add &&
        <Box marginTop="5">
          <Heading variant="list" size="sm">{`${t('deadline')} ${ userRights.attributeRights.deadline.required ? "*" : ""}`}</Heading>
            {
              (projectAttributes.deadline.fixed || !userRights.attributeRights.deadline.edit ) &&
              <Text>{deadline ? timestampToString(deadline) : t('noDeadline')}</Text>
            }
            {
              !projectAttributes.deadline.fixed && userRights.attributeRights.deadline.add &&
              <Box>
                <Pressable
                  onPress={() => {
                    setDeadlinePickerOpen(!deadlinePickerOpen);
                  }}
                  >
                  <Box height="46px" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#CCC" justifyContent="center" pl="10px">
                    <Text fontSize="xs">
                      {deadline ? timestampToString(deadline) : t('noDeadline')}
                    </Text>
                  </Box>
                </Pressable>
                <DateTimePickerModal
                  isVisible={deadlinePickerOpen}
                  mode="datetime"
                  date={deadline ? new Date(parseInt(deadline)) : new Date()}
                  onConfirm={(e) => {
                    const newDeadline = new Date(e).getTime();
                    setDeadline(newDeadline);
                  }}
                  onCancel={() => {
                    setDeadlinePickerOpen(false);
                  }}
                />
              </Box>
            }
        </Box>
      }

      <CustomAttributes
        {...props}
        />

    </Box>
  )
}
