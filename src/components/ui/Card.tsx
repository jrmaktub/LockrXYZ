import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '@/theme/tokens';

/** Base surface card: panel bg + hairline border + md radius. */
export function Card({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.panel,
          borderWidth: 1,
          borderColor: colors.hairline,
          borderRadius: radii.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
