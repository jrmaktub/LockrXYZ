import { router } from 'expo-router';
import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icons } from '@/components/icons';
import { colors } from '@/theme/tokens';
import { Txt } from './Txt';

/** Full-bleed screen background (app bg-1). */
export function ScreenContainer({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flex: 1, backgroundColor: colors.bg1 }, style]}>{children}</View>;
}

/** Top app bar for sub-screens (back arrow + title + optional sub/right). */
export function AppBar({
  title,
  sub,
  right,
  onBack,
  hideBack,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  hideBack?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.hairline,
        backgroundColor: colors.bg1,
      }}
    >
      {!hideBack && (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 13,
            backgroundColor: colors.panel2,
            borderWidth: 1,
            borderColor: colors.hairline,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Icons.back size={20} color={colors.text} />
        </Pressable>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt w={700} style={{ fontSize: 19, letterSpacing: -0.4 }}>
          {title}
        </Txt>
        {sub ? (
          <Txt w={500} style={{ fontSize: 12.5, color: colors.gray, marginTop: 1 }}>
            {sub}
          </Txt>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** Scrollable screen body with consistent padding + tab clearance. */
export function ScreenBody({
  children,
  pad = 20,
  bottomPad = 28,
  style,
}: {
  children: React.ReactNode;
  pad?: number;
  bottomPad?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[{ padding: pad, paddingBottom: bottomPad }, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
    >
      {children}
    </ScrollView>
  );
}
