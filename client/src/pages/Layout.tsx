import React, { useCallback, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import { auth } from "../services/firebase";
import Spinner from "../components/Spinner";

import Navbar from "../components/Navbar";

const Layout: React.FC = () => {
  const handleClickSignout = useCallback(() => {
    auth.signOut();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 pt-10">
      <Navbar onSignOut={handleClickSignout} />
      <Suspense 
        fallback={
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh"}}>
            <Spinner />
          </Box>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Layout;
