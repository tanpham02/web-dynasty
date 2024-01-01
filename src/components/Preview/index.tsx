import React from 'react';
import { Image } from 'antd';
interface PreviewProps {
  visible?: boolean;
  srcPreview?: string;
  className?: string;
  onClose?: () => void;
}

const Preview: React.FC<PreviewProps> = ({ visible, srcPreview, onClose }) => {
  return (
    <Image
      preview={{
        visible: visible,
        src: srcPreview,
        className: 'flex justify-center items-center',
        onVisibleChange: () => {
          onClose?.();
        },
      }}
    />
  );
};

export default Preview;
