import React, {
  useState
} from 'react';

import { Box, ScrollView, Text, Select, Button, IconButton, TextArea, FormControl, Checkbox, Input, Stack, AlertDialog, Heading } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';

export default function CustomAttribtueEntry( props ) {

  const {
    customAttribute,
    customAttributes,
    setCustomAttributes,
  } = props;

  // TODO: do we need this?
  const [value, setValue] = useState({
    text: "",
    number: "",
    selectValues: []
  });

  const [multiselectIsOpen, setMultiselectIsOpen] = useState(false);

  React.useEffect( () => {
    if (customAttribute) {
      setValue({
        text: customAttribute.value.text,
        number: customAttribute.value.number,
        selectValues: customAttribute.value.selectValues,
      })
    }
  }, [ customAttribute ] );

  // TODO: refactor
  const assignOnChangeFunction = () => {
    switch (customAttribute.type) {
      case "textarea":
        return ((e) => {
            setValue({
              ...value,
              text: e.target.value.replace("↵", "\n"),
            });

            const newCustomAttributes = customAttributes.map((item) => {
              if (item.id === customAttribute.id){
                return ({
                  ...item,
                  value: {
                    ...value,
                    text: e.target.value.replace("↵", "\n"),
                  }
                })
              }
              return item;
            });

            setCustomAttributes(newCustomAttributes);
        });
        break;
      case "number":
        return ( (e) => {
            setValue({
              ...value,
              number: parseFloat(e.target.value),
            });

            const newCustomAttributes = customAttributes.map((item) => {
              if (item.id === customAttribute.id){
                return ({
                  ...item,
                  value: {
                    ...value,
                    number: parseFloat(e.target.value),
                  }
                })
              }
              return item;
            });

            setCustomAttributes(newCustomAttributes);

        });
        break;
      case "select":
      return ((e) => {
        const newValue = [customAttribute.selectValues.find((selectValue) => selectValue.label === e)];

          setValue({
            ...value,
            selectValues: newValue,
          });

          const newCustomAttributes = customAttributes.map((item) => {
            if (item.id === customAttribute.id){
              return ({
                ...item,
                value: {
                  ...value,
                  selectValues: newValue,
                }
              })
            }
            return item;
          });

          setCustomAttributes(newCustomAttributes);

      });
      break;
      case "multiselect":
        return ((e) => {
          const newValue = [customAttribute.selectValues.find((selectValue) => selectValue.label === e)];

          setValue({
            ...value,
            selectValues: newValue,
          });

          const newCustomAttributes = customAttributes.map((item) => {
            if (item.id === customAttribute.id){
              return ({
                ...item,
                value: {
                  ...value,
                  selectValues: newValue,
                }
              })
            }
            return item;
          });

          setCustomAttributes(newCustomAttributes);

        });
      break;
      default:
      return ((e) => {
          setValue({
            ...value,
            text: e.target.value,
          });

          const newCustomAttributes = customAttributes.map((item) => {
            if (item.id === customAttribute.id){
              return ({
                ...item,
                value: {
                  ...value,
                  text: e.target.value,
                }
              })
            }
            return item;

          });

          setCustomAttributes(newCustomAttributes);

      });
    }
  }

  const renderCustomAttribute = () => {

    const placeholder = customAttribute.label;
    const label = `${customAttribute.label}${!customAttribute.isEdit && customAttribute.required ? "*" : ""}`;
    const items = customAttribute.type === "select" ? [{label: "Empty", value: null, id: null}, ...customAttribute.selectValues] : customAttribute.selectValues;
    const disabled = !customAttribute.canEdit;

    switch (customAttribute.type) {
      case "textarea":
        return (
          <FormControl key={customAttribute.id} isDisabled={disabled}>
            <Stack>
              <Heading variant="list" size="sm">{label}</Heading>
              <TextArea
                key={customAttribute.id}
                bgColor="white"
                value={value.text}
                onChangeText={assignOnChangeFunction}
                placeholder={placeholder}
              />
            </Stack>
          </FormControl>
        );
        break;
      case "number":
        return (
          <FormControl key={customAttribute.id} isDisabled={disabled}>
            <Stack>
              <Heading variant="list" size="sm">{label}</Heading>
              <Input
                keyboardType='numeric'
                bgColor="white"
                type="text"
                value={value.number.toString()}
                onChange={assignOnChangeFunction}
                placeholder={placeholder}
              />
            </Stack>
          </FormControl>
        );
        break;
      case "select":
      return (
        <FormControl key={customAttribute.id} isDisabled={disabled}>
          <Stack>
            <Heading variant="list" size="sm">{label}</Heading>
            <Select
              selectedValue={value.selectValues.length > 0 ? value.selectValues[0].value : null}
              onValueChange={assignOnChangeFunction}
            >
              {
                items.map((option) => (
                  <Select.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))
              }
            </Select>
          </Stack>
        </FormControl>
      )
      break;
      case "multiselect":
      return (
        <FormControl key={customAttribute.id} isDisabled={disabled}>
          <Stack>
            <Heading variant="list" size="sm">{label}</Heading>
              <DropDownPicker
                multiple={true}
                listMode="SCROLLVIEW"
                mode="BADGE"
                value={value.selectValues.map((value) => value.value)}
                setValue={setValue}
                items={items}
                setItems={setCustomAttributes}
                open={multiselectIsOpen}
                setOpen={setMultiselectIsOpen}
                onSelectItem={assignOnChangeFunction}
              />
          </Stack>
        </FormControl>
      )
      break;
      default:
      return (
        <FormControl key={customAttribute.id} isDisabled={disabled}>
          <Stack>
            <Heading variant="list" size="sm">{label}</Heading>
            <Input
              value={value.text}
              type="text"
              onChangeText={assignOnChangeFunction}
              placeholder={placeholder}
              />
          </Stack>
        </FormControl>
      )
    }
  }

  return (
    <Box key={customAttribute.id}>
        {
          renderCustomAttribute()
        }
    </Box>
  )
}
