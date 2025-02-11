import React from 'react';

import {
  DataTable as RNDataTable,
  DataTableCellProps as RNDataTableCellProps,
  DataTableHeaderProps as RNDataTableHeaderProps,
  DataTableProps as RNDataTableProps,
  DataTableRowProps as RNDataTableRowProps,
  DataTableTitleProps as RNDataTableTitleProps,
} from 'react-native-paper';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type DataTableProps = RNDataTableProps & ViewProps;

export function DataTable(props: DataTableProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <RNDataTable
      { ...props }
      style={ [theme.components.card, style, props.style] } />
  );

}

export type DataTableHeaderProps = RNDataTableHeaderProps & ViewProps;

export function DataTableHeader(props: DataTableHeaderProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <RNDataTable.Header
      { ...props }
      style={ [theme.components.card, style, props.style] } />
  );
}

export type DataTableTitleProps = RNDataTableTitleProps & ViewProps;

export function DataTableTitle(props: DataTableTitleProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <RNDataTable.Title
      { ...props }
      style={ [theme.components.card, style, props.style] } />
  );
}

export type DataTableRowProps = RNDataTableRowProps & ViewProps;

export function DataTableRow(props: DataTableRowProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <RNDataTable.Row
      { ...props }
      style={ [theme.components.card, style, props.style] } />
  );
}

export type DataTableCellProps = RNDataTableCellProps & ViewProps;

export function DataTableCell(props: DataTableCellProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <RNDataTable.Cell
      { ...props }
      style={ [theme.components.card, style, props.style] } />
  );
}