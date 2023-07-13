import { Button } from "@mui/material";
import { FC } from "react";
import useBulk from "../modules/bulk/hooks/useBulk";
import BulkProgressView from "./BulkProgressView";

interface Props {
  disabled: boolean;
}

const BulkViewer: FC<Props> = ({ disabled }) => {
  const { bulk, load, isFetching } = useBulk();
  if (bulk) {
    return <BulkProgressView bulk={bulk} />;
  }
  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={load}
      fullWidth
      disabled={disabled || isFetching}
    >
      Bulk update
    </Button>
  );
};

export default BulkViewer;
