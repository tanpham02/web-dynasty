import {
  ChangeEvent,
  DragEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form'
import SVG from 'react-inlinesvg'
import toast from 'react-hot-toast'

import PreviewSvg from '~/assets/svg/magnifying-glass.svg'
import TrashBinSvg from '~/assets/svg/delete.svg'
import WarningSvg from '~/assets/svg/warning-filled.svg'
import UploadSvg from '~/assets/svg/upload.svg'
import DownloadFileSvg from '~/assets/svg/download-file.svg'
import FileSvg from '~/assets/svg/file.svg'
import ExcelSvg from '~/assets/svg/excel.svg'
import ImagePreview from '~/components/ImagePreview'
import Progress from '~/components/Progress'
import FormContextField from '../FormContextField'
import { getFullImageUrl } from '~/utils/image'

interface FormContextUploadProps {
  label?: string
  name: string
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined
  acceptType?: string[]
  isCircle?: boolean
  className?: string
  resizeMode?: 'object-contain' | 'object-cover' | 'object-fill'
  showPreview?: boolean
}

enum FileType {
  EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  WORD = 'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XML = 'application/xml',
  ZIP = 'application/zip',
  TEXT_PLAIN = 'text/plain',
  CSV = 'text/csv',
  PDF = 'application/pdf',
  HTML = 'text/html',
  IMAGE = 'image/jpeg, 	image/png, 	image/gif',
}

const FormContextUpload = ({
  label,
  name,
  rules,
  isCircle,
  className,
  resizeMode,
  showPreview = true,
  acceptType = ['image/*'],
}: FormContextUploadProps) => {
  const uploadId = useId()

  const timer = useRef<any>(null)
  const prevProgress = useRef<number>(0)
  const fileUploadRef = useRef<HTMLInputElement>(null)

  const [currentProgress, setCurrentProgress] = useState<number>(0)
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false)
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false)

  const { control, setValue, watch } = useFormContext()

  const currentFile = watch(name)

  useEffect(() => {
    window.addEventListener('dragenter', handleDragFile)
    window.addEventListener('dragleave', handleDragFile)
    window.addEventListener('dragover', handleDragFile)
    window.addEventListener('drop', handleDropOnWindow)
    window.addEventListener('blur', handleDropOnWindow)

    return () => {
      window.removeEventListener('dragleave', handleDragFile)
      window.removeEventListener('dragenter', handleDragFile)
      window.removeEventListener('dragover', handleDragFile)
      window.addEventListener('drop', handleDropOnWindow)
      window.addEventListener('blur', handleDropOnWindow)
    }
  }, [])

  const handleDropOnWindow = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingFile(false)
  }

  const fileUrl = useMemo(() => {
    try {
      return typeof currentFile === 'string'
        ? getFullImageUrl(currentFile)
        : currentFile instanceof Blob
          ? URL.createObjectURL(currentFile)
          : undefined
    } catch (err) {
      return undefined
    }
  }, [currentFile])

  const uploadFile = (file?: Blob) => {
    if (currentFile) {
      setValue(name, null)
    }

    timer.current = setInterval(() => {
      if (prevProgress.current < 100) {
        prevProgress.current += Math.ceil(
          Math.random() * 5 + currentProgress + 1,
        )
        setCurrentProgress(prevProgress.current)
        return
      }

      if (file && fileUploadRef.current) {
        setValue(name, file)
        fileUploadRef.current.value = ''
        setCurrentProgress(0)
        prevProgress.current = 0
        clearInterval(timer.current)
      }
    }, 15)
  }

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    uploadFile(e.target.files?.[0])
  }

  const handleClearFile = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setValue(name, null)
  }

  const handlePreviewFile = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsOpenPreview(true)
  }

  const handleDragFile = (e: any) => {
    console.log('dragenter')

    e.preventDefault()
    e.stopPropagation()

    if (
      (e.type === 'dragenter' || e.type === 'dragover') &&
      (e.clientX && e.clientY && e.screenX && e.screenY) > 0
    ) {
      setIsDraggingFile(true)
    }
  }

  const handleDropFile = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingFile(false)

    const targetFile = e.dataTransfer.files?.[0]

    if (acceptType.includes(targetFile?.type)) {
      uploadFile(e.dataTransfer.files?.[0])
    } else {
      toast.custom(
        <div className="flex flex-row py-2 px-5 bg-white border border-zinc-100 rounded-lg transition-all shadow-lg shadow-zinc-200">
          <SVG src={WarningSvg} className="text-warning w-5 h-5 mr-2" />
          <span className="text-sm">Định dạng file không được hỗ trợ!</span>
        </div>,
      )
    }
  }

  const handlePreventDragImage = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const getFileIcon = useCallback(() => {
    if (currentFile instanceof Blob) {
      const fileType = currentFile?.type

      switch (true) {
        case FileType.EXCEL.includes(fileType):
          return ExcelSvg

        default:
          return FileSvg
      }
    }

    return FileSvg
  }, [currentFile])

  return (
    <div>
      <FormContextField
        label={label}
        render={() => (
          <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ fieldState: { error } }) => (
              <div>
                <div
                  className={`w-full relative ${
                    isCircle ? 'pt-[100%]' : 'pt-[56.65%]'
                  } ${className}`}
                >
                  <label
                    htmlFor={uploadId}
                    className="absolute top-0 left-0 right-0 bottom-0"
                  >
                    <div
                      className={`border-2 border-dashed text-zinc-300 border-zinc-300 flex flex-col items-center justify-center cursor-pointer hover:text-zinc-400 hover:border-zinc-400 transition-all select-none relative w-full h-full form-upload-container overflow-hidden p-1 ${
                        error?.message && '!border-danger hover:border-danger'
                      } ${isCircle ? 'rounded-full' : 'rounded-lg'}`}
                      onDragEnter={handleDragFile}
                      onDragLeave={handleDragFile}
                      onDragOver={handleDragFile}
                      onDrop={handleDropFile}
                    >
                      {fileUrl && !isDraggingFile && showPreview ? (
                        <>
                          <img
                            onDragStart={handlePreventDragImage}
                            alt="Upload Image"
                            className={`w-full h-full hover:scale-110 transition-all duration-500 ${
                              isCircle && 'rounded-full'
                            } ${
                              resizeMode || isCircle
                                ? 'object-cover'
                                : 'object-contain'
                            }`}
                            src={fileUrl}
                          />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-2 form-upload-action hidden">
                            <div
                              className="w-7 h-7 p-1 rounded bg-white hover:bg-primary hover:text-white hover:scale-150 transition-all"
                              onClick={handlePreviewFile}
                            >
                              <SVG
                                src={PreviewSvg}
                                className="w-full h-full text-current"
                              />
                            </div>
                            <div
                              className="w-7 h-7 p-1 rounded bg-white hover:bg-danger hover:text-white hover:scale-150 transition-all"
                              onClick={handleClearFile}
                            >
                              <SVG
                                src={TrashBinSvg}
                                className="w-full h-full"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center w-full py-2">
                          <div className="w-[15%] aspect-square">
                            <SVG
                              src={UploadSvg}
                              className="w-full h-full text-current"
                            />
                          </div>
                          <p className="text-current text-[10px] md:text-xs lg:text-sm">
                            Kéo và thả file vào đây
                          </p>
                          <div className="w-2/5 mx-auto my-[4%] h-[1px] bg-current relative">
                            <span className="text-[10px] md:text-xs absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                              hoặc
                            </span>
                          </div>

                          {currentProgress ? (
                            <Progress
                              percent={currentProgress}
                              className="px-[10%]"
                            />
                          ) : (
                            <div className="bg-zinc-200 text-zinc-700 font-bold p-[1%] text-sm rounded hover:bg-primary hover:text-white transition-all w-full max-w-[96px] text-center text-[10px] md:text-xs lg:text-sm">
                              CHỌN FILE
                            </div>
                          )}
                        </div>
                      )}
                      {isDraggingFile && (
                        <div className="absolute top-0.5 left-0.5 right-0.5 bottom-0.5 bg-white flex items-center justify-center flex-col">
                          <div className="w-[15%] aspect-square">
                            <SVG
                              src={DownloadFileSvg}
                              className="text-zinc-400 w-full h-full animate-bounce"
                            />
                          </div>
                          <p className="text-lg text-zinc-400 font-medium">
                            Thả file vào đây
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    id={uploadId}
                    type="file"
                    ref={fileUploadRef}
                    className="hidden"
                    onChange={handleUploadFile}
                    accept={acceptType?.join(', ')}
                  />
                </div>
                <span className="text-danger text-xs">{error?.message}</span>
                {!showPreview && currentFile && (
                  <div className="border border-zinc-200 border-dashed mt-2 p-1 flex items-center rounded">
                    <SVG src={getFileIcon()} className="w-7 h-7" />
                    <p className="flex-1 mx-2 font-medium line-clamp-1">
                      {currentFile instanceof Blob
                        ? (currentFile as any)?.name
                        : typeof currentFile === 'string'
                          ? currentFile
                          : 'Unknown'}
                    </p>
                    <div
                      onClick={handleClearFile}
                      className="w-7 h-7 p-1.5 rounded hover:bg-danger hover:text-white hover:scale-105 transition-all cursor-pointer"
                    >
                      <SVG src={TrashBinSvg} className="w-full h-full" />
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        )}
      />
      {fileUrl ? (
        <ImagePreview
          visible={isOpenPreview}
          onClose={() => setIsOpenPreview(false)}
          src={fileUrl}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default FormContextUpload
