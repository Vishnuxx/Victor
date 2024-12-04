

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function Select ({ options, value, onChange, placeholder }: SelectProps) {
    return (
        <div className="relative">
            {/* <div className="absolute inset-0 rounded-[50px] border-2 bg-gradient-to-r from-blue-500 to-green-500 pointer-events-none" /> */}
            <select
                value={ value }
                onChange={ (e) => onChange(e.target.value) }
                className="w-[80px] bg-[#424242] rounded-[50px] "
            >
                <option value="" disabled>
                    { placeholder }
                </option>
                { options.map((option) => (
                    <option key={ option.value } value={ option.value }>
                        { option.label }
                    </option>
                )) }
            </select>
            
        </div>
    );
}