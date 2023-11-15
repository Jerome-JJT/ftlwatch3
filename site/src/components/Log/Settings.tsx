import React, { useCallback } from 'react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { Button, Card, Checkbox } from '@material-tailwind/react';
import MySelect from 'Common/MySelect';
import MyInput from 'Common/MyInput';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { useLogin } from 'Hooks/LoginProvider';
import { ThemeProps } from 'Utils/themeProps';




export function SettingsPage(): JSX.Element {
  const { addNotif } = useNotification();
  const { userInfos, getUserData } = useLogin();

  const [themes, setThemes] = React.useState<ThemeProps[] | undefined>(undefined);

  const [themeValue, setThemeValue] = React.useState(userInfos?.theme_id);
  const [themeColor, setThemeColor] = React.useState(userInfos?.theme_color);
  const [terms, _setTerms] = React.useState(userInfos?.terms);


  React.useEffect(() => {
    axios
      .get('/?page=me&action=themes_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {

          setThemes(res.data.themes as ThemeProps[]);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);

  const saveSettings = useCallback((): Promise<boolean> => {
    return axios
      .post('/?page=me&action=settings_set',

        `themeValue=${themeValue}&themeColor=${themeColor}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          addNotif('Save success', 'success');
          getUserData({ reload: true });
        }
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }, [addNotif, getUserData, themeColor, themeValue]);

  return (
    <div className='flex flex-row justify-center mt-4'>

      <Card className='big-card px-8 py-4 max-w-screen-lg gap-4' shadow={false}>

        <p className='text-center text-2xl spacing font-extrabold tracking-wide mb-4'>
          Settings
        </p>

        {/* <div className="mb-4 flex flex-col gap-6">
          <p className="mt-1 font-normal">
          Link your github
          </p>
          <MyInput label="Github url" />
        </div> */}


        <div className="mb-4 flex flex-col gap-6">
          <div className='flex flex-row gap-2'>

            <MySelect label='Theme' className=''
              containerProps='!min-w-0'

              value={themeValue} onChange={(e) => setThemeValue(Number(e.target.value))}>
              {themes?.map((theme) =>
                <option key={theme.id} value={theme.id}>{theme.name}</option>
              )}
            </MySelect>

            {
              themes?.some((theme) => theme.name.toLowerCase().includes('color') && theme.id === themeValue) &&
              <MyInput type='color'
                label='Color'
                containerProps='!min-w-[80px] w-[80px]'
                defaultValue={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
              /> ||
              themes?.some((theme) => !theme.name.toLowerCase().includes('default') && theme.id === themeValue) &&
              <img className='h-10' src={themes?.find((theme) => theme.id === themeValue)?.image }/>
            }
          </div>
        </div>

        <Checkbox
          checked={terms}
          readOnly
          label={
            <p className="my-text flex items-center font-normal">
              I agree the
              <a className="font-medium transition-colors hover:text-gray-900 ">
                &nbsp;Terms and Conditions
              </a>
            </p>
          }
          containerProps={{ className: '-ml-2.5' }}
        />

        <p className='text-center'>
          More coming soon ...
        </p>

        <Button onClick={saveSettings} className="mt-6" fullWidth>
          Save
        </Button>
      </Card>
    </div>

  );
}

