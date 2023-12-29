import { Controller, useFormContext } from 'react-hook-form';
import ReactQuill from 'react-quill';
import Box from '~/components/Box';

interface FormContextCKEditorProps {
  name: string;
}

const FormContextCKEditor = ({ name }: FormContextCKEditorProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box className="space-y-2">
          <ReactQuill
            {...field}
            className="form-context"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'video'],
                ['clean'],
              ],
            }}
          />
          <span className="text-danger text-xs">{error?.message}</span>
        </Box>
      )}
    />
  );
};

export default FormContextCKEditor;
