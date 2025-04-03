import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/enums/routes';

export function Page404(): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Упс..братишка/сестренка, такой страницы нет...</h1>
      <Button type="primary" onClick={() => navigate(ROUTES.HOME)}>
        Главная
      </Button>
    </div>
  );
}
