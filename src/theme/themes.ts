import { ThemeOptions } from '@mui/material/styles';

// Color literals below must be kept in sync by hand with the canonical
// values declared in ./tokens.css — createTheme() needs plain JS values, so
// that file can't be imported as this module's source of truth directly.
const theme: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0d12', // --ink
      paper: '#12161d', // --panel
    },
    text: {
      primary: '#e7eaef', // --fg
      secondary: '#8991a0', // --fg-muted
    },
    divider: '#232933', // --line
    primary: {
      main: '#2b8fd4', // --accent-blue — ocean blue, the fleet accent
      contrastText: '#0a0d12',
    },
    secondary: {
      main: '#3f8f5f', // --accent-green — forest green, diff additions only
      contrastText: '#0a0d12',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", sans-serif',
    h1: { fontFamily: '"Nunito", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Nunito", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Nunito", sans-serif', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #232933',
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          border: '1px solid #232933',
          boxShadow: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#232933',
        },
        vertical: {
          marginRight: 10,
          marginLeft: 10,
        },
        // TODO: open issue for missing "horizontal" CSS rule
        // in Divider API - https://mui.com/material-ui/api/divider/#css
        middle: {
          marginTop: 10,
          marginBottom: 10,
          width: '80%',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#8991a0',
          '&:hover': {
            color: '#2b8fd4',
            backgroundColor: 'rgba(43, 143, 212, 0.08)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#232933',
        },
      },
    },
  },
};

export default theme;
