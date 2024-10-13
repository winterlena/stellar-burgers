import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserData } from '../../services/slices/userSlice';
import { Outlet } from 'react-router-dom';

// export const AppHeader: FC = () => <AppHeaderUI userName='' />;
export const AppHeader: FC = () => {
  const userName = useSelector(getUserData)?.name || '';
  return (
    <>
      <AppHeaderUI userName={userName} />
      <Outlet />
    </>
  );
};
