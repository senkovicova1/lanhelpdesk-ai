import React, {
  useState
} from 'react';

import { Box, ScrollView, Text, Select, Button, IconButton, TextArea, FormControl, Checkbox, Input, Stack, AlertDialog  } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';

export default function CustomAttribtueEntry( props ) {

  const {
    customAttribute,
    customAttributes,
    setCustomAttributes,
  } = props;

  const [value, setValue] = useState({
    text: "",
    number: "",
    selectValues: []
  });

  const [multiselectIsOpen, setMultiselectIsOpen] = useState(false);

  React.useEffect( () => {
    setValue({
      text: customAttribute.value.text,
      number: customAttribute.value.number,
      selectValues: customAttribute.value.selectValues ? customAttribute.value.selectValues.map((value) => ({...value, label: value.label ? value.label : value.value.substring(0,1).toUpperCase() + value.value.substring(1)})) : []
    })
  }, [ customAttribute ] );

  const assignOnChangeFunction = () => {
    switch (customAttribute.type) {
      case "textarea":
      return ((e) => {
        setValue({
          ...value,
          text: e.target.value.replace("↵", "\n"),
        });

        let newCustomAttributes = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                text: e.target.value.replace("↵", "\n"),
              }
            })
          } else {
            return item;
          }
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

        let newCustomAttributes = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                number: parseFloat(e.target.value),
              }
            })
          } else {
            return item;
          }
        });
        setCustomAttributes(newCustomAttributes);
      });
      break;
      case "select":
      return ((e) => {
        setValue({
          ...value,
          selectValues: [e],
        });

        let newCustomAttributes = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                selectValues: [e],
              }
            })
          } else {
            return item;
          }
        });
        setCustomAttributes(newCustomAttributes);
      });
      break;
      case "multiselect":
      return ((e) => {
        setValue({
          ...value,
          selectValues: e,
        });

        let newCustomAttributes = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                selectValues: [e],
              }
            })
          } else {
            return item;
          }
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

        let newCustomAttributes = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                text: e.target.value,
              }
            })
          } else {
            return item;
          }
        });
        setCustomAttributes(newCustomAttributes);
      });
    }
  }

  const renderCustomAttribute = () => {

    const id = customAttribute.id;
    const placeholder = customAttribute.label;
    const type = customAttribute.type;
    const label = `${customAttribute.label}${!customAttribute.isEdit && customAttribute.required ? "*" : ""}`;
    const onChangeValue = assignOnChangeFunction;
    const options = customAttribute.type === "select" ? [{label: "Empty", value: null, id: null}, ...customAttribute.selectValues] : customAttribute.selectValues;
    const disabled = !customAttribute.canEdit;
    const setOptions = setCustomAttributes;
    const setMultiValue = setValue;

    console.log(id, type, label);

    const displayedOptions = options.map((option) => ({...option, label: option.label ? option.label : option.value.substring(0,1).toUpperCase() + option.value.substring(1)}));

    switch (type) {
      case "textarea":
      return (
        <FormControl key={id} isDisabled={disabled}>
          <Stack>
            <FormControl.Label>{label}</FormControl.Label>
            <TextArea
              key={id}
              bgColor="white"
              value={value.text}
              onChangeText={onChangeValue}
              placeholder={placeholder}
            />
          </Stack>
        </FormControl>
      );
      break;
      case "number":
      return (
        <FormControl key={id} isDisabled={disabled}>
          <Stack>
            <FormControl.Label>{label}</FormControl.Label>
            <Input
              keyboardType='numeric'
              bgColor="white"
              type="text"
              value={value.number.toString()}
              onChange={onChangeValue}
              placeholder={placeholder}
            />
          </Stack>
        </FormControl>
      );
      break;
      case "select":
      return (
        <FormControl key={id} isDisabled={disabled}>
          <Stack>
            <FormControl.Label>{label}</FormControl.Label>
            <Select
              defaultValue={value.selectValues.length > 0 ? value.selectValues[0].id : null}
              onValueChange={onChangeValue}
            >
              {
                displayedOptions.map((option) => (
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
        <FormControl key={id} isDisabled={disabled}>
          <Stack>
            <FormControl.Label>{label}</FormControl.Label>
              <DropDownPicker
                multiple={true}
                listMode="SCROLLVIEW"
                mode="BADGE"
                value={value.selectValues.map((value) => value.value)}
                setValue={setMultiValue}
                items={displayedOptions}
                setItems={setOptions}
                open={multiselectIsOpen}
                setOpen={setMultiselectIsOpen}
                onSelectItem={onChangeValue}
              />
          </Stack>
        </FormControl>
      )
      break;
      default:
      return (
        <FormControl key={id} isDisabled={disabled}>
          <Stack>
            <FormControl.Label>{label}</FormControl.Label>
            <Input
              value={value.text}
              type="text"
              onChangeText={onChangeValue}
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
