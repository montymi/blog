import { Route, Routes } from 'react-router-dom';

import routes from '..';
import { useTheme } from '@mui/material/styles';
import { getPageHeight } from './utils';

function Pages() {
  const theme = useTheme(); // Access the theme

  return (
    <div
      style={{
        height: getPageHeight(theme), // Pass theme to the utility function
      }}
    >
      <Routes>
        {Object.values(routes).map(({ path, component: Component }) => {
          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Routes>
    </div>
  );
}

export default Pages;
