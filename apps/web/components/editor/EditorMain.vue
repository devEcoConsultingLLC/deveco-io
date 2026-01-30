<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

const props = defineProps<{
  content?: any;
}>();

const emit = defineEmits<{
  'update:content': [content: any];
}>();

const editor = useEditor({
  content: props.content || '<p>Start writing your project documentation...</p>',
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    Placeholder.configure({
      placeholder: 'Start writing your project documentation...',
    }),
    Image,
    CodeBlockLowlight,
  ],
  editorProps: {
    attributes: {
      class: 'prose-deveco min-h-[500px] outline-none',
    },
  },
  onUpdate({ editor }) {
    emit('update:content', editor.getJSON());
  },
});
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <!-- Toolbar -->
    <div v-if="editor" class="sticky top-0 z-10 flex items-center gap-1 border-b border-border bg-background px-4 py-2">
      <button
        class="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        :class="{ 'bg-accent text-foreground': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>
      </button>
      <button
        class="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        :class="{ 'bg-accent text-foreground': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
      </button>

      <div class="mx-2 h-5 w-px bg-border" />

      <button
        class="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        :class="{ 'bg-accent text-foreground': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        class="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        :class="{ 'bg-accent text-foreground': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button>

      <div class="mx-2 h-5 w-px bg-border" />

      <button
        class="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        :class="{ 'bg-accent text-foreground': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
      </button>
      <button
        class="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        :class="{ 'bg-accent text-foreground': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      </button>
      <button
        class="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        :class="{ 'bg-accent text-foreground': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
      </button>
    </div>

    <!-- Editor Content -->
    <div class="mx-auto max-w-3xl px-8 py-8">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>
