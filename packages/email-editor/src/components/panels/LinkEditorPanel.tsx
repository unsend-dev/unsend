import { Button } from "@unsend/ui/src/button";
import { CheckIcon } from "lucide-react";
import { useState, useCallback, useMemo } from "react";

export type LinkEditorPanelProps = {
  initialUrl?: string;
  onSetLink: (url: string) => void;
};

export const useLinkEditorState = ({
  initialUrl,
  onSetLink,
}: LinkEditorPanelProps) => {
  const [url, setUrl] = useState(initialUrl || "");

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  }, []);

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidUrl) {
        onSetLink(url);
      }
    },
    [url, isValidUrl, onSetLink]
  );

  return {
    url,
    setUrl,
    onChange,
    handleSubmit,
    isValidUrl,
  };
};

export const LinkEditorPanel = ({
  onSetLink,
  initialUrl,
}: LinkEditorPanelProps) => {
  const state = useLinkEditorState({
    onSetLink,
    initialUrl,
  });

  return (
    <div className="">
      <form
        onSubmit={state.handleSubmit}
        className="flex items-center gap-2 justify-between"
      >
        <label className="flex items-center gap-2 p-2 rounded-lg  cursor-text">
          <input
            type="url"
            className="flex-1 bg-transparent outline-none min-w-[12rem] text-black text-sm"
            placeholder="Enter link"
            value={state.url}
            onChange={state.onChange}
          />
        </label>
        <Button
          variant="silent"
          size="sm"
          className="px-1"
          disabled={!state.isValidUrl}
        >
          <CheckIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
