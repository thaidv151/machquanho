import type { EditorView } from '@tiptap/pm/view'

export interface ImageUploadOptions {
    onUpload: (file: File) => Promise<string | object>
    postUpload?: (src: string) => Promise<string>
    defaultInline?: boolean
}

export type UploadFn = (files: File[], view: EditorView, pos: number) => void

export function createImageUpload({
    onUpload,
    postUpload,
    defaultInline = false,
}: ImageUploadOptions): UploadFn {
    return (files, view, pos) => {
        if (!files.length) return;

        let tr = view.state.tr
        if (!tr.selection.empty) {
            tr.deleteSelection()
        }

        const startPos = tr.mapping.map(pos)
        const { schema } = view.state

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nodes: any[] = []
        const uploadTasks: { file: File; blobUrl: string }[] = []

        files.forEach((file) => {
            const blobUrl = URL.createObjectURL(file)
            const node = schema.nodes.image?.create({
                src: blobUrl,
                inline: defaultInline,
            })
            if (node) {
                nodes.push(node)
                uploadTasks.push({ file, blobUrl })
            }
        })

        if (!nodes.length) return

        tr = tr.insert(startPos, nodes)
        view.dispatch(tr)

        uploadTasks.forEach(({ file, blobUrl }) => {
            onUpload(file).then(
                async (uploadedSrc) => {
                    if (postUpload && typeof uploadedSrc === 'string') {
                        uploadedSrc = await postUpload(uploadedSrc)
                    }

                    const finalSrc = typeof uploadedSrc === 'object' ? blobUrl : uploadedSrc

                    const { doc } = view.state
                    let nodePos = -1
                    doc.descendants((node, pos) => {
                        if (node.type === schema.nodes.image && node.attrs.src === blobUrl) {
                            nodePos = pos
                            return false // stop descendant traversal
                        }
                    })

                    if (nodePos !== -1) {
                        const transaction = view.state.tr.setNodeMarkup(nodePos, undefined, {
                            ...doc.nodeAt(nodePos)?.attrs,
                            src: finalSrc,
                        })
                        view.dispatch(transaction)
                    }
                },
                () => {
                    const { doc } = view.state
                    let nodePos = -1
                    doc.descendants((node, pos) => {
                        if (node.type === schema.nodes.image && node.attrs.src === blobUrl) {
                            nodePos = pos
                            return false
                        }
                    })
                    if (nodePos !== -1) {
                        const node = doc.nodeAt(nodePos)
                        if (node) {
                            view.dispatch(view.state.tr.delete(nodePos, nodePos + node.nodeSize))
                        }
                    }
                },
            )
        })
    }
}

export function handleImagePaste(
    view: EditorView,
    event: ClipboardEvent,
    uploadFn: UploadFn,
): boolean {
    const files = [...(event.clipboardData?.files || [])].filter(file => file.type.includes('image/'))

    if (!files.length && event.clipboardData?.items) {
        const items = [...event.clipboardData.items]
        for (const item of items) {
            if (item.type.includes('image')) {
                const f = item.getAsFile()
                if (f) files.push(f)
            }
        }
    }

    if (files.length > 0) {
        event.preventDefault()
        const pos = view.state.selection.from
        uploadFn(files, view, pos)
        return true
    }
    return false
}

export function handleImageDrop(
    view: EditorView,
    event: DragEvent,
    moved: boolean,
    uploadFn: UploadFn,
): boolean {
    const files = [...(event.dataTransfer?.files || [])].filter(file => file.type.includes('image/'))
    if (!moved && files.length > 0) {
        event.preventDefault()
        const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
        })
        if (coordinates) {
            uploadFn(files, view, coordinates.pos)
            return true
        }
    }
    return false
}
