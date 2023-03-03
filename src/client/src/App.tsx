import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ThemeProvider, styled, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

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
