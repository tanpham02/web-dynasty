import React from 'react'
import Svg from 'react-inlinesvg'
import Box from '~/components/Box'

interface ReportBoxProps {
  label: string
  icon: string
  value: React.ReactNode
}

const ReportBox = ({ label, icon: Icon, value }: ReportBoxProps) => {
  return (
    <Box className="bg-white p-4 flex items-center gap-4 rounded-lg">
      <Svg src={Icon} className="w-16 h-16" />
      <Box className="flex flex-col flex-1">
        <span className="font-black text-[30px]">{value}</span>
        <span className="font-medium text-lg">{label}</span>
      </Box>
    </Box>
  )
}

export default ReportBox
