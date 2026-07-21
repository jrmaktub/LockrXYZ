import { View } from 'react-native';

import { colors, limeGlowSm } from '@/theme/tokens';

export function Toggle({ on }: { on: boolean }) {
  return (
    <View
      style={[
        {
          width: 46,
          height: 28,
          borderRadius: 9999,
          backgroundColor: on ? colors.lime : colors.panel3,
          justifyContent: 'center',
        },
        on ? limeGlowSm : null,
      ]}
    >
      <View
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 21 : 3,
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: on ? colors.onLime : colors.cream,
        }}
      />
    </View>
  );
}
