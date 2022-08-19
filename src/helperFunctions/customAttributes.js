import React from 'react';
import { Select, Input, TextArea, FormControl, Stack } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';

export const renderCustomAttribute = (args) => {

  const {
    id,
    placeholder,
    type,
    value,
    label,
    onChangeValue,
    options,
    disabled,
    multiselectIsOpen,
    setMultiselectIsOpen,
    setMultiValue,
    setOptions,
  } = args;

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
            defaultValue={requester.id}
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
            bgColor="white"
            onChangeText={onChangeValue}
            placeholder={placeholder}
            />
        </Stack>
      </FormControl>
    )
  }
}
