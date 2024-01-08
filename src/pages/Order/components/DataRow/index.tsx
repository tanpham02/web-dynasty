import React from 'react';
import Box from '~/components/Box';

interface DataRowProps {
  label?: string;
  value?: React.ReactNode;
  className?: string;
}
const DataRow = ({ label, value, className }: DataRowProps) => {
  return (
    <Box className={`text-sm grid ${className || 'grid-cols-[3fr_7fr]'}`}>
      <span className="font-bold">{label}:</span> {value}
    </Box>
  );
};

export default DataRow;
