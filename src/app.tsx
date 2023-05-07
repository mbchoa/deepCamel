import { ChangeEvent } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { createFormattedJsonString } from "./utils";

export function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleCamelClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (dialogRef.current === null) {
        return;
      }

      setIsOpen(true);
    },
    [dialogRef.current]
  );

  const handleCopyClick = useCallback(() => {
    if (dialogRef.current === null) {
      return;
    }

    const formattedJsonString = createFormattedJsonString(value);
    navigator.clipboard.writeText(formattedJsonString);
    setIsOpen(false);
  }, [dialogRef.current, value]);

  const handleOutsideClick = (e: MouseEvent) => {
    const boundingClientRect = dialogRef.current?.getBoundingClientRect();
    if (boundingClientRect === undefined) {
      return;
    }

    if (
      e.clientX < boundingClientRect.left ||
      e.clientX > boundingClientRect.right ||
      e.clientY < boundingClientRect.top ||
      e.clientY > boundingClientRect.bottom
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.removeAttribute("open");
    return () => dialog?.close();
  }, []);

  useEffect(() => {
    if (dialogRef.current === null) {
      return;
    }

    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  const renderFormattedJson = () => {
    if (!isOpen) {
      return null;
    }

    try {
      return (
        <>
          <pre className="text-left">{createFormattedJsonString(value)}</pre>
          <button
            className="p-2 rounded border transition-colors hover:border-[#646cff] focus:ring-2 focus:ring-white"
            onClick={handleCopyClick}
          >
            Copy to Clipboard
          </button>
        </>
      );
    } catch {
      return <div>Invalid JSON</div>;
    }
  };

  return (
    <main>
      <h1 className="mb-4 font-vt323">deepCamel</h1>
      <form className="flex flex-col gap-y-8">
        <textarea
          className="h-40 font-mono p-2 font-sm min-h-[20rem]"
          onChange={handleChange}
          value={value}
        />
        <button
          className="p-2 rounded border transition-colors hover:border-[#646cff] focus:ring-2 focus:ring-white"
          onClick={handleCamelClick}
        >
          🐪
        </button>
      </form>
      <dialog onClick={handleOutsideClick} ref={dialogRef}>
        <div className="flex flex-col gap-y-2">{renderFormattedJson()}</div>
      </dialog>
    </main>
  );
}
