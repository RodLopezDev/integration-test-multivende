import { Box } from "@mui/material";
import { FC, PropsWithChildren } from "react";

const MainContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      width="100%"
      height="100vh"
      sx={(theme) => ({
        display: "grid",
        placeItems: "center center",
        backgroundColor: theme.palette.grey[100],
      })}
    >
      {children}
    </Box>
  );
};

export default MainContainer;
