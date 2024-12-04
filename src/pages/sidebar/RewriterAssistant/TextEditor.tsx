import { useState } from 'react';
import { PenLine } from 'lucide-react';
import { Controls } from './ControlsProps';
import { TextArea } from './TextArea';

export function TextEditor () {
    const [text, setText] = useState('');

    const handleToneChange = (value: string) => {
        console.log('Tone changed:', value);
    };

    const handleLengthChange = (value: string) => {
        console.log('Length changed:', value);
    };

    const handleTypeChange = (value: string) => {
        console.log('Type changed:', value);
    };

    return (
        <div className="w-full h-full bg-[#292124] flex flex-col">
            <div className="p-6 space-y-1">
                <h2 className="text-lg font-medium flex items-center gap-2">
                    <PenLine className="w-3 h-3" />
                    Writer
                </h2>
                
            </div>
            <div className='h-full border-[1px] border-gray-400 rounded-md '>
                <pre contentEditable className='h-full w-full'></pre>
            </div>
            <div className="p-6 pt-0 space-y-4 h-full">
                <TextArea
                    value={ text }
                    onChange={ setText }
                />
                
            </div>
            <Controls
                onToneChange={ handleToneChange }
                onLengthChange={ handleLengthChange }
                onTypeChange={ handleTypeChange }
            />
            <div className="mt-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-[2px]">
                <div className="bg-[#373841] rounded-full">
                    <input
                        type="text"
                        placeholder=""
                        className="w-full px-4 py-2 text-sm text-gray-300 bg-transparent rounded-full focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}




