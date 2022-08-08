export const toSelArr = (arr, index = 'title') => arr.map((item) => {
  return {
    ...item,
    value: item.id,
    label: item[index]
  }
})
