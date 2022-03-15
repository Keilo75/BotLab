import { useState } from "react";

interface useModalReturnValue {
  opened: boolean;
  show: () => void;
  close: () => void;
}

const useModal = (): useModalReturnValue => {
  const [open, setOpen] = useState(false);

  const show = () => setOpen(true);
  const close = () => setOpen(false);

  return { opened: open, show, close };
};

export default useModal;
