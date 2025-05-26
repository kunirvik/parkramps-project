import { useEffect, useRef } from 'react';

export const useUrlNavigation = () => {
  const isUrlUpdatingRef = useRef(false);

  // Обновление URL без перезагрузки компонента
  const updateUrlAndParams = (productId, viewIndex = 0, category = 'ramps') => {
    // Предотвращаем циклические обновления
    if (isUrlUpdatingRef.current) return;
    
    isUrlUpdatingRef.current = true;
    
    // Используем replaceState вместо navigate для более мягкого обновления URL
    const newUrl = `/product/${category}/${productId}?view=${viewIndex}`;
    window.history.replaceState(null, '', newUrl);
    
    // Сбрасываем блокировку через небольшую задержку
    setTimeout(() => {
      isUrlUpdatingRef.current = false;
    }, 50);
  };

  return { updateUrlAndParams, isUrlUpdatingRef };
};

export default useUrlNavigation;