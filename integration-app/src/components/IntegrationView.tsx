/* eslint-disable @typescript-eslint/no-misused-promises */
import { FC, useState } from "react";
import Integration from "../modules/integration/domain/entity/Integration";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

import InboxIcon from "@mui/icons-material/Inbox";
import Environment from "../app/config/Environment";
import IntegrationRepository from "../modules/integration/infraestructure/IntegrationRepository";

interface Props {
  reload: () => void;
  integration: Integration;
}
const IntegrationView: FC<Props> = ({ integration, reload }) => {
  const [disabled, setDisabled] = useState(false);
  const repository = new IntegrationRepository();

  const handleRemove = async () => {
    setDisabled(true);
    try {
      await repository.remove();
    } catch (e) {
      console.error(e);
    }
    reload();
  };

  const handleAuth = async () => {
    setDisabled(true);
    try {
      await repository.auth();
    } catch (e) {
      console.error(e);
    }
    reload();
  };

  return (
    <Card elevation={0}>
      <CardContent>
        <Box textAlign="center">
          <Typography variant="h5">My integration</Typography>
        </Box>
        <Box height={(theme) => theme.spacing(2)} />
        <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={`Name: ${integration.name}`} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Client Id: ${integration.clientId}`}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={`Client Secret: ******`} />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CircleIcon
                    sx={{ color: integration.clientCode ? "green" : "red" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    integration.clientCode
                      ? "Integration: Ready"
                      : "Integration: To do"
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CircleIcon
                    sx={{ color: integration.clientToken ? "green" : "red" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    integration.clientToken ? "Auth: Ready" : "Auth: To do"
                  }
                />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <Box height={(t) => t.spacing(2)} />
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <a href={`${Environment.apiUrl}/start`}>
                <Button variant="outlined" fullWidth disabled={disabled}>
                  Connect
                </Button>
              </a>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleAuth}
                disabled={
                  !integration.clientCode ||
                  !!integration.clientToken.length ||
                  disabled
                }
              >
                {integration.clientToken ? "Authorized" : "Auth"}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                onClick={handleRemove}
                fullWidth
                disabled={disabled}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IntegrationView;
