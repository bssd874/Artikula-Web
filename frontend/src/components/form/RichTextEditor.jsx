import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { Bold, Code2, Heading2, Image, Italic, Link, List, ListOrdered, Quote, Redo2, Underline as UnderlineIcon, Undo2 } from 'lucide-react';
import { useEffect } from 'react';

const tools = [
  ['bold', Bold, (editor) => editor.chain().focus().toggleBold().run()],
  ['italic', Italic, (editor) => editor.chain().focus().toggleItalic().run()],
  ['underline', UnderlineIcon, (editor) => editor.chain().focus().toggleUnderline().run()],
  ['heading', Heading2, (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run()],
  ['bulletList', List, (editor) => editor.chain().focus().toggleBulletList().run()],
  ['orderedList', ListOrdered, (editor) => editor.chain().focus().toggleOrderedList().run()],
  ['blockquote', Quote, (editor) => editor.chain().focus().toggleBlockquote().run()],
  ['codeBlock', Code2, (editor) => editor.chain().focus().toggleCodeBlock().run()],
];

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap prose-article rounded-b-lg border border-t-0 border-slate-200 bg-white px-4 py-3',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [editor, value]);

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const setImage = () => {
    const src = window.prompt('URL gambar');
    if (src) editor.chain().focus().setImage({ src }).run();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t-lg border border-slate-200 bg-slate-50 p-2">
        {tools.map(([name, Icon, action]) => (
          <button
            key={name}
            type="button"
            title={name}
            onClick={() => action(editor)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${editor.isActive(name) ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-white'}`}
          >
            <Icon size={17} />
          </button>
        ))}
        <button type="button" title="link" onClick={setLink} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-white">
          <Link size={17} />
        </button>
        <button type="button" title="image" onClick={setImage} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-white">
          <Image size={17} />
        </button>
        <button type="button" title="undo" onClick={() => editor.chain().focus().undo().run()} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-white">
          <Undo2 size={17} />
        </button>
        <button type="button" title="redo" onClick={() => editor.chain().focus().redo().run()} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-white">
          <Redo2 size={17} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
