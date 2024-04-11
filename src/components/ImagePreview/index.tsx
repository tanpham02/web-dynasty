/* eslint-disable prettier/prettier */
import { Image } from 'antd';
import React from 'react';

interface ImagePreviewProps {
  visible?: boolean;
  onClose?: () => void;
  src?: string;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  visible = false,
  onClose,
  src,
  className,
}) => {
  return (
    <Image
      preview={{
        visible: visible,
        src: src,
        className: `flex justify-center items-center ${className}`,
        onVisibleChange: () => {
          onClose?.();
        },
      }}
    />
  );
};

export default ImagePreview;
