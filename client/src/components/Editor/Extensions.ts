import { NodeSelection } from '@tiptap/pm/state'

if (typeof window !== 'undefined') {
    const originalClick = HTMLInputElement.prototype.click
    let lastFileClickTime = 0
    HTMLInputElement.prototype.click = function (this: HTMLInputElement) {
        if (this.type === 'file') {
            const now = Date.now()
            if (now - lastFileClickTime < 500) {
                return // Prevent duplicate file dialogs triggered by React's double useEffect or overlapping events
            }
            lastFileClickTime = now
        }
        originalClick.call(this)
    }
}
import { BaseKit } from 'reactjs-tiptap-editor'
import { Attachment } from 'reactjs-tiptap-editor/attachment'
import { Blockquote } from 'reactjs-tiptap-editor/blockquote'
import { Bold } from 'reactjs-tiptap-editor/bold'
import { BulletList } from 'reactjs-tiptap-editor/bulletlist'
import { Clear } from 'reactjs-tiptap-editor/clear'
import { Color } from 'reactjs-tiptap-editor/color'
import { ColumnActionButton } from 'reactjs-tiptap-editor/multicolumn'
import { FontFamily } from 'reactjs-tiptap-editor/fontfamily'
import { FontSize } from 'reactjs-tiptap-editor/fontsize'
import { Heading } from 'reactjs-tiptap-editor/heading'
import { Highlight } from 'reactjs-tiptap-editor/highlight'
import { History } from 'reactjs-tiptap-editor/history'
import { HorizontalRule } from 'reactjs-tiptap-editor/horizontalrule'
import { IframeExtension } from './IframeExtension/IframeExtension'
import { ImportWord } from 'reactjs-tiptap-editor/importword'
import { Indent } from 'reactjs-tiptap-editor/indent'
import { Italic } from 'reactjs-tiptap-editor/italic'
import { LineHeight } from 'reactjs-tiptap-editor/lineheight'
import { Link } from 'reactjs-tiptap-editor/link'
import { MoreMark } from 'reactjs-tiptap-editor/moremark'
import { OrderedList } from 'reactjs-tiptap-editor/orderedlist'
import { SearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace'
import { SlashCommand } from 'reactjs-tiptap-editor/slashcommand'
import { Strike } from 'reactjs-tiptap-editor/strike'
import { Table as OriginalTable } from 'reactjs-tiptap-editor/table'
export const CustomTable = OriginalTable.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            class: {
                default: null,
                parseHTML: (element) => element.getAttribute('class'),
                renderHTML: (attributes) => {
                    if (!attributes.class) {
                        return {}
                    }
                    return { class: attributes.class }
                },
            },
            style: {
                default: null,
                parseHTML: (element) => element.getAttribute('style'),
                renderHTML: (attributes) => {
                    if (!attributes.style) {
                        return {}
                    }
                    return { style: attributes.style }
                },
            },
            border: {
                default: null,
                parseHTML: (element) => element.getAttribute('border'),
                renderHTML: (attributes) => {
                    if (attributes.border === null || attributes.border === undefined) {
                        return {}
                    }
                    return { border: attributes.border }
                },
            },
        }
    },
})
import { TableOfContents } from 'reactjs-tiptap-editor/tableofcontent'
import { TaskList } from 'reactjs-tiptap-editor/tasklist'
import { TextAlign } from 'reactjs-tiptap-editor/textalign'
import { TextUnderline } from 'reactjs-tiptap-editor/textunderline'
import { Video } from 'reactjs-tiptap-editor/video'
import { ImageExtension } from './ImageExtension/ImageExtension'
import { apiService } from '../../services/apiService'

const imageExtensionConfigured = ImageExtension.configure({
    upload: async (file: File) => {
        return apiService.uploadImage(file)
    },
})

const videoConfigured = Video.configure({
    upload: async (file: File) => {
        return apiService.uploadImage(file)
    },
})

const importWordConfigured = ImportWord.configure({
    upload: (files: File[]) => {
        const f = files.map((file) => ({
            src: URL.createObjectURL(file),
            alt: file.name,
        }))
        return Promise.resolve(f)
    },
})

const attachmentConfigured = Attachment.configure({
    upload: async (file: File) => {
        return apiService.uploadImage(file)
    },
})

