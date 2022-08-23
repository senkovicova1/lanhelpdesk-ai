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
    selectValues: [] //iba item.value, nie cely object item
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
          if (addingTask){
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
              }
              return item;
            });

            setCustomAttributes(newCustomAttributes);
          } else {

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
                  return {
                    ...item,
                    ...changedCustomAttribute
                  };
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
            const newAttributeChangesDisplayValues = {
              customAttributes: newCustomAttributes.map((item) => {
                if (['select', 'multiselect'].includes(item.type)){
                  return item.value.selectValues.map((value) => value.label).join(", ");
                }
                if (item.type === "number"){
                  return item.value.number;
                }
                return item.value.text;
              }),
            }
            setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
          }
        });
        break;
      case "number":
        return ( (e) => {
          if (addingTask){
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
              }
                return item;
              }
            });

            setCustomAttributes(newCustomAttributes);
          } else {

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
                  return {
                    ...item,
                    ...changedCustomAttribute
                  };
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
            const newAttributeChangesDisplayValues = {
              customAttributes: newCustomAttributes.map((item) => {
                if (['select', 'multiselect'].includes(item.type)){
                  return item.value.selectValues.map((value) => value.label).join(", ");
                }
                if (item.type === "number"){
                  return item.value.number;
                }
                return item.value.text;
              }),
            }
            setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
          }
        });
        break;
      case "select":
      return ((e) => {
        const newValue = [customAttribute.selectValues.find((selectValue) => selectValue.label === e)];
        if (addingTask){

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
            }
              return item;
            }
          });

          setCustomAttributes(newCustomAttributes);
        } else {

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
                return {
                  ...item,
                  ...changedCustomAttribute
                };
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
          const newAttributeChangesDisplayValues = {
            customAttributes: newCustomAttributes.map((item) => {
              if (['select', 'multiselect'].includes(item.type)){
                return item.value.selectValues.map((value) => value.label).join(", ");
              }
              if (item.type === "number"){
                return item.value.number;
              }
              return item.value.text;
            }),
          }
          setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
        }
      });
      break;
      case "multiselect":
        return ((e) => {
          const newValue = [customAttribute.selectValues.find((selectValue) => selectValue.label === e)];
          if (addingTask){

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
              }
                return item;
              }
            });

            setCustomAttributes(newCustomAttributes);
          } else {

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
                  return {
                    ...item,
                    ...changedCustomAttribute
                  };
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
            const newAttributeChangesDisplayValues = {
              customAttributes: newCustomAttributes.map((item) => {
                if (['select', 'multiselect'].includes(item.type)){
                  return item.value.selectValues.map((value) => value.label).join(", ");
                }
                if (item.type === "number"){
                  return item.value.number;
                }
                return item.value.text;
              }),
            }
            setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
          }
        });
      break;
      default:
      return ((e) => {
        if (addingTask){
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
            }
              return item;
            }
          });

          setCustomAttributes(newCustomAttributes);
        } else {

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
                return {
                  ...item,
                  ...changedCustomAttribute
                };
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
          const newAttributeChangesDisplayValues = {
            customAttributes: newCustomAttributes.map((item) => {
              if (['select', 'multiselect'].includes(item.type)){
                return item.value.selectValues.map((value) => value.label).join(", ");
              }
              if (item.type === "number"){
                return item.value.number;
              }
              return item.value.text;
            }),
          }
          setAttributeChangesDisplayValues(newAttributeChangesDisplayValues);
        }
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

    let displayValue = null;
    if (addingTask){
      displayValue = {...value};
    }
    if (!addingTask){
      if (attributeChanges.customAttributes){
        let change = attributeChanges.customAttributes.find((change) => change.customAttribute === customAttribute.id);
        displayValue = {
          text: change.text,
          number: change.number,
          selectValues: change.selectValues,
        }
      } else {
        displayValue = {
          text: customAttribute.value.text,
          number: customAttribute.value.number,
          selectValues: customAttribute.value.selectValues,
        }
      }
    }

    switch (type) {
      case "textarea":
        return (
          <FormControl key={id} isDisabled={disabled}>
            <Stack>
              <FormControl.Label>{label}</FormControl.Label>
              <TextArea
                key={id}
                bgColor="white"
                value={displayValue.text}
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
                value={displayValue.number.toString()}
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
              defaultValue={displayValue.selectValues.length > 0 ? displayValue.selectValues[0] : null}
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
                value={displayValue.selectValues}
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
              value={displayValue.text}
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
    if (attributeChangesDisplayValues.customAttributes){
      const change = attributeChangesDisplayValues.customAttributes.find((change) => change.customAttribute === customAttribute.id);
    }
    switch (customAttribute.type) {
      case "textarea":
        value = change ? change.text : customAttribute.value.text;
        break;
      case "number":
        value = change ? change.number : customAttribute.value.number;
        break;
      case "select":
        if (change){
          value = change.selectValues;
        } else {
          value = customAttribute.value.selectValues ? customAttribute.value.selectValues[0].value.substring(0,1).toUpperCase() + customAttribute.value.selectValues[0].value.substring(1) : null;
        }
        break;
      case "multiselect":
        if (change){
          value = change.selectValues;
        } else {
          value = customAttribute.value.selectValues ? customAttribute.value.selectValues.map((value) => value.value.substring(0,1).toUpperCase() + value.value.substring(1)).join(", ") : null;
        }
        break;
      default:
        value = change ? change.text : customAttribute.value.text;
    }

    return (<Text>{value ? value : "Unset"}</Text>);
  }

  return (
    <Box key={customAttribute.id}>
        {
          (addingTask || editOpen) &&
          renderCustomAttribute()
        }
        {
          !addingTask &&
          !editOpen &&
          <Box marginTop="5">
            <Heading variant="list" size="sm">{customAttribute.label}</Heading>
            {renderViewValue()}
          </Box>
        }
    </Box>
  )
}
