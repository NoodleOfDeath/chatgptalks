import { ViewStyle } from 'react-native';

export const AVAILABLE_FONTS = [
  'Alegreya', 
  'DM Sans',
  'Faustina',
  'Lato',
  'Manuale',
  'Roboto',
];

export const FONT_SIZES = {
  body1: 18,
  body2: 15,
  caption: 14,
  h1: 36,
  h2: 32,
  h3: 28,
  h4: 26,
  h5: 24,
  h6: 22,
  subscript: 10,
  subtitle1: 20,
  subtitle2: 19,
} as const;

export type TextStyleProps = { [key in keyof typeof FONT_SIZES]?: boolean } & {
  // text styling
  color?: string;
  textCenter?: boolean;
  textLeft?: boolean;
  textRight?: boolean;
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};
 
export const TEXT_STYLE_PROPS = ['color', 'textCenter', 'textLeft', 'textRight', 'fontFamily', 'fontSize', 'bold', 'italic', 'underline', 'code', ...Object.keys(FONT_SIZES)];

export type ViewStyleProps<Style extends ViewStyle = ViewStyle> = {
  // position
  absolute?: boolean;
  relative?: boolean;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  // dimensions
  aspectRatio?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  // flexbox
  flex?: number;
  flexWrap?: 'wrap' | 'nowrap';
  flexGrow?: number | boolean;
  flexRow?: boolean;
  flexRowReverse?: boolean;
  flexColumn?: boolean;
  flexColumnReverse?: boolean;
  gap?: number;
  rowGap?: number;
  colGap?: number;
  col?: boolean;
  row?: boolean;
  alignCenter?: boolean;
  alignStart?: boolean;
  alignEnd?: boolean;
  justifyCenter?: boolean;
  justifyStart?: boolean;
  justifyEnd?: boolean;
  justifyEvenly?: boolean;
  justifySpaced?: boolean;
  inactive?: boolean;
  // margins
  m?: number | string;
  mh?: number | string;
  mv?: number | string;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
  // padding
  p?: number | string;
  ph?: number | string;
  pv?: number | string;
  pt?: number | string;
  pb?: number | string;
  pl?: number | string;
  pr?: number | string;
  // appearance
  borderWidth?: number;
  borderColor?: string;
  bg?: string;
  outlined?: boolean | string | number | [string, number];
  opacity?: number;
  selectable?: boolean;
  contained?: boolean;
  rounded?: boolean;
  overflow?: string;
  zIndex?: number;
  // other
  style?: Style;
};

export const VIEW_STYLE_PROPS = ['position', 'top', 'bottom', 'left', 'right', 'aspectRatio', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'flex', 'flexWrap', 'flexGrow', 'flexDirection', 'gap', 'rowGap', 'columnGap', 'col', 'row', 'backgroundColor', 'opacity', 'borderColor', 'borderRadius', 'borderWidth', 'zIndex', 'style'];

export type Stylable<Style extends ViewStyle = ViewStyle> = 
TextStyleProps & ViewStyleProps<Style>;