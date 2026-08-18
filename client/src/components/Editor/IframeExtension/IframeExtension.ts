import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ActionIframeButton from './components/ActionIframeButton'
import IframeView from './components/IframeView'

export interface IframeOptions {
    allowFullscreen: boolean
    HTMLAttributes: Record<string, any>
    button: (props: any) => any
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setIframeContent: (options: { src: string; width?: number | string; height?: number | string; service?: string }) => ReturnType
    }
}

export const IframeExtension = Node.create<IframeOptions>({
    name: 'iframe',

    group: 'block',

    atom: true,

    addOptions() {
        return {
            allowFullscreen: true,
            HTMLAttributes: {
                class: 'iframe-wrapper',
            },
            button: ({ editor }) => ({
                component: ActionIframeButton,
                componentProps: {
                    editor,
                },
            }),
        }
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            width: {
                default: 100,
                parseHTML: (element) => {
                    const width = element.getAttribute('width') || element.style.width
                    return width ? Number.parseInt(width, 10) : 100
                },
                renderHTML: (attributes) => ({
                    width: attributes.width,
                }),
            },
            height: {
                default: 300,
                parseHTML: (element) => {
                    const height = element.getAttribute('height') || element.style.height
                    return height ? Number.parseInt(height, 10) : 300
                },
                renderHTML: (attributes) => ({
                    height: attributes.height,
                }),
            },
            allowfullscreen: {
                default: this.options.allowFullscreen,
                parseHTML: (element) => element.getAttribute('allowfullscreen') !== 'false',
                renderHTML: (attributes) => {
                    if (attributes.allowfullscreen) {
                        return {
                            allowfullscreen: 'true',
                        }
                    }
                    return {}
                },
            },
            align: {
                default: 'center',
                parseHTML: (element) => element.style.textAlign || 'center',
                renderHTML: (attributes) => ({
                    style: `text-align: ${attributes.align}`,
                }),
            },
            service: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'iframe',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        const { width, height, align } = HTMLAttributes
        const widthStyle = width == 100 ? '100%' : `${width}px`
        const heightStyle = typeof height === 'number' ? `${height}px` : height

        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, {
                style: `text-align: ${align}; width: ${widthStyle}; margin: 0 auto;`,
            }),
            [
                'iframe',
                mergeAttributes(HTMLAttributes, {
                    width: '100%',
                    height: '100%',
                    style: `width: ${widthStyle}; height: ${heightStyle}; border: none;`,
                }),
            ],
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(IframeView)
    },

    addCommands() {
        return {
            setIframeContent:
                (options: { src: string; width?: number | string; height?: number | string; service?: string }) =>
                    ({ commands }: any) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        })
                    },
        } as any
    },
})

export default IframeExtension
