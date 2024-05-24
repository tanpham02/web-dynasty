import { Image, ImageProps } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import Preview from '~/components/Preview';
import EyeIcon from '~/assets/svg/eye.svg';

interface CustomImageProps extends ImageProps {
  isPreview?: boolean;
  placement?:
    | 'top'
    | 'bottom'
    | 'right'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';
  fallbackSrc?: string;
}

const CustomImage: React.FC<CustomImageProps> = (props) => {
  const [isError, setIsError] = useState<boolean>(false);
  const { isPreview, src, fallbackSrc, placement = 'top' } = props;

  useEffect(() => {
    if (src) setIsError(false);
  }, [src]);

  const [visiblePreviewImage, setVisiblePreviewImage] =
    useState<boolean>(false);

  return (
    <Box className="relative mx-auto size-20" id="FileUpload">
      {isPreview && src && !isError && (
        <Box
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999999] hidden"
          id="preview-icon"
        >
          <ButtonIcon
            title="Xem trước"
            placement={placement}
            icon={EyeIcon}
            onClick={() => setVisiblePreviewImage(true)}
          />
        </Box>
      )}
      <Image
        src={src}
        {...props}
        classNames={{
          wrapper:
            'absolute top-0 left-0 !w-full !h-full aspect-square flex item-center justify-center',
          img: '!w-full object-cover !aspect-square',
          // blurredImg: '!w-full object-contain !aspect-square',
        }}
        // className="absolute top-0 left-0 w-full h-full"
        isBlurred
        isZoomed
        fallbackSrc={fallbackSrc}
        radius={props.radius}
        onError={() => setIsError(true)}
      />

      <Preview
        srcPreview={src}
        visible={visiblePreviewImage}
        onClose={() => setVisiblePreviewImage(false)}
      />
    </Box>
  );
};

export default CustomImage;
