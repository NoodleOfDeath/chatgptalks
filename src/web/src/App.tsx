import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, styled, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { Api } from '@/api/Api';

import { SessionContext } from "@/contexts";
import { routes } from "@/pages";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/layout/CookieConsent";

const StyledAppContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: -10px;
`;

const StyledAppContent = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  
  const location = useLocation();
  
  React.useEffect(() => {
    const api = new Api({
      baseUrl: process.env.API_ENDPOINT,
    }).v1;
    api.recordMetric({
      type: 'nav',
      data: { 
        path: location, 
        geolocation: navigator.geolocation
      },
      userAgent: navigator.userAgent,
    });
  }, [location]);
  
  const { theme } = React.useContext(SessionContext);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledAppContainer>
        <Header />
        <StyledAppContent>
          <Routes>
            {routes.map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              );
            })}
          </Routes>
        </StyledAppContent>
        <Footer />
        <CookieConsent />
      </StyledAppContainer>
    </ThemeProvider>
  );
}

export default App;
