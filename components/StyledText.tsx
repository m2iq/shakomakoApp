import { Text, TextProps } from './Themed';

export function MyText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily:'Tajawal' }]} />;
}
