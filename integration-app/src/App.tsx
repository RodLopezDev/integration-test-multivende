import { Box, CircularProgress } from "@mui/material";

import useGetIntegration from "./modules/integration/hooks/useGetIntegration";

import NewIntegrationForm from "./components/NewIntegrationForm";
import IntegrationView from "./components/IntegrationView";

function App() {
  const { isFetching, error, integration, reload } = useGetIntegration();
  if (isFetching) {
    return (
      <Box>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  if (error) {
    return <div>Error getting data, check deployment</div>;
  }
  if (!integration) {
    return <NewIntegrationForm reload={reload} />;
  }
  return <IntegrationView reload={reload} integration={integration} />;
}

export default App;
