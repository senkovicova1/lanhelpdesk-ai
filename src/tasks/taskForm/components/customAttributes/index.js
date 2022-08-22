import React from 'react';

import { View } from "native-base";
import CustomAttributeEntry from './entry';

export default function CustomAttributesList( props ) {

  const {
    customAttributes,
  } = props;

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
