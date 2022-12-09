import {
  makeVar
} from "@apollo/client";

import {dashboard} from '../../../configs/constants';

export const projectVar = makeVar( dashboard );
