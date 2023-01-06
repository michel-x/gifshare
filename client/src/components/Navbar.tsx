import React, { useState, useCallback } from "react";
import Logout from "@mui/icons-material/Logout";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

type Props = {
  onSignOut: () => void;
}

const Navbar: React.FC<Props> = ({ onSignOut }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleClickSignout = useCallback(() => {
    onSignOut();
    handleClose();
  }, [handleClose]);
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  return (
    <nav className="w-full bg-slate-800 flex items-center justify-between py-2 px-8 fixed top-0 left-0 right-0 z-10">
      <div>
        <h1 className="text-3xl text-white">
          <a href="#">Gifs Drive</a>
        </h1>
      </div>
      <div className="flex gap-4 text-white text-lg">
        <a 
          onClick={handleClick}
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </a>
        <Menu
          id="signout-menu"
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClickSignout} color="#2196f3">
            <Typography variant="inherit" color="error" sx={{ ml: 1, mr: 2 }}>
              <Logout 
                color="error"
                sx={{ mr: 2 }}
              />
              Log out
            </Typography>
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
