/**
 * Blur shim for web — uses CSS backdrop-filter.
 * Replaces expo-blur and @react-native-community/blur on web.
 */

import React from 'react';
import { View } from 'react-native';

interface BlurViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default' | 'extraLight' | 'prominent';
    blurType?: 'xlight' | 'light' | 'dark' | 'extraDark' | 'chromeMaterial';
    blurAmount?: number;
    style?: any;
    children?: React.ReactNode;
    [key: string]: any;
}

export const BlurView: React.FC<BlurViewProps> = ({
    intensity = 50,
    blurAmount = 10,
    tint = 'dark',
    blurType,
    style,
    children,
    ...rest
}) => {
    const blur = blurAmount || Math.round(intensity / 10);
    const isDark = tint === 'dark' || blurType === 'dark' || blurType === 'extraDark';
    const bgColor = isDark
        ? `rgba(0, 0, 0, ${Math.min(0.6, intensity / 100)})`
        : `rgba(255, 255, 255, ${Math.min(0.6, intensity / 100)})`;

    return (
        <View
            style={[
                style,
                {
                    // @ts-ignore — web-only CSS property
                    backdropFilter: `blur(${blur}px)`,
                    WebkitBackdropFilter: `blur(${blur}px)`,
                    backgroundColor: bgColor,
                },
            ]}
            {...rest}
        >
            {children}
        </View>
    );
};

export default BlurView;
