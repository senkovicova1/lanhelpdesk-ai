import React from 'react';

import { Select, Heading, Text, FormControl, Modal, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon, Center } from "native-base";

import {
  useTranslation
} from "react-i18next";


export default function ProjectSelectModal( props ) {
  const {
    navigation,
    projects,
    onSubmit,
    loading,
    showModal,
    setShowModal,
  } = props;

  const {
    t
  } = useTranslation();

  const [ projectId, setProjectId ] = React.useState( null );

  return (
    <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t('createTask')}</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>{t('chooseProjectReq')}</FormControl.Label>
                <Select
                  selectedValue={projectId}
                  onValueChange={itemValue => {
                    setProjectId(itemValue);
                  }}
                  >
                  {
                    projects.map((project) => (
                      <Select.Item
                        key={project.id}
                        label={project.label}
                        value={project.id}
                      />
                    ))
                  }
                </Select>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => {
                  setShowModal(false);
                  navigation.goBack();
                }}
                >
                {t('cancel')}
              </Button>
              <Button
                onPress={() => {
                  if (projectId){
                    onSubmit(projectId);
                    setShowModal(false);
                  }
                }}
              >
              {t('save')}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  )
}
