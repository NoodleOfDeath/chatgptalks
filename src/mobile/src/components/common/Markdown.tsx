import React from 'react';
import { Image, Linking } from 'react-native';

import ReactMarkdown from 'react-markdown';

import {
  Button,
  Divider,
  Text,
  View,
} from '~/components';
import { useStyles } from '~/hooks';

type Props = Omit<React.ComponentProps<typeof View>, 'children'> & {
  children: string;
  styles?: { [key in keyof JSX.IntrinsicElements]?: Omit<React.ComponentProps<typeof Text>['style'], 'children'>},
  textStyles?: Omit<React.ComponentProps<typeof Text>['style'], 'children'>;
};

export function Markdown({ 
  children, 
  styles,
  textStyles,
  ...props
}: Props) {
  const computedStyle = useStyles(props);
  const computedTextStyles = useStyles({ ...computedStyle, ...textStyles });
  return (
    <View style={ computedStyle }>
      <ReactMarkdown
        components={ { 
          a: (props) => (
            <Button onPress={ () => props.href && Linking.openURL(props.href) }>
              <Text { ...computedTextStyles } underline>{props.children}</Text>
            </Button>
          ),
          abbr: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          address: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          animate: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          animateMotion: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          animateTransform: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          area: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          article: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          aside: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          audio: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          b: (props) => <Text { ...computedTextStyles } bold>{props.children}</Text>,
          base: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          bdi: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          bdo: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          big: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          blockquote: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          body: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          br: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          button: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          canvas: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          caption: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          center: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          circle: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          cite: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          clipPath: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          code: (props) => <Text { ...computedTextStyles } code>{props.children}</Text>,
          col: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          colgroup: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          data: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          datalist: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          dd: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          defs: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          del: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          desc: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          details: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          dfn: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          dialog: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          div: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          dl: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          dt: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          ellipse: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          em: (props) => <Text { ...computedTextStyles } { ...styles?.em }>{props.children}</Text>,
          embed: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feBlend: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feColorMatrix: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feComponentTransfer: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feComposite: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feConvolveMatrix: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feDiffuseLighting: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feDisplacementMap: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feDistantLight: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feDropShadow: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feFlood: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feFuncA: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feFuncB: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feFuncG: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feFuncR: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feGaussianBlur: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feImage: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feMerge: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feMergeNode: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feMorphology: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feOffset: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          fePointLight: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feSpecularLighting: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feSpotLight: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feTile: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          feTurbulence: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          fieldset: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          figcaption: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          figure: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          filter: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          footer: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          foreignObject: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          form: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          g: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          h1: (props) => <Text { ...computedTextStyles } h1>{props.children}</Text>,
          h2: (props) => <Text { ...computedTextStyles } h2>{props.children}</Text>,
          h3: (props) => <Text { ...computedTextStyles } h3>{props.children}</Text>,
          h4: (props) => <Text { ...computedTextStyles } h4>{props.children}</Text>,
          h5: (props) => <Text { ...computedTextStyles } h5>{props.children}</Text>,
          h6: (props) => <Text { ...computedTextStyles } h6>{props.children}</Text>,
          head: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          header: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          hgroup: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          hr: () => <Divider />,
          html: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          i: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          iframe: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          image: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          img: (props) => (
            <Image
              source={ { uri: props.src } }
              style={ {
                alignSelf: 'center', aspectRatio: 1,  
                resizeMode: 'contain', width: props.width ?? '100%',
              } } />
          ),
          input: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          ins: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          kbd: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          keygen: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          label: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          legend: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          li: (props) => <Text { ...computedTextStyles }>{` • ${props.children}`}</Text>,
          line: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          linearGradient: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          link: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          main: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          map: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          mark: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          marker: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          mask: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          menu: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          menuitem: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          meta: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          metadata: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          meter: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          mpath: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          nav: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          noindex: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          noscript: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          object: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          ol: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          optgroup: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          option: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          output: (props) => <Text { ...computedTextStyles }>{props.children}</Text>, 
          p: (props) => <Text { ...computedTextStyles } mv={ 4 }>{props.children}</Text>,
          param: (props) => <Text { ...computedTextStyles }>{props.children}</Text>, 
          path: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          pattern: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          picture: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          polygon: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          polyline: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          pre: (props) => <Text { ...computedTextStyles } code>{props.children}</Text>,
          progress: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          q: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          radialGradient: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          rect: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          rp: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          rt: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          ruby: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          s: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          samp: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          script: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          section: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          select: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          slot: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          small: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          source: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          span: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          stop: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          strong: (props) => <Text { ...computedTextStyles } bold>{props.children}</Text>,
          style: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          sub: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          summary: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          sup: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          svg: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          switch: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          symbol: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          table: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          tbody: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          td: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          template: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          text: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          textPath: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          textarea: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          tfoot: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          th: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          thead: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          time: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          title: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          tr: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          track: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          tspan: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          u: (props) => <Text { ...computedTextStyles } underline>{props.children}</Text>,
          ul: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          use: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          'var': (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          video: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          view: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          wbr: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
          webview: (props) => <Text { ...computedTextStyles }>{props.children}</Text>,
        } }
        skipHtml>
        {children}
      </ReactMarkdown>
    </View>
  );
}
