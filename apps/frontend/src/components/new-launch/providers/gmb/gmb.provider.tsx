'use client';

import { FC, useCallback, useEffect } from 'react';
import {
  PostComment,
  withProvider,
} from '@gitroom/frontend/components/new-launch/providers/high.order.provider';
import { GmbSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/gmb.settings.dto';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { Input } from '@gitroom/react/form/input';
import { Select } from '@gitroom/react/form/select';
import { useWatch } from 'react-hook-form';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

const topicTypes = [
  {
    label: 'Standard Update',
    tKey: 'ui_gmb_standard_update',
    value: 'STANDARD',
  },
  {
    label: 'Event',
    tKey: 'ui_gmb_event',
    value: 'EVENT',
  },
  {
    label: 'Offer',
    tKey: 'ui_gmb_offer',
    value: 'OFFER',
  },
];

const callToActionTypes = [
  {
    label: 'None',
    tKey: 'none',
    value: 'NONE',
  },
  {
    label: 'Book',
    tKey: 'ui_gmb_cta_book',
    value: 'BOOK',
  },
  {
    label: 'Order Online',
    tKey: 'ui_gmb_cta_order_online',
    value: 'ORDER',
  },
  {
    label: 'Shop',
    tKey: 'ui_gmb_cta_shop',
    value: 'SHOP',
  },
  {
    label: 'Learn More',
    tKey: 'ui_gmb_cta_learn_more',
    value: 'LEARN_MORE',
  },
  {
    label: 'Sign Up',
    tKey: 'sign_up',
    value: 'SIGN_UP',
  },
  {
    label: 'Get Offer',
    tKey: 'ui_gmb_cta_get_offer',
    value: 'GET_OFFER',
  },
  {
    label: 'Call',
    tKey: 'ui_gmb_cta_call',
    value: 'CALL',
  },
];

const GmbSettings: FC = () => {
  const { register, control } = useSettings();
  const topicType = useWatch({ control, name: 'topicType' });
  const callToActionType = useWatch({ control, name: 'callToActionType' });
  const t = useT();

  return (
    <div className="flex flex-col gap-[10px]">
      <Select
        label="Post Type"
        {...register('topicType', {
          value: 'STANDARD',
        })}
      >
        {topicTypes.map((item) => (
          <option key={item.value} value={item.value}>
            {t(item.tKey, item.label)}
          </option>
        ))}
      </Select>

      <Select
        label="Call to Action"
        {...register('callToActionType', {
          value: 'NONE',
        })}
      >
        {callToActionTypes.map((item) => (
          <option key={item.value} value={item.value}>
            {t(item.tKey, item.label)}
          </option>
        ))}
      </Select>

      {callToActionType &&
        callToActionType !== 'NONE' &&
        callToActionType !== 'CALL' && (
          <Input
            label="Call to Action URL"
            placeholder="https://example.com"
            {...register('callToActionUrl')}
          />
        )}

      {topicType === 'EVENT' && (
        <div className="flex flex-col gap-[10px] mt-[10px] p-[15px] border border-input rounded-[8px]">
          <div className="text-[14px] font-medium mb-[5px]">
            {t('ui_gmb_event_details', 'Event Details')}
          </div>
          <Input
            label="Event Title"
            placeholder={t('ui_gmb_event_name', 'Event name')}
            {...register('eventTitle')}
          />
          <div className="grid grid-cols-2 gap-[10px]">
            <Input
              label="Start Date"
              type="date"
              {...register('eventStartDate')}
            />
            <Input label="End Date" type="date" {...register('eventEndDate')} />
          </div>
          <div className="grid grid-cols-2 gap-[10px]">
            <Input
              label="Start Time (optional)"
              type="time"
              {...register('eventStartTime')}
            />
            <Input
              label="End Time (optional)"
              type="time"
              {...register('eventEndTime')}
            />
          </div>
        </div>
      )}

      {topicType === 'OFFER' && (
        <div className="flex flex-col gap-[10px] mt-[10px] p-[15px] border border-input rounded-[8px]">
          <div className="text-[14px] font-medium mb-[5px]">
            {t('ui_gmb_offer_details', 'Offer Details')}
          </div>
          <Input
            label="Coupon Code (optional)"
            placeholder="SAVE20"
            {...register('offerCouponCode')}
          />
          <Input
            label="Redeem Online URL (optional)"
            placeholder="https://example.com/redeem"
            {...register('offerRedeemUrl')}
          />
          <Input
            label="Terms & Conditions (optional)"
            placeholder={t('ui_gmb_valid_until', 'Valid until...')}
            {...register('offerTerms')}
          />
        </div>
      )}
    </div>
  );
};

export default withProvider({
  postComment: PostComment.POST,
  minimumCharacters: [],
  SettingsComponent: GmbSettings,
  CustomPreviewComponent: undefined,
  dto: GmbSettingsDto,
  maximumCharacters: 1500,
});
