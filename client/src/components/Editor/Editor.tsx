'use client'

import {
    useCallback,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react'
import { Modal, Radio, Select, ColorPicker, Button } from 'antd'
import RichTextEditor, { Editor as TiptapEditor } from 'reactjs-tiptap-editor'
import { buildExtensions } from './Extensions'

import 'reactjs-tiptap-editor/style.css'
import 'react-image-crop/dist/ReactCrop.css'

const LocaleImport = () => import('reactjs-tiptap-editor/locale-bundle')

export interface EditorRef {
    getEditor: () => TiptapEditor | undefined
    insertHtml: (html: string) => void
}

interface EditorProps {
    value?: string
    onChange?: (value: string) => void
    /** `false`: ẩn nút/toolbar liên quan upload ảnh, video, file (import Word, đính kèm). */
    isUploadFile?: boolean
    /** Chiều cao tối thiểu ban đầu (mặc định 120px), tự mở rộng xuống khi có nhiều nội dung */
    minHeight?: number | string
}

const Editor = forwardRef<EditorRef, EditorProps>((props, ref) => {
    const { value = '', onChange, isUploadFile = true, minHeight = '120px' } = props
    const formattedMinHeight = typeof minHeight === 'number' ? `${minHeight}px` : minHeight
    const editorRef = useRef<{ editor: TiptapEditor } | null>(null)

    const extensions = useMemo(
        () => buildExtensions(isUploadFile),
        [isUploadFile],
    )

    const onValueChange = useCallback(
        (val: string) => {
            requestAnimationFrame(() => {
                onChange?.(val)
            })
        },
        [onChange],
    )

    useImperativeHandle(ref, () => ({
        getEditor: () => editorRef.current?.editor,
        insertHtml: (html: string) => {
            const editor = editorRef.current?.editor
            if (editor) {
                editor
                    .chain()
                    .focus()
                    .insertContent(html, {
                        parseOptions: {
                            preserveWhitespace: false,
                        },
                    })
                    .run()
            }
        },
    }))

    const [isBorderModalOpen, setIsBorderModalOpen] = useState(false)
    const [borderPreset, setBorderPreset] = useState<'default' | 'none' | 'custom'>('default')
    const [borderWidth, setBorderWidth] = useState('1px')
    const [borderStyle, setBorderStyle] = useState('solid')
    const [borderColor, setBorderColor] = useState('#e5e7eb')

    const openBorderModal = useCallback(() => {
        const editor = editorRef.current?.editor
        if (!editor) return

        const { selection } = editor.state
        let tableNode: any = null
        editor.state.doc.nodesBetween(selection.from, selection.to, (node) => {
            if (node.type.name === 'table') {
                tableNode = node
                return false
            }
        })

        if (tableNode) {
            const attrs = tableNode.attrs || {}
            const style = attrs.style || ''
            const className = attrs.class || ''
            const border = attrs.border

            if (className.includes('no-border') || border === '0') {
                setBorderPreset('none')
            } else if (className.includes('custom-border') || style.includes('--table-border-')) {
                setBorderPreset('custom')
                const widthMatch = style.match(/--table-border-width:\s*([^;]+)/)
                const styleMatch = style.match(/--table-border-style:\s*([^;]+)/)
                const colorMatch = style.match(/--table-border-color:\s*([^;]+)/)

                if (widthMatch) setBorderWidth(widthMatch[1].trim())
                if (styleMatch) setBorderStyle(styleMatch[1].trim())
                if (colorMatch) setBorderColor(colorMatch[1].trim())
            } else {
                setBorderPreset('default')
            }
            setIsBorderModalOpen(true)
        }
    }, [])

    const handleSaveBorders = useCallback(() => {
        const editor = editorRef.current?.editor
        if (!editor) return

        const { selection } = editor.state
        let tableNode: any = null
        editor.state.doc.nodesBetween(selection.from, selection.to, (node) => {
            if (node.type.name === 'table') {
                tableNode = node
                return false
            }
        })

        if (tableNode) {
            let styleStr = ''
            let classVal = ''
            let borderVal = '1'

            if (borderPreset === 'none') {
                classVal = 'no-border'
                borderVal = '0'
            } else if (borderPreset === 'custom') {
                styleStr = `--table-border-width: ${borderWidth}; --table-border-style: ${borderStyle}; --table-border-color: ${borderColor};`
                classVal = 'custom-border'
                borderVal = '1'
            } else {
                classVal = ''
                borderVal = '1'
            }

            editor.chain().focus().updateAttributes('table', {
                style: styleStr || null,
                class: classVal || null,
                border: borderVal || null,
            }).run()
        }
        setIsBorderModalOpen(false)
    }, [borderPreset, borderWidth, borderStyle, borderColor])

    useEffect(() => {
        LocaleImport().then((mod) => mod.locale.setLang('vi'))
    }, [])

    return (
        <main className="h-full flex flex-col flex-1" style={{ '--editor-min-height': formattedMinHeight } as React.CSSProperties}>
            <div className="h-full flex-1 rich-text-editor-container border-none">
                <RichTextEditor
                    key={isUploadFile ? 'editor-upload-on' : 'editor-upload-off'}
                    ref={editorRef}
                    output="html"
                    content={value}
                    dark={false}
                    onChangeContent={onValueChange}
                    extensions={extensions as any}
                    bubbleMenu={{
                        tableConfig: {
                            actions: [
                                {
                                    icon: 'PencilRuler',
                                    tooltip: 'Cấu hình viền bảng',
                                    action: openBorderModal,
                                },
                            ],
                        },
                        render: (props, bubbleDefaultDom) => {
                            return <>{bubbleDefaultDom}</>
                        },
                    }}
                />
                <Modal
                    title="Cấu hình viền bảng"
                    open={isBorderModalOpen}
                    onOk={handleSaveBorders}
                    onCancel={() => setIsBorderModalOpen(false)}
                    okText="Lưu"
                    cancelText="Hủy"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                        <div>
                            <span style={{ marginRight: '12px', fontWeight: 'bold' }}>Kiểu viền:</span>
                            <Radio.Group value={borderPreset} onChange={(e) => setBorderPreset(e.target.value)}>
                                <Radio value="default">Mặc định</Radio>
                                <Radio value="none">Ẩn viền</Radio>
                                <Radio value="custom">Tùy chỉnh</Radio>
                            </Radio.Group>
                        </div>
                        {borderPreset === 'custom' && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ width: '100px', fontWeight: 'bold' }}>Độ dày:</span>
                                    <Select
                                        value={borderWidth}
                                        style={{ width: '120px' }}
                                        onChange={(val) => setBorderWidth(val)}
                                        options={[
                                            { value: '1px', label: '1 px' },
                                            { value: '2px', label: '2 px' },
                                            { value: '3px', label: '3 px' },
                                            { value: '4px', label: '4 px' },
                                            { value: '5px', label: '5 px' },
                                        ]}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ width: '100px', fontWeight: 'bold' }}>Kiểu nét:</span>
                                    <Select
                                        value={borderStyle}
                                        style={{ width: '120px' }}
                                        onChange={(val) => setBorderStyle(val)}
                                        options={[
                                            { value: 'solid', label: 'Nét liền' },
                                            { value: 'dashed', label: 'Nét đứt' },
                                            { value: 'dotted', label: 'Nét chấm' },
                                        ]}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ width: '100px', fontWeight: 'bold' }}>Màu sắc:</span>
                                    <ColorPicker
                                        value={borderColor}
                                        onChange={(color) => setBorderColor(typeof color === 'string' ? color : color.toHexString())}
                                    />
                                </div>
                            </>
                        )}
                        <div style={{ marginTop: '8px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Xem trước:</div>
                            <div
                                style={{
                                    padding: '16px',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: '#fafafa',
                                }}
                            >
                                <table
                                    style={{
                                        borderCollapse: 'collapse',
                                        width: '100%',
                                        maxWidth: '300px',
                                        border: borderPreset === 'none' ? 'none' : borderPreset === 'custom' ? `${borderWidth} ${borderStyle} ${borderColor}` : '1px solid #e5e7eb',
                                    }}
                                >
                                    <tbody>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                    border: borderPreset === 'none' ? 'none' : borderPreset === 'custom' ? `${borderWidth} ${borderStyle} ${borderColor}` : '1px solid #e5e7eb',
                                                }}
                                            >
                                                Ô 1
                                            </td>
                                            <td
                                                style={{
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                    border: borderPreset === 'none' ? 'none' : borderPreset === 'custom' ? `${borderWidth} ${borderStyle} ${borderColor}` : '1px solid #e5e7eb',
                                                }}
                                            >
                                                Ô 2
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Modal>
                <style>{`
                    .rich-text-editor-container .rte-container {
                        height: 100% !important;
                        display: flex;
                        flex-direction: column;
                    }
                    .rich-text-editor-container .rte-content {
                        flex: 1;
                        min-height: var(--editor-min-height, 120px) !important;
                    }
                    .rich-text-editor-container .ProseMirror {
                        min-height: var(--editor-min-height, 120px) !important;
                        height: auto !important;
                    }
                    .rich-text-editor-container .rte-wrapper {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        border: none !important;
                    }
                `}</style>
            </div>
        </main>
    )
})

Editor.displayName = 'Editor'

export default Editor
