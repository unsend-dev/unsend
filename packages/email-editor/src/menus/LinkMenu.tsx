import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import React, { useCallback, useState } from "react";

import { MenuProps } from "../types";
import { LinkPreviewPanel } from "../components/panels/LinkPreviewPanel";
import { LinkEditorPanel } from "../components/panels/LinkEditorPanel";

export const LinkMenu = ({ editor, appendTo }: MenuProps): React.ReactNode => {
  const [showEdit, setShowEdit] = useState(false);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive("link");
    return isActive;
  }, [editor]);

  const { href: link } = editor.getAttributes("link");

  const handleEdit = useCallback(() => {
    setShowEdit(true);
  }, []);

  const onSetLink = useCallback(
    (url: string) => {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
      setShowEdit(false);
    },
    [editor]
  );

  const onUnsetLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowEdit(false);
    return null;
  }, [editor]);

  const onShowEdit = useCallback(() => {
    setShowEdit(true);
  }, []);

  const onHideEdit = useCallback(() => {
    setShowEdit(false);
  }, []);

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="textMenu"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        appendTo: () => {
          return appendTo?.current;
        },
        onHidden: () => {
          setShowEdit(false);
        },
      }}
      className="flex gap-1 rounded-md border border-gray-200 bg-white p-1 shadow-md items-center mt-4"
    >
      {showEdit ? (
        <LinkEditorPanel initialUrl={link} onSetLink={onSetLink} />
      ) : (
        <LinkPreviewPanel
          url={link}
          onClear={onUnsetLink}
          onEdit={handleEdit}
        />
      )}
    </BaseBubbleMenu>
  );
};

export default LinkMenu;
