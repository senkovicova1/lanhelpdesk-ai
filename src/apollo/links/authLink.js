import {
  setContext
} from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';
import {
  setIsLoggedIn
} from '../localSchema/actions';
import refreshToken from '../refreshToken';
import moment from 'moment';

const afterNow = ( unix ) => {
  return unix > moment().unix()
}

export const authLink = setContext(
  async ( _, {
    headers
  } ) => {
    let token = sessionStorage.getItem( 'acctok' );
    if ( !token ) {
      return headers;
    }
    if ( !afterNow( jwtDecode( token ).exp ) ) {
      const {
        ok,
        accessToken
      } = ( await refreshToken() ).data;
      if ( ok ) {
        token = accessToken;
        sessionStorage.setItem( "acctok", accessToken );
      } else {
        sessionStorage.removeItem( "acctok" )
        setIsLoggedIn( false );
      }
    }
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      }
    }
  } );
