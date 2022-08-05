export const splitArrayByFilter = ( array, filter ) => {
  return array.reduce( ( [ p, f ], e ) => ( filter( e ) ? [
    [ ...p, e ], f
  ] : [ p, [ ...f, e ] ] ), [
    [],
    []
  ] );
}


export const sortBy = ( originalArray, byAttributes = defaultByAttributes ) => {
  let array = [ ...originalArray ];
  if ( byAttributes.length === 0 ) {
    return array;
  }

  return array.sort( ( item1, item2 ) => {
    const results = byAttributes.map( ( attribute ) => {
      const value = attribute.asc ? 1 : -1;
      if ( item1[ attribute.key ] > item2[ attribute.key ] ) {
        return value;
      }
      if ( item1[ attribute.key ] < item2[ attribute.key ] ) {
        return -1 * value;
      }
      return 0;
    } );
    const result = results.find( ( res ) => res !== 0 );
    return result || 0;
  } );
}
