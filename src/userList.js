import React from 'react';
import { ScrollView, Pressable, Divider, Heading, Text, Flex, Box, Stack, FormControl, Icon, Input, IconButton } from "native-base";
import { FontAwesome, AntDesign } from '@expo/vector-icons';

export default function UserList ( props ) {

  const {
    navigation
  } = props;

  return (
    <ScrollView>

    <FormControl mt="5" >
        <Stack mx="5">
          <Input
            type="text"
            bgColor="white"
            InputLeftElement={
              <Icon
                as={
                  <FontAwesome
                    name={"search"}
                    />
                }
                size={5}
                ml="2"
                color="muted.400"
                onPress={() => {}}
                />
            }
            placeholder="Search"
          />
        <Divider w="100%" marginTop="5"/>
        </Stack>
      </FormControl>

      <Pressable marginTop="0" mx="5" onPress={() => {navigation.navigate('UserAdd')}}>
        <Heading variant="list" size="sm">Sonka</Heading>
        <Text underline>sona@mail.som</Text>
        <Text>LanSystems s.r.o</Text>
        <Divider w="100%" marginTop="5"/>
      </Pressable>

      <Pressable marginTop="5" mx="5" onPress={() => {navigation.navigate('UserAdd')}}>
        <Heading variant="list" size="sm">Sonka</Heading>
        <Text underline>sona@mail.som</Text>
        <Text>LanSystems s.r.o</Text>
        <Divider w="100%" marginTop="5"/>
      </Pressable>

      <Box marginTop="5" alignItems="center">
        <IconButton
          onPress={() => {navigation.navigate('UserAdd')}}
          variant="solid"
          width="fit-content"
          borderRadius="20"
          _icon={{
            as: AntDesign,
            name: "plus",
          }}
          />
      </Box>
    </ScrollView>
  );
}
