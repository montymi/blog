import Typography from '@mui/material/Typography';

import { messages } from '@/config';

function LoaderErrorBoundaryFallback() {
  return (
    <div>
      <Typography variant="h5">{messages.loader.fail}</Typography>
    </div>
  );
}

export default LoaderErrorBoundaryFallback;
