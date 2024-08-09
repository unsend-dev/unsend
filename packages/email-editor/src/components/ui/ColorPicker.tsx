"use client";

import { useState } from "react";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";

type ColorPickerProps = {
  color: string;
  onChange?: (color: string) => void;
};

export function ColorPicker(props: ColorPickerProps) {
  const { color: initialColor, onChange } = props;

  const [color, setColor] = useState(initialColor);

  const handleColorChange = (color: string) => {
    setColor(color);
    onChange?.(color);
  };

  return (
    <div className="min-w-[260px] rounded-xl border bg-white p-4">
      <HexAlphaColorPicker
        color={color}
        onChange={handleColorChange}
        className="flex !w-full flex-col gap-4"
      />
      <HexColorInput
        alpha={true}
        color={color}
        onChange={handleColorChange}
        className="mt-4 bg-transparent text-black w-full min-w-0 rounded-lg border px-2 py-1.5 text-sm uppercase focus-visible:border-gray-400 focus-visible:outline-none"
        prefixed
      />
    </div>
  );
}
