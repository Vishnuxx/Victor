interface TextAreaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function TextArea ({ value, onChange, placeholder = 'Enter your text here...' }: TextAreaProps) {
    return (
        <textarea
            value={ value }
            onChange={ (e) => onChange(e.target.value) }
            placeholder={ placeholder }
            className="w-full h-full resize-none  border  backdrop-blur-sm p-4 outline-none transition-all focus:border-blue-400/20 focus:ring-1 focus:ring-blue-400/20" />
    );
}
