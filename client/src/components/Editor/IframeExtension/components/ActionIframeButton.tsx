import React, { useState } from 'react';
import { Editor } from 'reactjs-tiptap-editor';
import { Modal, Input } from 'antd';
import { Video as YoutubeIcon } from 'lucide-react';

type ActionIframeButtonProps = {
    editor: Editor;
};

function ActionIframeButton({ editor }: ActionIframeButtonProps) {
    const [isShowModal, setIsShowModal] = useState(false);
    const [url, setUrl] = useState('');

    const handleConfirm = () => {
        if (url) {
            let embedUrl = url;
            if (url.includes('youtube.com/watch?v=')) {
                embedUrl = url.replace('watch?v=', 'embed/');
            } else if (url.includes('youtu.be/')) {
                embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
            }

            (editor.chain().focus() as any).setIframeContent({ src: embedUrl }).run();
            setUrl('');
            setIsShowModal(false);
        }
    };

    return (
        <>
            <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                title="Chèn Iframe/Video YouTube"
                onClick={() => setIsShowModal(true)}
            >
                <YoutubeIcon className="w-4 h-4 text-red-600" />
            </button>

            <Modal
                title="Chèn Iframe / Video YouTube"
                open={isShowModal}
                onCancel={() => setIsShowModal(false)}
                onOk={handleConfirm}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <div className="py-2 space-y-2">
                    <label className="text-xs font-semibold text-gray-600">Đường dẫn Iframe/Video (YouTube, Maps, ...)</label>
                    <Input
                        placeholder="Nhập URL (Ví dụ: https://www.youtube.com/watch?v=...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
            </Modal>
        </>
    );
}

export default ActionIframeButton;
