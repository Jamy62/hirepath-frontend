import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';

import { baselightTheme } from "./theme/DefaultColors";
import {AuthProvider} from "src/contexts/AuthContext.js";

function App() {
  
  const routing = useRoutes(Router);
  const theme = baselightTheme;

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {routing}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App