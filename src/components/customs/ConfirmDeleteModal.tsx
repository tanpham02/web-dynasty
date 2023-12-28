import { Modal } from "antd";
import React from "react";

interface ConfirmDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const handleOk = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      title="Xác nhận xóa"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Bạn có chắc chắn muốn xóa mục này?</p>
    </Modal>
  );
};

export default ConfirmDeleteModal;
