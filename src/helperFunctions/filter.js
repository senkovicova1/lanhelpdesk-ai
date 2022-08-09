export const localFilterToValues = ( localFilter ) => {
  let filterValues = {
    ...localFilter.filter,
    assignedTos: localFilter.filter.assignedTos.map( ( user ) => user.id ),
    requesters: localFilter.filter.requesters.map( ( user ) => user.id ),
    companies: localFilter.filter.companies.map( ( company ) => company.id ),
    /*taskTypes: localFilter.filter.taskTypes.map( ( taskType ) => taskType.id ),*/
    tags: localFilter.filter.tags.map( ( tag ) => tag.id ),
    statuses: localFilter.filter.statuses.map( ( tag ) => tag.id ),
    customAttributes: localFilter.filter.customAttributes.map( ( attribute ) => ( {
      text: attribute.text,
      number: attribute.number,
      selectValues: attribute.selectValues.map((value) => value.id),
      customAttribute: attribute.customAttribute.id
    } ) ),
  }
  delete filterValues.__typename;
  return filterValues;
}
