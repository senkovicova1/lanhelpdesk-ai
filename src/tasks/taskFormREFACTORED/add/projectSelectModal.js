import React from 'react';

import { Select, Heading, Text, FormControl, Modal, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon, Center } from "native-base";


export default function ProjectSelectModal( props ) {
  const {
    projects,
    onSubmit,
    loading,
    showModal,
    setShowModal,
  } = props;

  const [ projectId, setProjectId ] = React.useState( null );

  return (
    <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Create a task</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Choose a project *</FormControl.Label>
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
                }}
                >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  if (projectId){
                    onSubmit(projectId);
                    setShowModal(false);
                  }
                  // TODO: else show error
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  )
}
