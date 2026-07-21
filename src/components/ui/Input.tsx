import { useState } from 'react';
import { TextInput, View, type TextInputProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme/tokens';
import { Txt } from './Txt';

type Props = TextInputProps & {
  /** Optional label rendered above the field. */
  label?: string;
  /** Left adornment (icon). */
  adorn?: React.ReactNode;
  /** Right adornment (icon / button). */
  rightAdorn?: React.ReactNode;
  mono?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

const authLbl = {
  fontSize: 12.5,
  color: colors.gray,
  marginBottom: 8,
  marginLeft: 4,
} as const;

export function Input({ label, adorn, rightAdorn, mono, containerStyle, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={containerStyle}>
      {label ? (
        <Txt w={700} style={authLbl}>
          {label}
        </Txt>
      ) : null}
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        {adorn ? (
          <View style={{ position: 'absolute', left: 15, zIndex: 1 }}>{adorn}</View>
        ) : null}
        <TextInput
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={colors.textDim}
          style={[
            {
              width: '100%',
              backgroundColor: colors.panel2,
              borderWidth: 1,
              borderColor: focused ? colors.limeLine : colors.hairline,
              borderRadius: 14,
              color: colors.text,
              fontFamily: mono ? fonts.mono : fonts.medium,
              fontSize: 15,
              paddingVertical: 15,
              paddingHorizontal: 16,
              paddingLeft: adorn ? 46 : 16,
              paddingRight: rightAdorn ? 50 : 16,
            },
            style,
          ]}
        />
        {rightAdorn ? (
          <View style={{ position: 'absolute', right: 10, zIndex: 1 }}>{rightAdorn}</View>
        ) : null}
      </View>
    </View>
  );
}
