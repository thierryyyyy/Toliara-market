/**
 * AppContext — état applicatif global (pipeline-owned, V1780).
 */
import { createContext, useContext } from 'react';

export type AppContextType = {
  siteName?: string;
};

export const AppContext = createContext<AppContextType>({});

export function useApp(): AppContextType {
  return useContext(AppContext);
}
