import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import useNotifications from '@/store/notifications';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

function Activity() {
  const [, notificationsActions] = useNotifications();

  useEffect(() => {
    notificationsActions.push({
      options: { variant: 'customNotification' },
      message: 'The Activity page is still being developed',
    });
  }, [notificationsActions]);

  return (
    <>
      <Meta title="activity" />
      <FullSizeCenteredFlexBox>
        <Typography variant="h3">Activity</Typography>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Activity;
