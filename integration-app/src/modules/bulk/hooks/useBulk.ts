import { useEffect, useState } from "react";
import BulkRepository from "../infraestructure/BulkRepository";
import Bulk from "../domain/entity/Bulk";

type State = {
  bulk: Bulk | null;
  isFetching: boolean;
  error: boolean;
};

const useBulk = (): State & { load: () => void } => {
  const [state, setstate] = useState<State>({
    bulk: null,
    isFetching: false,
    error: false,
  });
  const repository = new BulkRepository();

  const handleReload = () => {
    setstate({
      bulk: null,
      isFetching: true,
      error: false,
    });

    repository
      .bulk()
      .then((result) => {
        setstate({
          bulk: result,
          isFetching: false,
          error: false,
        });
      })
      .catch((error: Error) => {
        if (error?.message === "DATA_NOT_FOUND") {
          setstate({
            bulk: null,
            isFetching: false,
            error: false,
          });
          return;
        }
        setstate({
          bulk: null,
          isFetching: false,
          error: true,
        });
      });
  };

  return { ...state, load: handleReload };
};

export default useBulk;
