import {
  makeVar
} from "@apollo/client";

import {
  getEmptyGeneralFilter
} from '../../../configs/constants';

export const filterVar = makeVar( getEmptyGeneralFilter() );
