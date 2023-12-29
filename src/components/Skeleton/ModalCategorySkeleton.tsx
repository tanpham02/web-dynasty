import { Skeleton } from '@nextui-org/react';

import Box from '../Box';

const ModalCategorySkeleton = () => {
  return (
    <Box className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton className="rounded-lg" key={index}>
          <div className="h-10 rounded-lg bg-default-300"></div>
        </Skeleton>
      ))}
    </Box>
  );
};

export default ModalCategorySkeleton;
