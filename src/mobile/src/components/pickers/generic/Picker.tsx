import React from 'react';

import {
  ActivityIndicator,
  Button,
  ButtonProps,
  ChildlessViewProps,
  ScrollViewProps,
  SelectOption,
  SelectOptionState,
  TextInput,
  View,
} from '~/components';
import { strings } from '~/locales';

export type PickerRender<T extends string, P> = (options: SelectOption<T, P>[], value: T[], onSelect: (option: T) => void) => React.ReactNode;

export type PickerProps<
  T extends string,
  P,
  Multi extends true | false = false,
  InitialValue extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  CurrentValue extends Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined) = Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined)
> = ChildlessViewProps & {
  options: T[] | SelectOption<T, P>[] | (() => Promise<T[] | SelectOption<T, P>[]>);
  render: PickerRender<T, P>;
  multi?: Multi;
  initialValue?: InitialValue;
  scrollViewProps?: Partial<ScrollViewProps>;
  buttonProps?: Partial<ButtonProps> | ((state: SelectOptionState<T>) => Partial<ButtonProps>);
  searchable?: boolean;
  onValueChange?: (value?: CurrentValue) => void;
  onSave?: (value?: CurrentValue) => void;
};

export function Picker<
  T extends string,
  P,
  Multi extends true | false = false,
  InitialValue extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  CurrentValue extends Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined) = Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined)
>({
  options: options0,
  render,
  initialValue,
  multi,
  searchable,
  onValueChange,
  onSave,
  ...props
}: PickerProps<T, P, Multi, InitialValue, CurrentValue>) {

  const [loading, setLoading] = React.useState(options0 instanceof Function);

  const [options, setOptions] = React.useState(SelectOption.options<T, P>(options0 instanceof Function ? [] as T[] : options0));
  const [value, setValue] = React.useState<T[]>((Array.isArray(initialValue) ? initialValue : initialValue != null ? [initialValue] : []) as T[]);
  const [state, setState] = React.useState<CurrentValue>();

  const [filter, setFilter] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    if (!filter) {
      return options;
    }
    return options.filter((option) => RegExp(filter, 'ig').test(option.value) || (typeof option.label === 'string' && RegExp(filter, 'ig').test(option.label)));
  }, [options, filter]);

  const loadOptions = React.useCallback(async () => {
    if (options.length > 0) {
      return;
    }
    if (options0 instanceof Function) {
      setLoading(true);
      const options = await options0();
      setLoading(false);
      setOptions(SelectOption.options(options));
    }
  }, [options, options0]);

  React.useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleSelect = React.useCallback((option: T) => {
    setValue((prev) => {
      let state = [ ...prev ];
      if (multi) {
        if (state.includes(option)) {
          state = state.filter((v) => v !== option);
        } else {
          state = [...state, option];
        }
      } else {
        state = [option];
      }
      setState((multi ? SelectOption.options<T, P>(state) : SelectOption.from(option)) as CurrentValue);
      onValueChange?.((multi ? SelectOption.options<T, P>(state) : SelectOption.from(option)) as CurrentValue);
      return (prev = state);
    });
  }, [multi, onValueChange]);

  if (!searchable && !onSave) {
    return loading ? (
      <ActivityIndicator />
    ) : render(filteredOptions, value, handleSelect);
  }

  return (
    <View 
      itemsCenter
      gap={ 12 }
      { ...props }>
      <React.Fragment>
        {searchable && (
          <TextInput
            width='100%'
            disabled={ loading }
            value={ filter }
            clearButtonMode='while-editing'
            onChangeText={ setFilter }
            label={ strings.action_search } />
        )}
        {loading ? (
          <ActivityIndicator />
        ) : render(filteredOptions, value, handleSelect)}
        {onSave && (
          <Button
            elevated
            p={ 8 }
            rounded
            haptic
            disabled={ loading }
            onPress={ () => onSave(state) }>
            {strings.action_save}
          </Button>
        )}
      </React.Fragment>
    </View>
  );
}