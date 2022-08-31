import React, {
  useState
} from 'react';

import { Box, ScrollView, Text, Select, Button, IconButton, TextArea, FormControl, Checkbox, Input, Stack, AlertDialog, Heading } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';


export default function CustomAttribtueEntry( props ) {

  const {
    addingTask,
    editOpen,
    customAttribute,
    customAttributes,
    attributeChanges,
    setAttributeChanges,
    setCustomAttributes,
  } = props;

  // // TODO: do we need this?
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
        const newCustomAttributes1 = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                text: e.replace("↵", "\n"),
              }
            })
          } else {
            const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
            if (changedCustomAttribute){
              return {
                ...item,
                ...changedCustomAttribute
              };
            } else {
              return item;
            }
          }
        });
        setValue({
          text: e.replace("↵", "\n"),
          number: "",
          selectValues: [],
        });

        const newAttributeChanges1 = {
          ...attributeChanges,
          customAttributes: newCustomAttributes1.map((item) => ({
            text: item.value.text,
            number: item.value.number,
            selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
            customAttribute: item.id,
          })),
        };
        setAttributeChanges(newAttributeChanges1);
        break;
      case "number":
        if (e.length > 0 && e !== "-" && isNaN(e)){
          return;
        }

        const newCustomAttributes2 = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                number: e.length === 0 ? "" : parseFloat(e),
              }
            })
          } else {
            const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
            if (changedCustomAttribute){
              return {
                ...item,
                ...changedCustomAttribute
              };
            } else {
              return item;
            }
          }
        });
        setValue({
          text: "",
          number: e,
          selectValues: [],
        });

        const newAttributeChanges2 = {
          ...attributeChanges,
          customAttributes: newCustomAttributes2.map((item) => ({
            text: item.value.text,
            number: item.value.number,
            selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
            customAttribute: item.id,
          })),
        };
        setAttributeChanges(newAttributeChanges2);

        break;
      case "select":
        const newValue1 = [customAttribute.selectValues.find((selectValue) => selectValue.value === e)];

        const newCustomAttributes3 = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                selectValues: newValue1,
              }
            })
          } else {
            const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
            if (changedCustomAttribute){
              return {
                ...item,
                ...changedCustomAttribute
              };
            } else {
              return item;
            }
          }
        });

        setValue({
          text: "",
          number: "",
          selectValues: newValue1,
        });
        setSelectValues(newValue1);

        const newAttributeChanges3 = {
          ...attributeChanges,
          customAttributes: newCustomAttributes3.map((item) => ({
            text: item.value.text,
            number: item.value.number,
            selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
            customAttribute: item.id,
          })),
        };
        setAttributeChanges(newAttributeChanges3);
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
            } else {
              const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
              if (changedCustomAttribute){
                return {
                  ...item,
                  ...changedCustomAttribute
                };
              } else {
                return item;
              }
            }
          });

          setValue({
            text: "",
            number: "",
            selectValues: e,
          });
          setSelectValues(e);

          const newAttributeChanges4 = {
            ...attributeChanges,
            customAttributes: newCustomAttributes4.map((item) => ({
              text: item.value.text,
              number: item.value.number,
              selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
              customAttribute: item.id,
            })),
          };
          setAttributeChanges(newAttributeChanges4);
      break;
      default:
        const newCustomAttributes5 = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                text: e,
              }
            })
          } else {
            const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
            if (changedCustomAttribute){
              return {
                ...item,
                ...changedCustomAttribute
              };
            } else {
              return item;
            }
          }
        });

        setValue({
          text: e,
          number: "",
          selectValues: [],
        });

        const newAttributeChanges5 = {
          ...attributeChanges,
          customAttributes: newCustomAttributes5.map((item) => ({
            text: item.value.text,
            number: item.value.number,
            selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
            customAttribute: item.id,
          })),
        };
        setAttributeChanges(newAttributeChanges5);
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
              <FormControl.Label>{label}</FormControl.Label>
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
              <FormControl.Label>{label}</FormControl.Label>
              <Input
                keyboardType='numeric'
                bgColor="white"
                type="text"
                value={value.number + ""}
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
            <FormControl.Label>{label}</FormControl.Label>
            <Select
              defaultValue={value.selectValues.length > 0 ? value.selectValues[0].value : null}
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
            <FormControl.Label>{label}</FormControl.Label>
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
            <FormControl.Label>{label}</FormControl.Label>
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

  const renderViewValue = () => {
    let value = null
    switch (customAttribute.type) {
      case "textarea":
        value = customAttribute.value.text;
        break;
      case "number":
        value = customAttribute.value.number;
        break;
      case "select":
        value = customAttribute.value.selectValues && customAttribute.value.selectValues.length > 0 ? customAttribute.value.selectValues[0].label : null;

        break;
      case "multiselect":
        value = customAttribute.value.selectValues && customAttribute.value.selectValues.length > 0 ? customAttribute.value.selectValues.map((value) => value.label).join(", ") : null;

        break;
      default:
        value = customAttribute.value.text;
    }

    return (<Text>{value ? value : "Unset"}</Text>);
  }

  return (
    <Box key={customAttribute.id}>
        {
          editOpen &&
          renderCustomAttribute()
        }
        {
          !editOpen &&
          <Box marginTop="5">
            <Heading variant="list" size="sm">{customAttribute.label}</Heading>
            {renderViewValue()}
          </Box>
        }
    </Box>
  )
}
