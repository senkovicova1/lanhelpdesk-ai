import {
  setContext
} from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';
import {
  setIsLoggedIn
} from '../localSchema/actions';
import refreshToken from '../refreshToken';
import moment from 'moment';

import localStorage from 'react-native-sync-localstorage';

const afterNow = ( unix ) => {
  return unix > moment().unix()
}

export const authLink = setContext(
  async ( _, {
    headers
  } ) => {
    let token = localStorage.getItem( 'acctok' );
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
        localStorage.setItem( "acctok", accessToken );
      } else {
        localStorage.removeItem( "acctok" )
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
