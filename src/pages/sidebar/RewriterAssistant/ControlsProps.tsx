import { Select } from "./Select";


interface ControlsProps {
    onToneChange: (value: string) => void;
    onLengthChange: (value: string) => void;
    onTypeChange: (value: string) => void;
}

export function Controls ({ onToneChange, onLengthChange, onTypeChange }: ControlsProps) {
    const toneOptions = [
        { value: 'casual', label: 'Casual' },
        { value: 'neutral', label: 'Neutral' },
        { value: 'formal', label: 'Formal' },
        { value: 'friendly', label: 'Friendly' },
    ];

    const lengthOptions = [
        { value: 'short', label: 'Short' },
        { value: 'medium', label: 'Medium' },
        { value: 'long', label: 'Long' },
    ];

    const typeOptions = [
        { value: 'paragraph', label: 'Paragraph' },
        { value: 'bullet', label: 'Bullet Points' },
        { value: 'heading', label: 'Heading' },
    ];

    return (
        <div className="flex flex-row w-full justify-center items-center gap-3">
            <Select
                options={ toneOptions }
                value="neutral"
                onChange={ onToneChange }
                placeholder="Tone" />
            <Select
                options={ lengthOptions }
                value="medium"
                onChange={ onLengthChange }
                placeholder="Length" />
            <Select
                options={ typeOptions }
                value="paragraph"
                onChange={ onTypeChange }
                placeholder="Type" />
        </div>
    );
}
