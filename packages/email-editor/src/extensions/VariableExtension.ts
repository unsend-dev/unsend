import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { VariableComponent, VariableOptions } from "../nodes/variable";

export interface VariableNodeAttrs extends VariableOptions {}

export type VariableExtensionOptions = {
  HTMLAttributes: Record<string, any>;
  suggestion: Omit<SuggestionOptions, "editor">;
};

export const VariablePluginKey = new PluginKey("variable");

export const VariableExtension = Node.create<VariableExtensionOptions>({
  name: "variable",

  group: "inline",

  inline: true,

  selectable: false,

  atom: true,
  draggable: false,

  addOptions() {
    return {
      HTMLAttributes: {},
      deleteTriggerWithBackspace: false,
      suggestion: {
        char: "{{",
        pluginKey: VariablePluginKey,
        command: ({ editor, range, props }) => {
          console.log("props: ", props);
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: "text",
                text: " ",
              },
            ])
            .run();

          window.getSelection()?.collapseToEnd();
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow = type
            ? !!$from.parent.type.contentMatch.matchType(type)
            : false;
          console.log("allow: ", allow);

          return allow;
        },
      },
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            "data-id": attributes.id,
          };
        },
      },

      name: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-name"),
        renderHTML: (attributes) => {
          if (!attributes.name) {
            return {};
          }

          return {
            "data-name": attributes.name,
          };
        },
      },

      fallback: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-fallback"),
        renderHTML: (attributes) => {
          if (!attributes.fallback) {
            return {};
          }

          return {
            "data-fallback": attributes.fallback,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableComponent);
  },
});
