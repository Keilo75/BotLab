import { useForm } from "@mantine/form";
import { UseFormReturnType } from "@mantine/form/lib/use-form";
import { useDidUpdate } from "@mantine/hooks";
import React from "react";

interface Props<T> {
  state: T;
  onChange(value: T): void;
  children(form: UseFormReturnType<T>): React.ReactElement;
}

const InputGroup = <T extends object>({ state, onChange, children }: Props<T>) => {
  const form = useForm({ initialValues: state });

  useDidUpdate(() => {
    onChange(form.values);
  }, [form.values]);

  return <>{children(form)}</>;
};

export default InputGroup;
