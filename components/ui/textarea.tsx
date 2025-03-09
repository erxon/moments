"use client";

interface TextAreaProps {
  className: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  name?: string;
}

const Textarea: React.FC<TextAreaProps> = ({
  className,
  value,
  onChange,
  placeholder,
  rows,
  disabled,
  name,
}) => {
  return (
    <textarea
      name={name}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
    ></textarea>
  );
};

export default Textarea;
