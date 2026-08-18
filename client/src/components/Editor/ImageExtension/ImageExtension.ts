import { Editor } from 'reactjs-tiptap-editor'
import { Extension, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import TiptapImage from '@tiptap/extension-image'
import ActionImageButton from './components/ActionImageButton'
import ImageView from './components/ImageView'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import {
    createImageUpload,
    handleImagePaste,
    handleImageDrop,
} from './image-upload'

interface GeneralOptions<T> {
    divider: boolean
    spacer: boolean
    button: ButtonView<T>
    toolbar?: boolean
}

interface ButtonViewParams<T = unknown> {
    editor: Editor
    extension: Extension<T>
    t: (path: string) => string
}

interface ButtonViewReturn {
    component: unknown
    componentProps: ButtonViewReturnComponentProps
    componentSlots?: ButtonViewReturnComponentSlots
}

interface ButtonViewReturnComponentProps {
    action?: (value?: unknown) => void
    isActive?: () => boolean
    icon?: unknown
    tooltip?: string
    [x: string]: unknown
}

interface ButtonViewReturnComponentSlots {
    dialog: () => unknown
    [x: string]: () => unknown
}

type ButtonView<T = unknown> = (
    options: ButtonViewParams<T>,
) => ButtonViewReturn | ButtonViewReturn[]

export interface SetImageAttrsOptions {
    src?: string
    /** The alternative text for the image. */
    alt?: string
    /** The caption of the image. */
    caption?: string
    /** The width of the image. */
    width?: number | string | null
    /** The alignment of the image. */
    align?: 'left' | 'center' | 'right'
    /** Whether the image is inline. */
    inline?: boolean
    /** image FlipX */
    flipX?: boolean
    /** image FlipY */
    flipY?: boolean
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        imageCustomUpload: {
            /**
             * Add an image
             */
            setImageInline: (
                options: Partial<SetImageAttrsOptions>,
            ) => ReturnType
            /**
             * Update an image
             */
            updateImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
            /**
             * Set image alignment
             */
            setAlignImage: (align: 'left' | 'center' | 'right') => ReturnType
        }
    }
}

export interface IImageOptions extends GeneralOptions<IImageOptions> {
    /** Function for uploading files */
    upload?: (file: File) => Promise<string>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HTMLAttributes?: any

    multiple?: boolean
    acceptMimes?: string[]
    maxSize?: number

    /** The source URL of the image */
    resourceImage: 'upload' | 'link' | 'both'
    defaultInline?: boolean

    // Enable alternative text input
    enableAlt?: boolean

    /** Function to handle errors during file validation */
    onError?: (error: {
        type: 'size' | 'type' | 'upload'
        message: string
        file?: File
    }) => void
}

const DEFAULT_OPTIONS: Partial<IImageOptions> = {
    acceptMimes: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'],
    maxSize: 1024 * 1024 * 5, // 5MB
    multiple: true,
    resourceImage: 'both',
    defaultInline: false,
    enableAlt: true,
}

