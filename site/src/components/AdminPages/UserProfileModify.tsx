import React, { useCallback } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Checkbox,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { ThemeProps } from 'Utils/themeProps';
import MySelect from 'Common/MySelect';
import MyInput from 'Common/MyInput';
import { objUrlEncode } from 'Utils/objUrlEncode';



interface UserProfileModifyProps {
  themes: ThemeProps[] | undefined
  profile: any
}


export function UserProfileModify({ themes, profile }: UserProfileModifyProps): JSX.Element {

  const { addNotif } = useNotification();
  const [settings, setSettings] = React.useState<any | undefined>(profile);
  const [password, setPassword] = React.useState<string>('');
  const minPasswordLength = 4;

  const modifyUserSettings = useCallback((): Promise<boolean> => {
    const { login: _login,
      avatar_url: _avatar_url,
      modify: _modify,
      password: _password,
      ban_date: _ban_date,
      css_click: _css_click,
      ads: _ads,
      ...saveSettings } = settings;

    return axios
      .post('/?page=admin&action=profile_set', objUrlEncode(
        saveSettings
      ),
      { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          addNotif('Settings changed', 'success');
        }
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }, [addNotif, settings]);

  const modifyUserPassword = useCallback((): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=password_set', objUrlEncode({
        user_id:  settings.user_id,
        password: password.length > minPasswordLength ? password : '',
      }),
      )
      .then((res) => {
        if (res.status === 200) {
          addNotif('Password changed', 'success');
        }
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }, [addNotif, password, settings.user_id]);

  return (
    <div className='my-content'>
      <p className='text-center text-2xl spacing font-extrabold tracking-wide mb-4'>
          Settings
      </p>


      <div className="mb-4 flex flex-col gap-6">

        <div className='flex flex-row gap-2'>
          <MyInput
            label='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={modifyUserPassword} className='w-28 h-10 p-0'>
            {password.length > minPasswordLength ? 'Save password' : 'Remove password'}
          </Button>
        </div>

        <Checkbox crossOrigin={undefined}
          labelProps={{ className: 'my-text' }}
          checked={settings.can_change_theme}
          onChange={() => setSettings((prev: any) => {return { ...prev, can_change_theme: !prev.can_change_theme };})}
          label='Can change theme'
        />

        <div className='flex flex-row gap-2'>
          <MySelect label='Theme' className=''
            containerProps='!min-w-0'
            value={settings.theme_id}
            onChange={(e) =>
              setSettings((prev: any) => {return { ...prev, theme_id: Number(e.target.value) };})
            }
          >
            {themes?.map((theme) =>
              <option key={theme.id} value={theme.id}>{theme.name}</option>
            )}
          </MySelect>

          <MyInput type='color'
            label='Color'
            containerProps='!min-w-[80px] w-[80px]'
            defaultValue={settings.color}
            onChange={(e) => setSettings((prev: any) => {return { ...prev, color: e.target.value };})}
          />
        </div>

        <MyInput
          label='Github link'
          value={settings.github_link || ''}
          onChange={(e) => setSettings((prev: any) => {return { ...prev, github_link: e.target.value };})}
        />

        <MyInput
          label='Citation'
          value={settings.citation || ''}
          onChange={(e) => setSettings((prev: any) => {return { ...prev, citation: e.target.value };})}
        />
        <MyInput
          label='Citation avatar'
          value={settings.citation_avatar || ''}
          onChange={(e) => setSettings((prev: any) => {return { ...prev, citation_avatar: e.target.value };})}
        />
      </div>

      <Checkbox crossOrigin={undefined}
        labelProps={{ className: 'my-text' }}
        checked={settings.terms}
        onChange={() => setSettings((prev: any) => {return { ...prev, terms: !prev.terms };})}
        label='Terms'
      />

      <Button onClick={modifyUserSettings} className="mt-6" fullWidth>
          Save
      </Button>
    </div>
  );
}
