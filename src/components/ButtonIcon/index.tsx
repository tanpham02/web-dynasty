import { Tooltip, TooltipProps } from '@nextui-org/react';
import React, { useMemo } from 'react';
import SVG from 'react-inlinesvg';

interface ButtonIconProps {
  title?: string;
  icon: string;
  tooltipProps?: TooltipProps;
  onClick?: () => void;
  status?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  disable?: boolean;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  title,
  icon,
  tooltipProps,
  onClick,
  disable = false,
  status = 'default',
}) => {
  const statusesClassName: { [key: string]: string } = {
    danger: 'text-danger hover:bg-danger/20',
    warning: 'text-warning hover:bg-warning/20',
    success: 'text-success hover:bg-success/20',
    primary: 'text-primary hover:bg-primary/20',
    secondary: 'text-secondary hover:bg-secondary/20',
    default: 'text-default-500 hover:bg-default/20',
  };

  return (
    <Tooltip content={title} color={status} {...tooltipProps}>
      <div
        onClick={() => !disable && onClick?.()}
        className={`w-7 h-7 cursor-pointer rounded inline-flex justify-center items-center ${
          statusesClassName[status]
        } ${disable && '!cursor-not-allowed !hover:bg-opacity-20 !bg-opacity-20'}`}
      >
        <SVG src={icon} className="w-5 h-5 text-current" />
      </div>
    </Tooltip>
  );
};

export default ButtonIcon;
