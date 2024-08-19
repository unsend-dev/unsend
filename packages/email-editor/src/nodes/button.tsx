import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ScanIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@unsend/ui/src/popover";
import { cn } from "@unsend/ui/lib/utils";
import { Input } from "@unsend/ui/src/input";
import { Button } from "@unsend/ui/src/button";
import { AllowedAlignments, ButtonOptions } from "../types";
import { Separator } from "@unsend/ui/src/separator";
import { BorderWidth } from "../components/ui/icons/BorderWidth";
import { ColorPicker } from "../components/ui/ColorPicker";

const alignments: Array<AllowedAlignments> = ["left", "center", "right"];

export function ButtonComponent(props: NodeViewProps) {
  const {
    url,
    text,
    alignment,
    borderRadius: _radius,
    buttonColor,
    textColor,
    borderColor,
    borderWidth,
  } = props.node.attrs as ButtonOptions;
  const { getPos, editor } = props;

  console.log(props);

  return (
    <NodeViewWrapper
      className={`react-component ${
        props.selected && "ProseMirror-selectednode"
      }`}
      draggable="true"
      data-drag-handle=""
      style={{
        textAlign: alignment,
      }}
    >
      <Popover open={props.selected}>
        <PopoverTrigger asChild>
          <div>
            <button
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors disabled:pointer-events-none disabled:opacity-50",
                "h-10 px-4 py-2",
                "px-[32px] py-[20px] font-semibold no-underline"
              )}
              tabIndex={-1}
              style={{
                backgroundColor: buttonColor,
                color: textColor,
                borderWidth: Number(borderWidth),
                borderStyle: "solid",
                borderColor: borderColor,
                borderRadius: Number(_radius),
              }}
              onClick={(e) => {
                e.preventDefault();
                const pos = getPos();
                editor.commands.setNodeSelection(pos);
              }}
            >
              {text}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="top"
          className="space-y-2 light border-gray-200"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Input
            placeholder="Add text here"
            value={text}
            onChange={(e) => {
              props.updateAttributes({
                text: e.target.value,
              });
            }}
            className="light"
          />
          <Input
            placeholder="Add link here"
            value={url}
            onChange={(e) => {
              props.updateAttributes({
                url: e.target.value,
              });
            }}
          />

          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-500 mt-4">Border</div>
            <div className="flex gap-2">
              <div className="flex items-center border border-transparent focus-within:border-border gap-2 px-1 py-0.5 rounded-md">
                <ScanIcon className="text-slate-700 h-4 w-4" />
                <Input
                  value={_radius}
                  onChange={(e) =>
                    props.updateAttributes({
                      borderRadius: e.target.value,
                    })
                  }
                  className="border-0 focus-visible:ring-0 h-6 p-0"
                />
              </div>
              <div className="flex items-center border border-transparent focus-within:border-border gap-2 px-1 py-0.5 rounded-md">
                <BorderWidth className="text-slate-700 h-4 w-4" />
                <Input
                  value={borderWidth}
                  onChange={(e) =>
                    props.updateAttributes({
                      borderWidth: e.target.value,
                    })
                  }
                  className="border-0 focus-visible:ring-0 h-6 p-0"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <div className="text-xs text-gray-500 mt-4 mb-2">Alignment</div>
                <div className="flex">
                  {alignments.map((alignment) => (
                    <Button
                      variant="ghost"
                      className=""
                      size="sm"
                      type="button"
                      onClick={() => {
                        props.updateAttributes({
                          alignment,
                        });
                      }}
                    >
                      <AlignmentIcon alignment={alignment} />
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mt-4 mb-2">Colors</div>
                <div className="flex gap-2">
                  <BorderColorPickerPopup
                    color={borderColor}
                    onChange={(color) => {
                      props.updateAttributes({
                        borderColor: color,
                      });
                    }}
                  />
                  <BackgroundColorPickerPopup
                    color={buttonColor}
                    onChange={(color) => {
                      props.updateAttributes({
                        buttonColor: color,
                      });
                    }}
                  />
                  <TextColorPickerPopup
                    color={textColor}
                    onChange={(color) => {
                      props.updateAttributes({
                        textColor: color,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}

// type ColorPickerProps = {
//   variant?: AllowedButtonVariant;
//   color: string;
//   onChange: (color: string) => void;
// };

function BackgroundColorPickerPopup(props: ColorPickerProps) {
  const { color, onChange } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="" size="sm" type="button">
          <div
            className="h-4 w-4 rounded border"
            style={{
              backgroundColor: color,
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-none border-0 !bg-transparent !p-0 shadow-none drop-shadow-md">
        <ColorPicker
          color={color}
          onChange={(newColor) => {
            // HACK: This is a workaround for a bug in tiptap
            // https://github.com/ueberdosis/tiptap/issues/3580
            //
            //     ERROR: flushSync was called from inside a lifecycle
            //
            // To fix this, we need to make sure that the onChange
            // callback is run after the current execution context.
            queueMicrotask(() => {
              onChange(newColor);
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function TextColorPickerPopup(props: ColorPickerProps) {
  const { color, onChange } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" type="button">
          <div className="flex flex-col items-center justify-center gap-[1px]">
            <span className="font-bolder font-mono text-xs text-slate-700">
              A
            </span>
            <div className="h-[2px] w-3" style={{ backgroundColor: color }} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-none border-0 !bg-transparent !p-0 shadow-none drop-shadow-md">
        <ColorPicker
          color={color}
          onChange={(color) => {
            queueMicrotask(() => {
              onChange(color);
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
};

function BorderColorPickerPopup(props: ColorPickerProps) {
  const { color, onChange } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="" size="sm" type="button">
          <BorderWidth className="h-4 w-4" style={{ color: color }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-none border-0 !bg-transparent !p-0 shadow-none drop-shadow-md">
        <ColorPicker
          color={color}
          onChange={(newColor) => {
            // HACK: This is a workaround for a bug in tiptap
            // https://github.com/ueberdosis/tiptap/issues/3580
            //
            //     ERROR: flushSync was called from inside a lifecycle
            //
            // To fix this, we need to make sure that the onChange
            // callback is run after the current execution context.
            queueMicrotask(() => {
              onChange(newColor);
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

const AlignmentIcon = ({ alignment }: { alignment: AllowedAlignments }) => {
  if (alignment === "left") {
    return <AlignLeftIcon className="h-4 w-4" />;
  } else if (alignment === "center") {
    return <AlignCenterIcon className="h-4 w-4" />;
  } else if (alignment === "right") {
    return <AlignRightIcon className="h-4 w-4" />;
  }
  return null;
};
