import React, { useState } from 'react';
import { Image, ImageProps } from '@nextui-org/react';
import SVG from 'react-inlinesvg';

import UploadIcon from '~/assets/svg/upload.svg';
import ButtonIcon from '../ButtonIcon';
import EyeIcon from '~/assets/svg/eye.svg';
import Box from '../Box';
import Preview from '../Preview';

export interface onChangeProps {
  srcPreview?: any;
  srcRequest?: any;
}
interface UploadProps extends ImageProps {
  onChange?: (props: onChangeProps | any) => void;
  className?: string;
  isPreview?: boolean;
}

const Upload: React.FC<UploadProps> = (props) => {
  const [visiblePreview, setVisiblePreview] = useState<boolean>(false);

  const handleChangeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onload = function () {
      props.onChange?.({
        srcPreview: reader.result,
        srcRequest: file,
      });
    };

    reader.readAsDataURL(file as any);
  };

  // o tren radíu bao nhi3u, thì cai image rádíu bay nhieu
  return (
    <>
      <div
        id="FileUpload"
        className={`relative pt-[45%] xl:pt-[100%] mx-auto w-[45%] xl:w-full cursor-pointer appearance-none border-2 border-dashed border-primary bg-gray rounded-${props.radius}`}
      > 
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
          onChange={handleChangeFileUpload}
        />
        {props.isPreview && props.src && (
          <Box
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-99 hidden"
            id="preview-icon"
          >
            <ButtonIcon
              title="Xem trước"
              icon={EyeIcon}
              status="default"
              onClick={() => setVisiblePreview(true)}
            />
          </Box>
        )}

        {!props.src ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col space-y-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
              <SVG src={UploadIcon} className="text-[#3C50E0]" />
            </span>
            <p className="text-center">
              <span className="text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="mt-1.5 text-center">SVG, PNG, JPG or GIF</p>
            <p className="text-center">(max, 800 X 800px)</p>
          </div>
        ) : (
          <Image
            src={props.src}
            width="100%"
            height="100%"
            classNames={{
              wrapper: 'absolute top-0 left-0 w-full h-full',
              img: 'w-full h-full object-contain p-1',
            }}
            {...props}
          />
        )}
      </div>
      <Preview
        srcPreview={props.src}
        visible={visiblePreview}
        onClose={() => setVisiblePreview(false)}
      />
    </>
  );
};

export default Upload;
