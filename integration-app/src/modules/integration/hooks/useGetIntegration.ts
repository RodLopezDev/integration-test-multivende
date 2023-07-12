import { useEffect, useState } from "react";
import IntegrationRepository from "../infraestructure/IntegrationRepository";
import Integration from "../domain/entity/Integration";

const useGetIntegration = () => {
  const [state, setstate] = useState<{
    integration: Integration | null;
    isFetching: boolean;
    error: boolean;
  }>({
    integration: null,
    isFetching: true,
    error: false,
  });
  const repository = new IntegrationRepository();

  const handleReload = (reload = false) => {
    if (reload) {
      setstate({
        integration: null,
        isFetching: true,
        error: false,
      });
    }
    repository
      .getIntegration()
      .then((result) => {
        setstate({
          integration: result,
          isFetching: false,
          error: false,
        });
      })
      .catch((error: Error) => {
        if (error?.message === "DATA_NOT_FOUND") {
          setstate({
            integration: null,
            isFetching: false,
            error: false,
          });
          return;
        }
        setstate({
          integration: null,
          isFetching: false,
          error: true,
        });
      });
  };

  useEffect(() => {
    handleReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, reload: () => handleReload(true) };
};

export default useGetIntegration;
