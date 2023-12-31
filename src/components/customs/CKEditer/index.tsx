import ReactQuill from 'react-quill';

interface CKEditorProps {
  value?: string;
  onChange: (content: string) => void;
}

const CKEditor: React.FC<CKEditorProps> = ({ value, onChange }) => {
  const handleChange = (content: string) => {
    onChange(content);
  };

  return (
    <ReactQuill
      value={value}
      onChange={handleChange}
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
  );
};

export default CKEditor;
