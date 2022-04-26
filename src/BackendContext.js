/** React context to store backend (orion server) address, with a default value. */
import React from 'react';

/** Default address value. */
export const DEFAULT_BACKEND = 'http://127.0.0.1:8000';

/** React context. */
export const BackendContext = React.createContext({
  address: DEFAULT_BACKEND,
});
