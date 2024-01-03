import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@nextui-org/react';
import React from 'react';
import { createPortal } from 'react-dom';

interface CustomModalProps extends ModalProps {
  isOpen?: boolean;
  onOpenChange?(): void;
  title?: string;
  children: React.ReactNode;
  cancelButtonText?: string;
  okButtonText?: string;
  onOk?(): void;
  controls?: boolean;
  isLoading?: boolean;
}

const CustomModal = (props: CustomModalProps) => {
  const {
    isOpen,
    onOpenChange,
    title,
    children,
    cancelButtonText,
    okButtonText,
    onOk,
    isLoading,
    controls = true,
  } = props!;

  return createPortal(
    <div className="z-[99999999]">
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        }}
        motionProps={{
          variants: {
            enter: {
              scale: 1,
              opacity: 1,
              transition: {
                duration: 0.2,
                ease: 'easeOut',
              },
            },
            exit: {
              scale: 0,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn',
              },
            },
          },
        }}
        backdrop="opaque"
        {...props}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>{children}</ModalBody>
              {controls && (
                <ModalFooter>
                  <Button variant="shadow" onPress={onClose}>
                    {cancelButtonText || 'Đóng'}
                  </Button>
                  <Button color="primary" variant="shadow" onPress={onOk} isLoading={isLoading}>
                    {okButtonText || 'OK'}
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>,
    document.body,
  );
};

export default CustomModal;
