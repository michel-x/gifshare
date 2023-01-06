import React, { useCallback } from "react";
import { styled } from "@mui/material/styles";
import { default as DrawerMui } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "./Button";


const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "420px",
  height: "100vh",
  overflow: "auto",
}));

const Header = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  display: "flex",
  padding: "0px 24px",
  alignItems: "center",
  height: "52px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: "white",
  zIndex: 1,
}));

const Footer = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  padding: "0px 24px",
  justifyContent: "space-between",
  alignItems: "center",
  height: "72px",
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: "white",
  zIndex: 1,
}));

type Props = {
  children: React.ReactNode;
  open: boolean;
  close: (e?: any) => any;
  title: string;
  onDelete?: (e: any) => any;
  onSave: (e: any) => any;
  disabledSave?: boolean;
  loadingSave?: boolean;
  disabledCancel?: boolean;
  disabledDelete?: boolean;
  loadingDelete?: boolean;
};

const Drawer: React.FC<Props> = (props) => {
  const handleClose = useCallback((event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    props.close();
  }, [props.close]);

  return (
    <DrawerMui
      anchor="right"
      open={props.open}
      onClose={handleClose}
      keepMounted={false}
    >
      <Root>
        <Header>
          <Typography
            variant="h6"
            sx={{ fontSize: "18px", fontWeight: 600 }}
          >
            {props.title}
          </Typography>
        </Header>
        <Box
          display="flex"
          flexDirection="column"
          px={3}
          py={13}
        >
          {props.children}
        </Box>
        <Footer>
          {props.onDelete ? 
            <Button
              variant="text"
              color="error"
              onClick={props.onDelete}
              disabled={props.disabledDelete}
              loading={props.loadingDelete}
            >
              DELETE
            </Button>
            :
            <span></span>
          }

          <Box>
            <Button
              onClick={props.close}
              variant="text"
              color="primary"
              disabled={props.disabledCancel}
              sx={{ mr: 2 }}
            >
              CANCEL
            </Button>
            <Button
              //@ts-ignore
              onClick={props.onSave}
              disabled={props.disabledSave}
              loading={props.loadingSave}
            >
              SAVE
            </Button>
          </Box>
          
        </Footer>
      </Root>
    </DrawerMui>
  );

};

export default Drawer;