export const ImageExtension = TiptapImage.extend<IImageOptions>({
    group: 'block',
    inline: false,
    defining: true,
    draggable: true,
    selectable: true,

    addOptions() {
        return {
            ...DEFAULT_OPTIONS,
            ...this.parent?.(),
            upload: () => Promise.reject('Image Upload Function'),
            button: ({ editor, extension }) => ({
                component: ActionImageButton,
                componentProps: {
                    action: () => true,
                    upload: extension.options.upload,
                    disabled: !(editor.can() as any).setImageInline?.({ src: '' }),
                    editor,
                },
            }),
        }
    },

    addAttributes() {
        return {
            ...this.parent?.(),
            flipX: { default: false },
            flipY: { default: false },
            width: {
                default: null,
                parseHTML: (el) => {
                    const width =
                        el.style.width || el.getAttribute('width') || null
                    return width ? Number.parseInt(width, 10) : null
                },
                renderHTML: (attrs) => (attrs.width ? { width: attrs.width + (attrs.width == 100 ? '%' : 'px') } : {}),
            },
            align: {
                default: 'center',
                parseHTML: (el) => {
                    const align = el.getAttribute('align')
                    if (align && ['left', 'center', 'right'].includes(align)) return align
                    return 'center'
                },
                renderHTML: (attrs) => ({ align: attrs.align || 'center' }),
            },
            inline: {
                default: false,
                parseHTML: (el) => Boolean(el.getAttribute('inline')),
                renderHTML: (attrs) => ({ inline: attrs.inline }),
            },
            alt: {
                default: '',
                parseHTML: (el) => el.getAttribute('alt'),
                renderHTML: (attrs) => ({ alt: attrs.alt }),
            },
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageView)
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setImageInline:
                (options) =>
                    ({ commands }) =>
                        commands.insertContent({
                            type: this.name,
                            attrs: {
                               ...options,
                                inline:
                                    options.inline ?? this.options.defaultInline,
                            },
                        }),
            updateImage:
                (options) =>
                    ({ commands }) =>
                        commands.updateAttributes(this.name, options),
            setAlignImage:
                (align) =>
                    ({ commands }) =>
                        commands.updateAttributes(this.name, { align }),
        }
    },

    renderHTML({
        HTMLAttributes,
    }: {
        HTMLAttributes: Record<string, unknown>
    }) {
        const align = (HTMLAttributes.align as string) || 'center'
        const flipX = Boolean(HTMLAttributes.flipX)
        const flipY = Boolean(HTMLAttributes.flipY)
        const inline = Boolean(HTMLAttributes.inline)
        const indent = Number(HTMLAttributes.indent) || 0

        const inlineFloat = inline && (align === 'left' || align === 'right')

        const transformStyle =
            flipX || flipY
                ? `transform: rotateX(${flipX ? '180' : '0'}deg) rotateY(${flipY ? '180' : '0'}deg);`
                : ''

        const indentStyle = indent ? `margin-left: ${indent * 30}px;` : ''
        const textAlignStyle = indent ? 'text-align: left;' : (inlineFloat ? '' : `text-align: ${align};`)
        const floatStyle = inlineFloat ? `float: ${align};` : ''
        const marginStyle = inlineFloat
            ? align === 'left'
                ? 'margin: 1em 1em 1em 0;'
                : 'margin: 1em 0 1em 1em;'
            : ''

        const style = `${floatStyle}${marginStyle}${transformStyle}`
        const wrapperStyle = `${textAlignStyle}${indentStyle}`

        const { flipX: _x, flipY: _y, inline: _i, indent: _id, 'data-indent': _did, ...restAttrs } = HTMLAttributes

        const wrapperAttrs: Record<string, unknown> = {
            style: wrapperStyle,
            class: `image image-align-${align}`,
        }
        if (indent) {
            wrapperAttrs['data-indent'] = indent
        }

        return [
            inline ? 'span' : 'div',
            wrapperAttrs,
            [
                'img',
                mergeAttributes(
                    { height: 'auto', style },
                    this.options.HTMLAttributes ?? {},
                    restAttrs,
                ),
            ],
        ]
    },

    parseHTML() {
        const parseAlign = (img: Element | null, el: Element | null) => {
            const imgAlign = img?.getAttribute('align')
            if (imgAlign && ['left', 'center', 'right'].includes(imgAlign)) {
                return imgAlign as 'left' | 'center' | 'right'
            }
            const elAlign = el?.getAttribute('align')
            if (elAlign && ['left', 'center', 'right'].includes(elAlign)) {
                return elAlign as 'left' | 'center' | 'right'
            }
            const style = (el?.getAttribute('style') || '') + ';' + (img?.getAttribute('style') || '')
            if (style.includes('text-align: center') || style.includes('text-align:center')) return 'center'
            if (style.includes('text-align: right') || style.includes('text-align:right')) return 'right'
            if (style.includes('text-align: left') || style.includes('text-align:left')) return 'left'
            if (style.includes('float: right') || style.includes('float:right')) return 'right'
            if (style.includes('float: left') || style.includes('float:left')) return 'left'
            return 'center'
        }

        const parse = (el: Element, img: Element | null) => {
            const actualImg = img || (el.tagName.toLowerCase() === 'img' ? el : el.querySelector('img'))
            const width = actualImg?.getAttribute('width') || el.getAttribute('width')
            const styleWidth = (actualImg as HTMLElement | null)?.style?.width || (el as HTMLElement).style?.width
            let widthVal: number | string | null = null
            if (width) {
                widthVal = Number.parseInt(width, 10)
            } else if (styleWidth) {
                const match = styleWidth.match(/(\d+)/)
                if (match) widthVal = Number.parseInt(match[1], 10)
            }

            return {
                src: actualImg?.getAttribute('src') || el.getAttribute('src'),
                alt: actualImg?.getAttribute('alt') || el.getAttribute('alt') || '',
                caption: actualImg?.getAttribute('caption') || '',
                width: widthVal,
                align: parseAlign(actualImg, el),
                inline: Boolean(actualImg?.getAttribute('inline') || el.getAttribute('inline')),
                flipX: actualImg?.getAttribute('flipx') === 'true' || el.getAttribute('flipx') === 'true',
                flipY: actualImg?.getAttribute('flipy') === 'true' || el.getAttribute('flipy') === 'true',
            }
        }

        return [
            {
                tag: 'span[class*=image]',
                getAttrs: (el: Element) => parse(el, el.querySelector('img')),
            },
            {
                tag: 'div[class*=image]',
                getAttrs: (el: Element) => parse(el, el.querySelector('img')),
            },
            {
                tag: 'img[src]',
                getAttrs: (img: Element) =>
                    parse(img.parentElement!, img as Element),
            },
        ]
    },

    addProseMirrorPlugins() {
        const uploadFn = createImageUpload({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onUpload: this.options.upload as any,
            defaultInline: this.options.defaultInline,
        })
        return [
            new Plugin({
                key: new PluginKey('imageDropPaste'),
                props: {
                    handlePaste(view, event) {
                        return handleImagePaste(view, event, uploadFn)
                    },
                    handleDrop(view, event, _slice, moved) {
                        return handleImageDrop(view, event, moved, uploadFn)
                    },
                },
            }),
        ]
    },
})

export default ImageExtension
