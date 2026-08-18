import React, { useRef, useState } from 'react';
import { Editor } from 'reactjs-tiptap-editor';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { apiService } from '../../../../services/apiService';

type ActionImageButtonProps = {
    action: () => true;
    upload: (file: File) => Promise<string>;
    disabled: boolean;
    editor: Editor;
};

function ActionImageButton(props: ActionImageButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && props.editor) {
            setIsUploading(true);
            try {
                const url = await apiService.uploadImage(file);
                if (url) {
                    props.editor
                        .chain()
                        .focus()
                        .setImageInline({ src: url, inline: false, alt: file.name })
                        .run();
                }
            } catch (err) {
                console.error('Image button upload error:', err);
            } finally {
                setIsUploading(false);
            }
        }
        if (e.target) e.target.value = '';
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded text-gray-700 cursor-pointer disabled:opacity-50"
                title="Tải ảnh lên server"
                onClick={() => fileInputRef.current?.click()}
                disabled={props.disabled || isUploading}
            >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-[#8C2320]" /> : <ImageIcon className="w-4 h-4" />}
            </button>
        </>
    );
}

export default ActionImageButton;
