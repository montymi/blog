import { ThemeProvider, createTheme } from '@mui/material/styles';

import theme from './themes';
import type { CustomThemeProviderProps } from './types';

function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  return <ThemeProvider theme={createTheme(theme)}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
