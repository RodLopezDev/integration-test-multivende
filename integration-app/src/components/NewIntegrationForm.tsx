/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import IntegrationRepository from "../modules/integration/infraestructure/IntegrationRepository";
import { FC, useState } from "react";

type FormType = {
  name: string;
  clientId: string;
  clientSecret: string;
};

interface Props {
  reload: () => void;
}

const NewIntegrationForm: FC<Props> = ({ reload }) => {
  const [disabled, setDisabled] = useState(false);
  const repository = new IntegrationRepository();
  const form = useForm<FormType>({
    defaultValues: { clientId: "", clientSecret: "", name: "" },
  });

  const onSubmit: SubmitHandler<FormType> = async ({
    name,
    clientId,
    clientSecret,
  }: FormType) => {
    setDisabled(true);
    try {
      const result = await repository.save(name, clientId, clientSecret);
      if (result) {
        reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Box>
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12} textAlign="center">
                    <Typography variant="h5">New integration</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      control={form.control}
                      name="name"
                      rules={{ required: "Field is required" }}
                      render={({ field, fieldState }) => (
                        <TextField
                          disabled={disabled}
                          {...field}
                          fullWidth
                          label="Integration name"
                          InputProps={{ autoComplete: "off" }}
                          error={!!fieldState.error}
                          helperText={fieldState?.error?.message || ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      control={form.control}
                      name="clientId"
                      rules={{ required: "Field is required" }}
                      render={({ field, fieldState }) => (
                        <TextField
                          disabled={disabled}
                          {...field}
                          fullWidth
                          label="Client Id"
                          InputProps={{ autoComplete: "off" }}
                          error={!!fieldState.error}
                          helperText={fieldState?.error?.message || ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      control={form.control}
                      name="clientSecret"
                      rules={{ required: "Field is required" }}
                      render={({ field, fieldState }) => (
                        <TextField
                          disabled={disabled}
                          {...field}
                          fullWidth
                          label="Client Integration"
                          InputProps={{ autoComplete: "off" }}
                          error={!!fieldState.error}
                          helperText={fieldState?.error?.message || ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} textAlign="center">
                    <Button variant="contained" size="large" type="submit">
                      Registrar
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default NewIntegrationForm;
