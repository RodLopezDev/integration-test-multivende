interface Bulk {
  id: string;
  state: string;
  warehouseId: string;
  current: number;
  total: number;
  hasError: boolean;
  errorType: string;
  retries: number;
  updatedAt: string;
}

export default Bulk;
