import React from 'react';

import { View } from "native-base";
import CustomAttributeEntry from './entry';

export default function CustomAttributesList( props ) {

  const {
    customAttributes,
  } = props;

  console.log(customAttributes.map(ca => ca.label + " " + ca.type).join(", "));

  return (
    <View>
      {
        customAttributes.map((customAttribute) => (
          <CustomAttributeEntry
            {...props}
            key={customAttribute.id}
            customAttribute={customAttribute}
            />
        ))
      }
    </View>
  )
}
