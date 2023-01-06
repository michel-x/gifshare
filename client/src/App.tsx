import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import theme from "./utils/theme";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Public from "./components/Public";
import Layout from "./pages/Layout";
import RequireAuth from "./components/RequireAuth";
import Spinner from "./components/Spinner";
import "./index.css";
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <SnackbarProvider>
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Public>
                        <Login />
                      </Public>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <Public>
                        <Login />
                      </Public>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <Public>
                        <Register />
                      </Public>
                    }
                  />
                  <Route
                    element={
                      <RequireAuth>
                        <Layout />
                      </RequireAuth>
                    }
                  >
                    <Route
                      path="/dashboard"
                      element={<Dashboard />}
                    />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </SnackbarProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
      {import.meta.env.DEV &&
        <ReactQueryDevtools initialIsOpen={false} />
      }
    </QueryClientProvider>
  );
};

export default App;
