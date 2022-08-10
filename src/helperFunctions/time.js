import moment from 'moment';

export const timestampToString = ( timestamp, trimmed = false, dateOnly = false ) => {
  if ( trimmed ) {
    return moment( parseInt( timestamp ) ).format( 'H:mm D.M.YYYY' );
  }
  if ( dateOnly ) {
    return moment( parseInt( timestamp ) ).format( 'D.M.YYYY' );
  }
  return moment( parseInt( timestamp ) ).format( 'HH:mm DD.MM.YYYY' );
}
