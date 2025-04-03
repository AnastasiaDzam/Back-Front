import React from 'react';

export default function RouterErrorFallback(): React.JSX.Element {
  return (
    <div>
      <h1>Ошибка при загрузке страницы</h1>
      <h4>Пожалуйста, не обижайтесь...перезагрузите или повторите позднее..</h4>
    </div>
  );
}
