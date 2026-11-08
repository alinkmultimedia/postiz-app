'use client';

import { FC } from 'react';
import { fromUtc } from '@gitroom/frontend/components/layout/set.timezone';
import { formatDateTime } from '@gitroom/frontend/components/layout/date.formats';

export const RenderPreviewDate: FC<{ date: string }> = ({ date }) => {
  return <>{formatDateTime(fromUtc(date))}</>;
};
