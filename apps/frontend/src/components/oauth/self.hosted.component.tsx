'use client';

import { FC, FormEvent, useCallback, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { Input } from '@gitroom/react/form/input';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

export const OAuthSelfHosted: FC<{
  appName: string;
  // clients that read the email from userinfo (ChatGPT) need one
  askEmail: boolean;
  params: {
    client_id: string | null;
    state: string | null;
    redirect_uri: string | null;
    code_challenge: string | null;
    code_challenge_method: string | null;
    resource: string | null;
  };
  onBack: () => void;
}> = ({ appName, askEmail, params, onBack }) => {
  const fetch = useFetch();
  const t = useT();
  const [instanceUrl, setInstanceUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const connect = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');
      try {
        const response = await fetch('/oauth/authorize/self-hosted', {
          method: 'POST',
          body: JSON.stringify({
            client_id: params.client_id,
            state: params.state,
            ...(params.redirect_uri
              ? { redirect_uri: params.redirect_uri }
              : {}),
            ...(params.code_challenge
              ? { code_challenge: params.code_challenge }
              : {}),
            ...(params.code_challenge_method
              ? { code_challenge_method: params.code_challenge_method }
              : {}),
            ...(params.resource ? { resource: params.resource } : {}),
            instance_url: instanceUrl.trim(),
            ...(apiKey.trim() ? { api_key: apiKey.trim() } : {}),
            ...(askEmail && email.trim() ? { email: email.trim() } : {}),
          }),
        });
        const data = await response.json();
        if (data.redirect) {
          window.location.href = data.redirect;
          return;
        }

        setError(
          response.status === 429
            ? t('ui_too_many_attempts', 'Too many attempts, try again later')
            : (Array.isArray(data.message) ? data.message[0] : data.message) ||
                t(
                  'ui_could_not_connect_instance',
                  'Could not connect to your instance'
                )
        );
      } catch {
        setError(
          t(
            'ui_could_not_connect_instance',
            'Could not connect to your instance'
          )
        );
      }
      setSubmitting(false);
    },
    [params, instanceUrl, apiKey, email, askEmail, t]
  );

  return (
    <form
      onSubmit={connect}
      className="border-t border-[#2A2929] pt-[16px] flex flex-col gap-[16px]"
    >
      <div className="flex flex-col gap-[4px]">
        <div className="text-[16px] font-semibold">
          {t('ui_use_self_hosted', 'Use self-hosted')}
        </div>
        <div className="text-[14px] text-gray-400">
          {t(
            'ui_self_hosted_description',
            '{{appName}} will work with your own Veltrante instance. Veltrante Cloud relays its requests, and your API key is stored encrypted.',
            { appName, interpolation: { escapeValue: false } }
          )}
        </div>
      </div>

      {/* plain text fields: a password field makes browsers autofill the
          saved Postiz login (email + password) into this form */}
      <Input
        name="instance_url"
        label="Instance URL"
        disableForm={true}
        removeError={true}
        value={instanceUrl}
        onChange={(e) => setInstanceUrl(e.target.value)}
        placeholder="https://postiz.example.com"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
      />

      <div className="flex flex-col gap-[6px]">
        <Input
          name="api_key"
          label="API key"
          disableForm={true}
          removeError={true}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={t(
            'ui_api_key_placeholder',
            'Settings > Agents / Dev on your instance'
          )}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="text-[12px] text-gray-400">
          {t(
            'ui_self_hosted_mcp_url_hint',
            'You can also paste the MCP URL from Settings > Agents (Developers or Public API on older versions) in the Instance URL, it includes the key.'
          )}
        </div>
      </div>

      {askEmail && (
        <div className="flex flex-col gap-[6px]">
          <Input
            name="email"
            label="Email"
            type="email"
            disableForm={true}
            removeError={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <div className="text-[12px] text-gray-400">
            {t(
              'ui_self_hosted_email_hint',
              '{{appName}} uses it to identify your account.',
              { appName, interpolation: { escapeValue: false } }
            )}
          </div>
        </div>
      )}

      {!!error && <div className="text-[14px] text-red-400">{error}</div>}

      <div className="flex gap-[12px]">
        <button
          type="submit"
          disabled={
            submitting || !instanceUrl.trim() || (askEmail && !email.trim())
          }
          className="flex-1 bg-[#612BD3] hover:bg-[#7B3FF2] disabled:opacity-50 text-white rounded-[8px] py-[10px] px-[16px] text-[14px] font-semibold transition-colors"
        >
          {submitting
            ? t('ui_connecting', 'Connecting...')
            : t('connect', 'Connect')}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 bg-[#2A2929] hover:bg-[#3A3939] disabled:opacity-50 text-white rounded-[8px] py-[10px] px-[16px] text-[14px] font-semibold transition-colors"
        >
          {t('back', 'Back')}
        </button>
      </div>

      <div className="text-[12px] text-gray-400 text-center">
        {t(
          'ui_self_hosted_https_hint',
          'Your instance has to be reachable from the internet over https.'
        )}
      </div>
    </form>
  );
};
