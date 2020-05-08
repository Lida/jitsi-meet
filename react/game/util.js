import React from 'react';

/**
 * Get existing state
 * @param {*} localStorageKey Storage key
 * @param {*} defaultValue
 * @returns [value , setValue {Function}] value stored in localStorage
 */
export const useStateWithLocalStorage = (localStorageKey, defaultValue = '') => {
    const [value, setValue] = React.useState(
      localStorage.getItem(localStorageKey) || ''
    );
   
    React.useEffect(() => {
      localStorage.setItem(localStorageKey, value);
    }, [value]);
   
    return [value, setValue];
  };