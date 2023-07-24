import React from 'react';

import {
  Button,
  ButtonProps,
  ChildlessViewProps,
  ContextMenu,
  ContextMenuAction,
  View,
} from '~/components';

export type SegmentedButtonProps<T extends string | number | boolean = string> = {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  style?: ChildlessViewProps['style'];
  value: T;
  pressOnly?: boolean;
};

export type SegmentedButtonsProps<T extends string | number | boolean = string> = ChildlessViewProps & {
  options: SegmentedButtonProps<T>[];
  initialValue?: T;
  onValueChange?: (value: T) => void;
  buttonProps?: Partial<ButtonProps> | ((option: SegmentedButtonProps<T>, selected: boolean) => Partial<ButtonProps>);
  buttonMenuItems?: (option: SegmentedButtonProps<T>, selected: boolean) => ContextMenuAction[];
};

export type SegmentedButtonsRef<T extends string | number | boolean = string> = {
  setValue: React.Dispatch<React.SetStateAction<T | undefined>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SegmentedButtons = React.forwardRef(function SegmentedButtons<T extends string | number | boolean = string>({
  initialValue,
  options,
  onValueChange,
  buttonProps,
  buttonMenuItems,
  ...props
}: SegmentedButtonsProps<T>, ref?: React.Ref<SegmentedButtonsRef<T>>) {
  const [value, setValue] = React.useState<T | undefined>(initialValue);
  React.useImperativeHandle(ref, () => ({ setValue }), [setValue]);
  return (
    <View flexRow { ...props }>
      {options.map((option, index) => (
        <ContextMenu 
          key={ `${option.value}${index}` }
          actions={ buttonMenuItems?.(option, value === option.value) ?? [] }>
          <Button
            px={ 12 }
            gap={ 6 }
            adjustsFontSizeToFit
            leftIcon={ option.icon }
            selected={ value === option.value }
            { ...(buttonProps instanceof Function ? buttonProps(option, value === option.value) : buttonProps) }
            onPress={ () => {
              if (!option.pressOnly) { 
                setValue(option.value);
              }
              onValueChange?.(option.value);
            } }>
            { option.label }
          </Button>
        </ContextMenu>
      ))}
    </View>
  );
});