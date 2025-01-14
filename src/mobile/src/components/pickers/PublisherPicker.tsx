import React from 'react';

import { 
  ChannelIcon,
  ChildlessViewProps,
  TablePicker,
} from '~/components';
import { StorageContext } from '~/core';

export type PublisherPickerProps = ChildlessViewProps & {
  onValueChange?: (publishers?: string[]) => void;
};

export const PublisherPicker = React.forwardRef(function PublisherPicker(props: PublisherPickerProps, ref: React.ForwardedRef<{ value: string[] }>) {
  const { followedPublishers, publishers } = React.useContext(StorageContext);
  const [selectedPublishers, setSelectedPublishers] = React.useState<string[]>(Object.keys({ ...followedPublishers }));
  const options = React.useMemo(() => Object.values({ ...publishers }).map((publisher) => ({
    icon: <ChannelIcon publisher={ publisher } />,
    label: publisher.displayName,
    value: publisher.name,
  })), [publishers]);
  React.useImperativeHandle(ref, React.useCallback(() => ({ value: selectedPublishers }), [selectedPublishers]));
  return (
    <TablePicker
      { ...props }
      options={ options }
      searchable
      multi
      initialValue={ selectedPublishers }
      onValueChange={ (publishers) => { 
        setSelectedPublishers(publishers ?? []);
        props.onValueChange?.(publishers);
      } } />
  );
}) as React.ForwardRefExoticComponent<PublisherPickerProps & React.RefAttributes<{ value: string[] }>>;