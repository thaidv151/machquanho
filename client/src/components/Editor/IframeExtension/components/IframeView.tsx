import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { clamp, throttle } from 'lodash'

interface Size {
    width: number
    height: number
}

const ResizeDirection = {
    TOP_LEFT: 'tl',
    TOP_RIGHT: 'tr',
    BOTTOM_LEFT: 'bl',
    BOTTOM_RIGHT: 'br',
}

function IframeView(props: any) {
    const [maxSize, setMaxSize] = useState<Size>({
        width: 20,
        height: 100_000,
    })

    const [resizeDirections] = useState<string[]>([
        ResizeDirection.TOP_LEFT,
        ResizeDirection.TOP_RIGHT,
        ResizeDirection.BOTTOM_LEFT,
        ResizeDirection.BOTTOM_RIGHT,
    ])

    const [resizing, setResizing] = useState<boolean>(false)

    const [resizerState, setResizerState] = useState({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        dir: '',
    })

    const { align, src, width, height } = props?.node?.attrs

    const iframeAttrs = useMemo(() => {
        const w = width
        const h = height

        const widthStr = w == 100 ? '100%' : (typeof w === 'number' ? `${w}px` : w)
        const heightStr = typeof h === 'number' ? `${h}px` : h

        return {
            src: src || undefined,
            style: {
                width: widthStr || '100%',
                height: heightStr || '400px',
                border: 'none',
            },
        }
    }, [props?.node?.attrs])

    const getMaxSize = useCallback(
        throttle(() => {
            const { editor } = props
            const { width } = getComputedStyle(editor.view.dom)
            setMaxSize((prev) => {
                return {
                    ...prev,
                    width: Number.parseInt(width, 10),
                }
            })
        }, 16),
        [props?.editor],
    )

    function selectNode() {
        const { editor, getPos } = props
        editor.commands.setNodeSelection(getPos())
    }

    function onMouseDown(e: React.MouseEvent, dir: string) {
        e.preventDefault()
        e.stopPropagation()

        const w = Number.parseInt(iframeAttrs.style.width, 10) || maxSize.width
        const h = Number.parseInt(iframeAttrs.style.height, 10) || 400

        setResizing(true)

        setResizerState({
            x: e.clientX,
            y: e.clientY,
            w,
            h,
            dir,
        })
    }

    const onMouseMove = useCallback(
        throttle((e: MouseEvent) => {
            if (!resizing) return

            const { x, y, w, h, dir } = resizerState

            const dx = (e.clientX - x) * (/l/.test(dir) ? -1 : 1)
            const dy = (e.clientY - y) * (/t/.test(dir) ? -1 : 1)

            const newWidth = clamp(w + dx, 100, maxSize.width)
            const newHeight = clamp(h + dy, 100, 2000)

            props.updateAttributes({
                width: newWidth,
                height: newHeight,
            })
        }, 16),
        [resizing, resizerState, maxSize, props.updateAttributes],
    )

    const onMouseUp = useCallback(
        (e: MouseEvent) => {
            if (!resizing) return

            setResizing(false)
            selectNode()
        },
        [resizing, selectNode],
    )

    useEffect(() => {
        if (resizing) {
            document.addEventListener('mousemove', onMouseMove, true)
            document.addEventListener('mouseup', onMouseUp, true)
        } else {
            document.removeEventListener('mousemove', onMouseMove, true)
            document.removeEventListener('mouseup', onMouseUp, true)
        }

        return () => {
            document.removeEventListener('mousemove', onMouseMove, true)
            document.removeEventListener('mouseup', onMouseUp, true)
        }
    }, [resizing, onMouseMove, onMouseUp])

    const resizeOb: ResizeObserver = useMemo(() => {
        return new ResizeObserver(() => getMaxSize())
    }, [getMaxSize])

    useEffect(() => {
        resizeOb.observe(props.editor.view.dom)
        return () => resizeOb.disconnect()
    }, [props.editor.view.dom, resizeOb])

    return (
        <NodeViewWrapper
            className="iframe-view"
            style={{
                textAlign: align,
                width: '100%',
                margin: '1rem 0',
            }}
        >
            <div
                data-drag-handle
                className={`iframe-view__body relative inline-block transition-shadow ${
                    props?.selected || resizing ? 'outline-2 outline-blue-500 shadow-lg' : ''
                }`}
                style={{
                    width: iframeAttrs.style.width,
                    height: iframeAttrs.style.height,
                }}
            >
                {/* Overlay to catch clicks and prevent iframe interaction when selecting */}
                <div 
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={selectNode}
                />
                
                <iframe
                    src={iframeAttrs.src}
                    style={iframeAttrs.style}
                    title="Iframe Content"
                />

            {props?.editor.view.editable && (props?.selected || resizing) && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        {[
                            { dir: 'tl', class: 'top-[-5px] left-[-5px] cursor-nw-resize' },
                            { dir: 'tr', class: 'top-[-5px] right-[-5px] cursor-ne-resize' },
                            { dir: 'bl', class: 'bottom-[-5px] left-[-5px] cursor-sw-resize' },
                            { dir: 'br', class: 'bottom-[-5px] right-[-5px] cursor-se-resize' },
                        ].map((handler) => (
                            <span
                                key={`iframe-dir-${handler.dir}`}
                                className={`absolute w-[10px] h-[10px] bg-blue-500 border border-white z-30 pointer-events-auto ${handler.class}`}
                                onMouseDown={(e: any) => onMouseDown(e, handler.dir)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export default IframeView
