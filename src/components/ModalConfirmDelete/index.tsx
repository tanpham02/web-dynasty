import SVG from 'react-inlinesvg';
import { Button } from '@nextui-org/react';

import CustomModal from '../NextUI/CustomModal';
import WarningIcon from '~/assets/svg/warning.svg';

export interface ModalConfirmDeleteState {
  desc?: string;
  id?: string;
  isLoading?: boolean;
}

export interface ModalConfirmDeleteProps {
  isOpen?: boolean;
  onOpenChange?(): void;
  desc?: string;
  onAgree?(): void;
  isLoading?: boolean;
}

const ModalConfirmDelete = ({
  isOpen,
  onOpenChange,
  desc,
  isLoading,
  onAgree,
}: ModalConfirmDeleteProps) => {
  return (
    <div>
      <CustomModal isOpen={isOpen} controls={false} onOpenChange={onOpenChange}>
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center w-26 h-26 bg-orange-100 rounded-full">
            <div className="flex items-center justify-center w-18 h-18 bg-orange-400 rounded-full">
              <SVG src={WarningIcon} className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="font-bold text-title-lg my-4">Dynasty Dashboard</p>
          <p className="text-base text-center px-4">{desc}</p>
          <div className="grid grid-cols-2 gap-4 w-full mt-4 mb-8 px-8">
            <Button className="w-full" color="default" variant="shadow" onClick={onOpenChange}>
              Hủy
            </Button>
            <Button
              isLoading={isLoading}
              className="w-full"
              color="danger"
              variant="shadow"
              onClick={onAgree}
            >
              Đồng ý
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default ModalConfirmDelete;
