import React from 'react';
import { Image, Modal } from 'antd';
import { createPortal } from 'react-dom';
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
        className: 'flex justify-center items-center ',
        onVisibleChange: () => {
          onClose?.();
        },
      }}
    />
  );
};

export default Preview;
