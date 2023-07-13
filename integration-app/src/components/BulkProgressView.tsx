/* eslint-disable @typescript-eslint/no-floating-promises */
import { FC, useEffect, useState } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

import Bulk from "../modules/bulk/domain/entity/Bulk";
import BulkRepository from "../modules/bulk/infraestructure/BulkRepository";
import { delay } from "../helpers/delay";

interface Props {
  bulk: Bulk;
}

function getPercentage(bulk: Bulk) {
  return (bulk.current * 100) / bulk.total;
}

const BulkProgressView: FC<Props> = ({ bulk }) => {
  const [storeBulk, setStoredBulk] = useState(bulk);

  const load = async () => {
    const repository = new BulkRepository();
    const bulkReload = await repository.getBulkById(bulk.id);
    setStoredBulk(bulkReload);

    await delay(1000);
    load();
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const percentage = getPercentage(storeBulk);

  return (
    <Box>
      <Typography>
        {storeBulk.current}/{storeBulk.total}
      </Typography>
      <LinearProgress variant="determinate" value={percentage} />
    </Box>
  );
};

export default BulkProgressView;
