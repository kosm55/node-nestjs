import { SetMetadata } from '@nestjs/common';

import { SKIP_AUTH } from '../constants/constants';

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true); //додає ключ SKIP_AUTH зі значенням true
