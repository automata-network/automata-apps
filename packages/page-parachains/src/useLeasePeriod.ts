// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { LeasePeriod } from './types';

import { useMemo } from 'react';

import { useApi, useBestNumber } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

export default function useLeasePeriod (): LeasePeriod | undefined {
  const { api } = useApi();
  const bestNumber = useBestNumber();

  return useMemo((): LeasePeriod | undefined => {
    if (!api.consts.slots.leasePeriod || !bestNumber) {
      return;
    }

    const length = api.consts.slots.leasePeriod as BlockNumber;
    const startNumber = bestNumber.sub((api.consts.slots.leaseOffset as BlockNumber) || BN_ZERO);
    const progress = startNumber.mod(length);

    return {
      currentPeriod: startNumber.div(length),
      length,
      progress,
      remainder: length.sub(progress)
    };
  }, [api, bestNumber]);
}
