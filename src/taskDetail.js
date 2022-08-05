import React, {useState} from 'react';
import { Platform } from 'react-native';
import { ScrollView, Pressable, Select, Divider, Heading, Text, Flex, Box, Stack, IconButton, Input, Button, Badge, CheckIcon  } from "native-base";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo, AntDesign  } from '@expo/vector-icons';

export default function TaskDetail ( props ) {

  const {
    navigation
  } = props;

  const [displayCard, setDisplayCard] = useState("info");

  return (
    <ScrollView margin="5">

      <Flex direction="row" justify="space-between">
        <Heading variant="list" size="md">12: Task title</Heading>
        <IconButton
          onPress={() => {}}
          p="0"
          variant="ghost"
          _icon={{
            as: Ionicons ,
            name: "pencil",
            color: "#0078d4"
          }}
          />
      </Flex>
      <Flex direction="row" justify="space-between"  marginTop="5">
        <IconButton
          onPress={() => setDisplayCard("info")}
          variant={displayCard === "info" ? "solid" : "ghost"}
          _icon={{
            as: FontAwesome5 ,
            name: "info-circle",
            color: displayCard === "info" ? "white" : "#0078d4",
          }}
          />
        <IconButton
          onPress={() => setDisplayCard("attributes")}
          variant={displayCard === "attributes" ? "solid" : "ghost"}
          _icon={{
            as: MaterialIcons ,
            name: "menu",
            color: displayCard === "attributes" ? "white" : "#0078d4"
          }}
          />
        <IconButton
          onPress={() => setDisplayCard("comments")}
          variant={displayCard === "comments" ? "solid" : "ghost"}
          _icon={{
            as: Ionicons  ,
            name: "chatbubbles-sharp",
            color: displayCard === "comments" ? "white" : "#0078d4"
          }}
          />
        <IconButton
          onPress={() => setDisplayCard("subtasks")}
          variant={displayCard === "subtasks" ? "solid" : "ghost"}
          _icon={{
            as: Entypo  ,
            name: "list",
            color: displayCard === "subtasks" ? "white" : "#0078d4"
          }}
          />
        <IconButton
          onPress={() => setDisplayCard("materials")}
          variant={displayCard === "materials" ? "solid" : "ghost"}
          _icon={{
            as: FontAwesome5  ,
            name: "euro-sign",
            color: displayCard === "materials" ? "white" : "#0078d4"
          }}
          />
      </Flex>

      <Divider w="100%" />

      {
        displayCard === "info" &&
        <Box>
          <Box marginTop="5">
            <Flex direction="row" justify="space-between">
              <Heading variant="list" size="sm">Description</Heading>
              <IconButton
                onPress={() => {}}
                p="0"
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "pencil",
                  color: "#0078d4"
                }}
                />
            </Flex>
            <Box bgColor="white" p="1">
              <Text>Lorem ipsum...</Text>
            </Box>
          </Box>

          <Box marginTop="5">
            <Heading variant="list" size="sm">Tags</Heading>
            <Button variant="link" m="0" p="0" justifyContent="flex-start"> + Tags </Button>
          </Box>

          <Box marginTop="5">
            <Heading variant="list" size="sm">Attachments</Heading>
            <Button variant="ghost" m="0" p="0" justifyContent="flex-start"> + Attachments </Button>
          </Box>
        </Box>
      }

      {
        displayCard === "attributes" &&
        <Box>
          <Box marginTop="5">
            <Heading variant="list" size="sm">Status</Heading>
            <Select
              defaultValue="web"
              bgColor="#00d462"
              >
              <Select.Item label="New" value="ux" />
              <Select.Item label="Open" value="web" />
              <Select.Item label="Pending" value="cross" />
              <Select.Item label="Closed" value="ui" />
              <Select.Item label="Invalid" value="backend" />
            </Select>
          </Box>

          <Box marginTop="5">
            <Heading variant="list" size="sm">Project</Heading>
            <Select
              defaultValue="ux"
              >
              <Select.Item label="LanSystems" value="ux" />
            </Select>
          </Box>

          <Box marginTop="5">
            <Heading variant="list" size="sm">Requester</Heading>
            <Select
              defaultValue="ux"
              >
              <Select.Item label="Sonka" value="ux" />
            </Select>
          </Box>

          <Box marginTop="5">
            <Heading variant="list" size="sm">Company</Heading>
            <Select
              defaultValue="ux"
              >
              <Select.Item label="FakeBridge" value="ux" />
            </Select>
          </Box>

          <Box marginTop="5">
              <Heading variant="list" size="sm">Assigned</Heading>
              <Select
                defaultValue="ux"
                >
                <Select.Item label="Sonka" value="ux" />
              </Select>
          </Box>

          <Box marginTop="5">
            <Heading variant="list" size="sm">Deadline</Heading>
            <Input type="datetime" defaultValue=""/>
          </Box>

          <Box marginTop="5">
            <Heading variant="list" size="sm">Repeats</Heading>
            <Text>No repeat</Text>
          </Box>
        </Box>
      }

      {
        displayCard === "comments" &&
        <Box>
          <Box marginTop="5" bgColor="#e0f6df" p="2">
            <Flex direction="row" justify="space-between">
              <Heading variant="list" size="sm">Sonka</Heading>
              <Text>28.07.2022</Text>
            </Flex>
            <Text>Lorem ipsum</Text>
          </Box>
          <Box marginTop="5" bgColor="#e0f6df" p="2">
            <Flex direction="row" justify="space-between">
              <Heading variant="list" size="sm">Sonka</Heading>
              <Text>28.07.2022</Text>
            </Flex>
            <Text>Lorem ipsum</Text>
          </Box>
          <Box marginTop="5" alignItems="center">
            <IconButton
              onPress={() => {navigation.navigate('CommentAdd')}}
              variant="solid"
              width="50px"
              borderRadius="20"
              _icon={{
                as: AntDesign,
                name: "plus",
              }}
              />
          </Box>
        </Box>
      }

      {
        displayCard === "subtasks" &&
        <Box>
          <Box marginTop="5">
            <Flex direction="row" justify="space-between">
              <Flex direction="row" justify="space-between" alignItems="center">
                {/*<MaterialIcons name="check-box" size={24} color="black" />*/}
                <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                <Heading variant="list" size="sm">Repair keyboard</Heading>
              </Flex>
              <IconButton
                onPress={() => {navigation.navigate('SubtaskAdd')}}
                p="0"
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "pencil",
                  color: "#0078d4"
                }}
                />
            </Flex>

            <Flex direction="row" justify="space-between">
              <Text>Sonka</Text>
              <Text>1.5h</Text>
            </Flex>

            <Divider w="100%" marginTop="2"/>
          </Box>

          <Box marginTop="5">
            <Flex direction="row" justify="space-between">
              <Flex direction="row" justify="space-between" alignItems="center">
                {/*<MaterialIcons name="check-box" size={24} color="black" />*/}
                <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                <Heading variant="list" size="sm">Repair keyboard</Heading>
              </Flex>
              <IconButton
                onPress={() => {navigation.navigate('SubtaskAdd')}}
                p="0"
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "pencil",
                  color: "#0078d4"
                }}
                />
            </Flex>

            <Flex direction="row" justify="space-between">
              <Text>Sonka</Text>
              <Text>1.5h</Text>
            </Flex>

            <Divider w="100%" marginTop="2"/>
          </Box>

          <Box marginTop="5" alignItems="center">
            <IconButton
              onPress={() => {navigation.navigate('SubtaskAdd')}}
              variant="solid"
              width="50px"
              borderRadius="20"
              _icon={{
                as: AntDesign,
                name: "plus",
              }}
              />
          </Box>
        </Box>
      }

      {
        displayCard === "materials" &&
        <Box>
          <Box marginTop="5">
            <Flex direction="row" justify="space-between">
              <Heading variant="list" size="sm">Toner</Heading>
              <IconButton
                onPress={() => {navigation.navigate('MaterialAdd')}}
                p="0"
                variant="ghost"
                _icon={{
                  as: Ionicons ,
                  name: "pencil",
                  color: "#0078d4"
                }}
                />
            </Flex>
            <Text>1x10e = 10e</Text>
            <Divider w="100%" marginTop="2"/>
          </Box>

          <Box marginTop="5" alignItems="center">
            <IconButton
              onPress={() => {navigation.navigate('MaterialAdd')}}
              variant="solid"
              width="50px"
              borderRadius="20"
              _icon={{
                as: AntDesign,
                name: "plus",
              }}
              />
          </Box>
        </Box>
      }
    </ScrollView>
  );
}
