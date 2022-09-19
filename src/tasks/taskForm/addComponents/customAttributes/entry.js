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

  const [selectValues, setSelectValues] = useState([]);

  const [multiselectIsOpen, setMultiselectIsOpen] = useState(false);

  React.useEffect( () => {
    if (customAttribute) {
      setValue({
        text: customAttribute.value.text,
        number: customAttribute.value.number,
        selectValues: customAttribute.value.selectValues,
      });
      setSelectValues(customAttribute.value.selectValues)
    }
  }, [ customAttribute ] );

  // TODO: refactor
  const assignOnChangeFunction = (e) => {
    switch (customAttribute.type) {
      case "textarea":
        setValue({
          ...value,
          text: e.replace("↵", "\n"),
        });

        const newCustomAttributes = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                text: e.replace("↵", "\n"),
              }
            })
          }
          return item;
        });

        setCustomAttributes(newCustomAttributes);
        break;
      case "number":
        if (e.length > 0 && e !== "-" && isNaN(e)){
          return;
        }
        setValue({
          ...value,
          number: e.length === 0 ? "" : parseFloat(e),
        });

        const newCustomAttributes2 = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                number: e.length === 0 ? "" : parseFloat(e),
              }
            })
          }
          return item;
        });

        setCustomAttributes(newCustomAttributes2);

        break;
      case "select":
        const newValue1 = [customAttribute.selectValues.find((selectValue) => selectValue.value === e)];

        setValue({
          ...value,
          selectValues: newValue1,
        });

        const newCustomAttributes3 = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                selectValues: newValue1,
              }
            })
          }
          return item;
        });

        setCustomAttributes(newCustomAttributes3);
        break;
      case "multiselect":
        const newCustomAttributes4 = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                selectValues: [...e],
              }
            })
          }
          return item;
        });

        setCustomAttributes(newCustomAttributes4);

        break;
      default:
        setValue({
          ...value,
          text: e,
        });

        const newCustomAttributes5 = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                text: e,
              }
            })
          }
          return item;

        });

        setCustomAttributes(newCustomAttributes5);

    }
  }

  const renderCustomAttribute = () => {

    const placeholder = customAttribute.label;
    const label = `${customAttribute.label}${!customAttribute.isEdit && customAttribute.required ? " *" : ""}`;
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
                value={value.number + ""}
                onChangeText={assignOnChangeFunction}
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
                  value={selectValues.map((value) => value.value)}
                  setValue={setSelectValues}
                  items={items}
                  setItems={(e) => {}}
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
              bgColor="white"
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
