/**
 * FastImage shim for web — renders a standard <img> with lazy loading,
 * fade-in animation, and compatible prop interface.
 */

import React, { useState } from 'react';
import { View, StyleSheet, StyleProp, ImageStyle, ViewStyle } from 'react-native';

// Match FastImage's priority and resize constants
const Priority = { low: 'low', normal: 'normal', high: 'high' };
const ResizeMode = {
    contain: 'contain' as const,
    cover: 'cover' as const,
    stretch: 'fill' as const,
    center: 'none' as const,
};
const cacheControl = { immutable: 'immutable', web: 'web', cacheOnly: 'cacheOnly' };

type FastImageSource = {
    uri?: string;
    headers?: Record<string, string>;
    priority?: string;
    cache?: string;
};

interface FastImageProps {
    source: FastImageSource | number;
    style?: StyleProp<ImageStyle | ViewStyle>;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
    onLoad?: () => void;
    onError?: (e: any) => void;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    tintColor?: string;
    fallback?: boolean;
    children?: React.ReactNode;
    defaultSource?: any;
    [key: string]: any;
}

const FastImage: React.FC<FastImageProps> & {
    priority: typeof Priority;
    resizeMode: typeof ResizeMode;
    cacheControl: typeof cacheControl;
} = ({
    source,
    style,
    resizeMode = 'cover',
    onLoad,
    onError,
    onLoadStart,
    onLoadEnd,
    children,
    tintColor,
    ...rest
}) => {
        const [loaded, setLoaded] = useState(false);

        const uri = typeof source === 'object' && source !== null
            ? (source as FastImageSource).uri
            : undefined;

        const objectFitMap: Record<string, string> = {
            contain: 'contain',
            cover: 'cover',
            stretch: 'fill',
            center: 'none',
        };

        const flatStyle = StyleSheet.flatten(style as any) || {};

        const containerStyle: React.CSSProperties = {
            position: 'relative',
            overflow: 'hidden',
            width: (flatStyle as any).width,
            height: (flatStyle as any).height,
            borderRadius: (flatStyle as any).borderRadius,
            backgroundColor: (flatStyle as any).backgroundColor,
        };

        const imgStyle: React.CSSProperties = {
            width: '100%',
            height: '100%',
            objectFit: (objectFitMap[resizeMode] || 'cover') as any,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.2s ease',
            filter: tintColor ? `drop-shadow(0 0 0 ${tintColor})` : undefined,
        };

        return (
            <View style={style as any} {...rest}>
                {uri ? (
                    // @ts-ignore — web-only img element
                    <img
                        src={uri}
                        style={imgStyle}
                        loading="lazy"
                        onLoadStart={onLoadStart}
                        onLoad={() => { setLoaded(true); onLoad?.(); onLoadEnd?.(); }}
                        onError={(e) => { onError?.(e); onLoadEnd?.(); }}
                        alt=""
                        draggable={false}
                    />
                ) : null}
                {children}
            </View>
        );
    };

FastImage.priority = Priority;
FastImage.resizeMode = ResizeMode;
FastImage.cacheControl = cacheControl;

export { FastImage };
export default FastImage;
