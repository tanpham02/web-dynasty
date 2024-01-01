import { ImageProps } from '@nextui-org/react';
import SVG from 'react-inlinesvg';

import UploadIcon from '~/assets/svg/upload.svg';
import CustomImage from '../NextUI/CustomImage';

export interface onChangeUploadState {
  srcPreview?: any;
  srcRequest?: any;
}
interface UploadProps extends ImageProps {
  onChange?: (props: onChangeUploadState | any) => void;
  className?: string;
  isPreview?: boolean;
}

const Upload: React.FC<UploadProps> = (props) => {
  const { isPreview = false, src } = props;
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
        className={`relative pt-[35vw] xl:pt-[100%] mx-auto w-[35vw] xl:w-[25vw] h-[35vw] lg:h-[25vw]  cursor-pointer appearance-none border-2 border-dashed border-primary bg-gray rounded-${props.radius}`}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
          onChange={handleChangeFileUpload}
        />

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
          <CustomImage isPreview={isPreview} src={src} {...props} />
        )}
      </div>
    </>
  );
};

export default Upload;
