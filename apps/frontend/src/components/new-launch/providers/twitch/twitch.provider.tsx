'use client';

import { FC } from 'react';
import {
  PostComment,
  withProvider,
} from '@gitroom/frontend/components/new-launch/providers/high.order.provider';
import { TwitchDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/twitch.dto';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { Select } from '@gitroom/react/form/select';
import { useWatch } from 'react-hook-form';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

const messageTypes = [
  {
    label: 'Chat Message',
    tKey: 'ui_twitch_chat_message',
    value: 'message',
  },
  {
    label: 'Announcement',
    tKey: 'ui_twitch_announcement',
    value: 'announcement',
  },
];

const announcementColors = [
  {
    label: 'Primary (Default)',
    tKey: 'ui_twitch_color_primary',
    value: 'primary',
  },
  {
    label: 'Blue',
    tKey: 'ui_color_blue',
    value: 'blue',
  },
  {
    label: 'Green',
    tKey: 'ui_color_green',
    value: 'green',
  },
  {
    label: 'Orange',
    tKey: 'ui_color_orange',
    value: 'orange',
  },
  {
    label: 'Purple',
    tKey: 'ui_color_purple',
    value: 'purple',
  },
];

const TwitchSettings: FC = () => {
  const { register, control } = useSettings();
  const t = useT();
  const messageType = useWatch({
    control,
    name: 'messageType',
  });

  return (
    <div className="flex flex-col">
      <Select
        label="Message Type"
        {...register('messageType', {
          value: 'message',
        })}
      >
        {messageTypes.map((item) => (
          <option key={item.value} value={item.value}>
            {t(item.tKey, item.label)}
          </option>
        ))}
      </Select>
      {messageType === 'announcement' && (
        <Select
          label="Announcement Color"
          {...register('announcementColor', {
            value: 'primary',
          })}
        >
          {announcementColors.map((c) => (
            <option key={c.value} value={c.value}>
              {t(c.tKey, c.label)}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default withProvider({
  postComment: PostComment.COMMENT,
  comments: 'no-media',
  minimumCharacters: [],
  SettingsComponent: TwitchSettings,
  CustomPreviewComponent: undefined,
  dto: TwitchDto,
  maximumCharacters: 500,
});
