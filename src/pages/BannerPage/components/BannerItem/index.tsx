import SVG from 'react-inlinesvg';

import ButtonIcon from '~/components/ButtonIcon';
import EditSvg from '~/assets/svg/edit.svg';
import DeleteSvg from '~/assets/svg/delete.svg';
import DragVerticalSvg from '~/assets/svg/drag-vertical.svg';
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils';
import { BannerItemProps } from './type';
import { getFullImageUrl } from '~/utils/image';

const BannerItem = ({
  name,
  createdAt,
  url,
  onUpdate,
  onDelete,
  isDragging,
}: BannerItemProps) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg relative flex items-center mb-4 transition-all ${
        isDragging && ''
      }`}
    >
      {url && (
        <img
          src={getFullImageUrl(url)}
          loading="lazy"
          className={` aspect-video object-cover transition-all rounded-lg ${
            isDragging ? 'w-[5%]' : 'w-1/6'
          }`}
        />
      )}
      <div className="flex-1 mx-4 flex flex-col">
        <span className="text-zinc-700 text-base line-clamp-1 font-bold">
          {name}
        </span>
        {createdAt && (
          <span className="text-zinc-500 text-[13px] line-clamp-1 font-medium">
            {formatDate(createdAt, DATE_FORMAT_DDMMYYYY)}
          </span>
        )}
      </div>
      <div className="space-x-2 mr-4">
        <ButtonIcon
          icon={EditSvg}
          title="Chỉnh sửa"
          color="primary"
          onClick={onUpdate}
        />
        <ButtonIcon
          onClick={onDelete}
          icon={DeleteSvg}
          title="Xóa banner quảng cáo này"
          color="danger"
        />
      </div>
      <SVG src={DragVerticalSvg} className="w-8 h-8 text-zinc-400" />
    </div>
  );
};

export default BannerItem;
