import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { useEffect, useCallback, useRef } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Minus, AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Upload, Link as LinkIcon, Unlink, Undo, Redo,
} from 'lucide-react'
import './RichTextEditor.css'

const COLORS = ['#1a1a1a', '#FF6F61', '#0D9488', '#3B82F6', '#8B5CF6', '#F59E0B', '#DC2626', '#6B7280']

function ToolbarBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      className={`rte-btn${active ? ' rte-btn--active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="rte-divider" />
}

export default function RichTextEditor({ value, onChange, onUploadImage, stickyToolbar, fullHeight }) {
  const fileRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false)
    }
  }, [value])

  const insertImageUrl = useCallback(() => {
    const url = window.prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file || !onUploadImage) return
    e.target.value = ''
    try {
      const url = await onUploadImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch (err) {
      alert(`Image upload failed: ${err.message}`)
    }
  }, [editor, onUploadImage])

  const setLink = useCallback(() => {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('URL:', prev || 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const setColor = useCallback((color) => {
    editor.chain().focus().setColor(color).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className={`rte-wrap${fullHeight ? ' rte-wrap--full' : ''}`}>
      <div className={`rte-toolbar${stickyToolbar ? ' rte-toolbar--sticky' : ''}`}>
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo size={15} />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={15} />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={15} />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
          <AlignLeft size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
          <AlignCenter size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
          <AlignRight size={15} />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus size={15} />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={insertImageUrl} title="Insert image by URL">
          <ImageIcon size={15} />
        </ToolbarBtn>
        {onUploadImage && (
          <>
            <ToolbarBtn onClick={() => fileRef.current?.click()} title="Upload image from computer">
              <Upload size={15} />
            </ToolbarBtn>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </>
        )}
        <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Insert link">
          <LinkIcon size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} title="Remove link">
          <Unlink size={15} />
        </ToolbarBtn>

        <Divider />

        <div className="rte-colors">
          {COLORS.map(c => (
            <button key={c} type="button"
              className={`rte-color-dot${editor.isActive('textStyle', { color: c }) ? ' rte-color-dot--active' : ''}`}
              style={{ background: c }} title={c} onClick={() => setColor(c)}
            />
          ))}
          <button type="button" className="rte-color-dot rte-color-dot--reset" title="Reset color"
            onClick={() => editor.chain().focus().unsetColor().run()}>×
          </button>
        </div>
      </div>

      <EditorContent editor={editor} className="rte-content" />
    </div>
  )
}