const CustomIndent = Indent.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            types: ['paragraph', 'heading', 'blockquote', 'image'],
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    indent: {
                        default: 0,
                        parseHTML: (element) => {
                            const dataIndent = element.dataset?.indent
                            if (dataIndent) {
                                return Number.parseInt(dataIndent, 10) || 0
                            }
                            const styleIndent =
                                element.style?.marginLeft ||
                                element.style?.paddingLeft ||
                                element.style?.textIndent
                            if (styleIndent) {
                                const val = parseFloat(styleIndent)
                                if (!isNaN(val) && val > 0) {
                                    if (styleIndent.includes('em')) {
                                        return Math.max(1, Math.round(val / 2))
                                    }
                                    return Math.max(1, Math.round(val / 30))
                                }
                            }
                            return 0
                        },
                        renderHTML: (attributes) => {
                            if (!attributes.indent) {
                                return {}
                            }
                            return {
                                'data-indent': attributes.indent,
                                style: `margin-left: ${attributes.indent * 30}px;`,
                            }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            indent:
                () =>
                    ({ tr, state, dispatch }) => {
                        const { selection } = state
                        let imageHandled = false
                        if (selection instanceof NodeSelection && selection.node?.type.name === 'image') {
                            const currentIndent = Number(selection.node.attrs.indent) || 0
                            if (currentIndent < 8) {
                                if (dispatch) {
                                    tr.setNodeMarkup(selection.from, undefined, {
                                        ...selection.node.attrs,
                                        indent: currentIndent + 1,
                                    })
                                }
                                return true
                            }
                            return false
                        }

                        const { from, to } = selection
                        state.doc.nodesBetween(from, to, (node, pos) => {
                            if (node.type.name === 'image') {
                                const currentIndent = Number(node.attrs.indent) || 0
                                if (currentIndent < 8) {
                                    if (dispatch) {
                                        tr.setNodeMarkup(pos, undefined, {
                                            ...node.attrs,
                                            indent: currentIndent + 1,
                                        })
                                    }
                                    imageHandled = true
                                }
                            }
                        })
                        if (imageHandled) return true

                        const types = this.options.types.filter((t) => t !== 'image')
                        let updated = false
                        state.doc.nodesBetween(from, to, (node, pos) => {
                            if (types.includes(node.type.name)) {
                                const currentIndent = Number(node.attrs.indent) || 0
                                if (currentIndent < 8) {
                                    if (dispatch) {
                                        tr.setNodeMarkup(pos, undefined, {
                                            ...node.attrs,
                                            indent: currentIndent + 1,
                                        })
                                    }
                                    updated = true
                                }
                            }
                        })
                        return updated
                    },
            outdent:
                () =>
                    ({ tr, state, dispatch }) => {
                        const { selection } = state
                        let imageHandled = false
                        if (selection instanceof NodeSelection && selection.node?.type.name === 'image') {
                            const currentIndent = Number(selection.node.attrs.indent) || 0
                            if (currentIndent > 0) {
                                if (dispatch) {
                                    tr.setNodeMarkup(selection.from, undefined, {
                                        ...selection.node.attrs,
                                        indent: currentIndent - 1,
                                    })
                                }
                                return true
                            }
                            return false
                        }

                        const { from, to } = selection
                        state.doc.nodesBetween(from, to, (node, pos) => {
                            if (node.type.name === 'image') {
                                const currentIndent = Number(node.attrs.indent) || 0
                                if (currentIndent > 0) {
                                    if (dispatch) {
                                        tr.setNodeMarkup(pos, undefined, {
                                            ...node.attrs,
                                            indent: currentIndent - 1,
                                        })
                                    }
                                    imageHandled = true
                                }
                            }
                        })
                        if (imageHandled) return true

                        const types = this.options.types.filter((t) => t !== 'image')
                        let updated = false
                        state.doc.nodesBetween(from, to, (node, pos) => {
                            if (types.includes(node.type.name)) {
                                const currentIndent = Number(node.attrs.indent) || 0
                                if (currentIndent > 0) {
                                    if (dispatch) {
                                        tr.setNodeMarkup(pos, undefined, {
                                            ...node.attrs,
                                            indent: currentIndent - 1,
                                        })
                                    }
                                    updated = true
                                }
                            }
                        })
                        return updated
                    },
        }
    },
})

/** Phần đầu toolbar: không gồm ảnh/video/upload file. */
const baseCoreExtensions = [
    BaseKit.configure({
        placeholder: {
            showOnlyCurrent: true,
        },
        characterCount: false,
    }),
    FontFamily,
    FontSize,
    Bold,
    Italic,
    TextUnderline,
    Strike,
    Link,
]

/**
 * @param isUploadFile — `false`: bỏ ảnh, video, import Word, đính kèm (toolbar) để hạn chế spam upload.
 */
export function buildExtensions(isUploadFile = true) {
    const uploadExtensions = isUploadFile
        ? [imageExtensionConfigured, videoConfigured]
        : []

    const tailUploadExtensions = isUploadFile
        ? [importWordConfigured, attachmentConfigured]
        : []

    return [
        ...baseCoreExtensions,
        ...uploadExtensions,
        History,
        SearchAndReplace,
        TableOfContents,
        Clear,
        Heading.configure({ spacer: true }),
        MoreMark,
        Color.configure({ spacer: true }),
        Highlight,
        BulletList,
        OrderedList,
        TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
        CustomIndent,
        LineHeight,
        TaskList.configure({
            spacer: true,
            taskItem: {
                nested: true,
            },
        }),
        Blockquote,
        SlashCommand,
        HorizontalRule,
        ColumnActionButton,
        CustomTable,
        IframeExtension,
        ...tailUploadExtensions,
    ]
}

/** Mặc định đầy đủ upload (tin bài, quản trị). */
export const extensions = buildExtensions(true)
