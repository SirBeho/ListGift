import { useEffect } from 'react';

export function useTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `ListGift | ${title}`;

    // Esto se ejecuta cuando el usuario SE VA de la página (cleanup)
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}