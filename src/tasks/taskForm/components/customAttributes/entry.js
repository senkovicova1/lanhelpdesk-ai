import React, {
  useState
} from 'react';

import { Box, ScrollView, Text, Select, Button, IconButton, TextArea, FormControl, Checkbox, Input, Stack, AlertDialog, Heading } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';

export default function CustomAttribtueEntry( props ) {

  const {
    editOpen,
    customAttribute,
    customAttributes,
    attributeChanges,
    setAttributeChanges,
    setCustomAttributes,
  } = props;

  const [value, setValue] = useState({
    text: "",
    number: "",
    selectValues: [] //iba item.value, nie cely object item
  });

  const [multiselectIsOpen, setMultiselectIsOpen] = useState(false);

  React.useEffect( () => {
    setValue({
      text: customAttribute.value.text,
      number: customAttribute.value.number,
      selectValues: customAttribute.value.selectValues,
    })
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
              const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
              if (changedCustomAttribute){
                return changedCustomAttribute;
              } else {
              return item;
              }
            }
          });

          const newAttributeChanges = {
            ...attributeChanges,
            customAttributes: newCustomAttributes.map((item) => ({
              text: item.value.text,
              number: item.value.number,
              selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
              customAttribute: item.id,
            })),
          };
          setAttributeChanges(newAttributeChanges);
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
              const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
              if (changedCustomAttribute){
                return changedCustomAttribute;
              } else {
              return item;
              }
            }
          });

          const newAttributeChanges = {
            ...attributeChanges,
            customAttributes: newCustomAttributes.map((item) => ({
              text: item.value.text,
              number: item.value.number,
              selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
              customAttribute: item.id,
            })),
          };
          setAttributeChanges(newAttributeChanges);
        });
        break;
      case "select":
      return ((e) => {

        const newValue = [customAttribute.selectValues.find((selectValue) => selectValue.label === e)];

        setValue({
          ...value,
          selectValues: newValue,
        });

        let newCustomAttributes = customAttributes.map((item) => {
          if (item.id === customAttribute.id){
            return ({
              ...item,
              value: {
                ...value,
                selectValues: newValue,
              }
            })
          } else {
            const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
            if (changedCustomAttribute){
              return changedCustomAttribute;
            } else {
            return item;
            }
          }
        });

        const newAttributeChanges = {
          ...attributeChanges,
          customAttributes: newCustomAttributes.map((item) => ({
            text: item.value.text,
            number: item.value.number,
            selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
            customAttribute: item.id,
          })),
        };
        setAttributeChanges(newAttributeChanges);
      });
      break;
      case "multiselect":
        return ((e) => {

          const newValue = customAttribute.selectValues.filter((selectValue) => e.includes(selectValue.value));

          setValue({
            ...value,
            selectValues: newValue,
          });

          let newCustomAttributes = customAttributes.map((item) => {
            if (item.id === customAttribute.id){
              return ({
                ...item,
                value: {
                  ...value,
                  selectValues: newValue,
                }
              })
            } else {
              const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
              if (changedCustomAttribute){
                return changedCustomAttribute;
              } else {
              return item;
              }
            }
          });

          const newAttributeChanges = {
            ...attributeChanges,
            customAttributes: newCustomAttributes.map((item) => ({
              text: item.value.text,
              number: item.value.number,
              selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
              customAttribute: item.id,
            })),
          };
          setAttributeChanges(newAttributeChanges);
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
            const changedCustomAttribute = attributeChanges.customAttributes ? attributeChanges.customAttributes.find((change) => change.customAttribute === item.id ) : null;
            if (changedCustomAttribute){
              return changedCustomAttribute;
            } else {
            return item;
            }
          }
        });

        const newAttributeChanges = {
          ...attributeChanges,
          customAttributes: newCustomAttributes.map((item) => ({
            text: item.value.text,
            number: item.value.number,
            selectValues: item.value.selectValues.map((value) => value.id).filter((value) => value !== null),
            customAttribute: item.id,
          })),
        };
        setAttributeChanges(newAttributeChanges);
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
              defaultValue={value.selectValues.length > 0 ? value.selectValues[0].value : null}
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
        value = customAttribute.value.selectValues ? customAttribute.value.selectValues[0].value.substring(0,1).toUpperCase() + customAttribute.value.selectValues[0].value.substring(1) : null;
        break;
      case "multiselect":
        value = customAttribute.value.selectValues ? customAttribute.value.selectValues.map((value) => value.value.substring(0,1).toUpperCase() + value.value.substring(1)).join(", ") : null;
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
