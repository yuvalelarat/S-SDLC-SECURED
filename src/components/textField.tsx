interface TextFieldProps {
  containerStyle?: string;
  textFieldStyle?: string;
  inputStyle?: string;
  placeholder: string;
}

export function TextField(props: TextFieldProps) {
  const { containerStyle, textFieldStyle, inputStyle, placeholder } = props;
  return (
    <div className={`p-1 ${containerStyle}`}>
      <div className={`border border-black rounded-full ${textFieldStyle}`}>
        <input
          type="text"
          className={`w-52 h-8 p-2 text-black focus:ring-2 focus:ring-transparent outline-none ${inputStyle}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
