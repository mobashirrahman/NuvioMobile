/**
 * Video shim for web — HTML5 <video> + HLS.js for .m3u8 streams.
 * Replaces react-native-video when bundling for web/Electron.
 * 
 * This is a minimal shim to prevent crashes. The actual web video player
 * is implemented in src/components/player/VideoPlayer.web.tsx which uses
 * this same approach but with full UI controls.
 */

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

// Dynamically import HLS.js only on web
let Hls: any = null;
if (typeof window !== 'undefined') {
    // HLS.js loaded lazily to avoid issues in SSR
    import('hls.js').then(m => { Hls = m.default; });
}

interface VideoSource {
    uri?: string;
    headers?: Record<string, string>;
    type?: string;
}

interface VideoProps {
    source: VideoSource | { uri: string };
    style?: any;
    paused?: boolean;
    muted?: boolean;
    volume?: number;
    rate?: number;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'none';
    repeat?: boolean;
    onLoad?: (data: any) => void;
    onProgress?: (data: any) => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
    onBuffer?: (data: { isBuffering: boolean }) => void;
    onReadyForDisplay?: () => void;
    controls?: boolean;
    fullscreen?: boolean;
    onFullscreenPlayerWillPresent?: () => void;
    onFullscreenPlayerDidPresent?: () => void;
    onFullscreenPlayerWillDismiss?: () => void;
    onFullscreenPlayerDidDismiss?: () => void;
    subtitleStyle?: any;
    selectedTextTrack?: any;
    selectedVideoTrack?: any;
    bufferConfig?: any;
    [key: string]: any;
}

const Video = forwardRef<any, VideoProps>((props, ref) => {
    const {
        source,
        style,
        paused = false,
        muted = false,
        volume = 1,
        rate = 1,
        resizeMode = 'contain',
        repeat = false,
        onLoad,
        onProgress,
        onEnd,
        onError,
        onBuffer,
        onReadyForDisplay,
        controls = false,
    } = props;

    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<any>(null);

    const uri = typeof source === 'object' ? (source as VideoSource).uri : undefined;

    // Expose imperative methods (seek, pause, etc.)
    useImperativeHandle(ref, () => ({
        seek: (time: number) => {
            if (videoRef.current) videoRef.current.currentTime = time;
        },
        pause: () => videoRef.current?.pause(),
        resume: () => videoRef.current?.play(),
        presentFullscreenPlayer: () => videoRef.current?.requestFullscreen?.(),
        dismissFullscreenPlayer: () => document.exitFullscreen?.(),
    }));

    // Set up HLS or native video
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !uri) return;

        const isHLS = uri.includes('.m3u8') || uri.includes('manifest');

        if (isHLS && Hls && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90,
            });
            hlsRef.current = hls;
            hls.loadSource(uri);
            hls.attachMedia(video);
            hls.on('hlsError', (_: any, data: any) => {
                onError?.({ error: { localizedDescription: data.details } });
            });
        } else {
            video.src = uri;
        }

        return () => {
            hlsRef.current?.destroy();
            hlsRef.current = null;
        };
    }, [uri]);

    // Sync paused state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (paused) {
            video.pause();
        } else {
            video.play().catch(() => { }); // Autoplay may be blocked
        }
    }, [paused]);

    // Sync other props
    useEffect(() => { if (videoRef.current) videoRef.current.muted = muted; }, [muted]);
    useEffect(() => { if (videoRef.current) videoRef.current.volume = Math.max(0, Math.min(1, volume)); }, [volume]);
    useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = rate; }, [rate]);
    useEffect(() => { if (videoRef.current) videoRef.current.loop = repeat; }, [repeat]);

    const objectFitMap: Record<string, string> = {
        contain: 'contain',
        cover: 'cover',
        stretch: 'fill',
        none: 'none',
    };

    return (
        <View style={[{ backgroundColor: '#000' }, style]}>
            {/* @ts-ignore — web-only video element */}
            <video
                ref={videoRef}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: objectFitMap[resizeMode] || 'contain',
                    display: 'block',
                }}
                controls={controls}
                playsInline
                onLoadedMetadata={(e) => {
                    const v = e.currentTarget as HTMLVideoElement;
                    onLoad?.({ duration: v.duration, naturalSize: { width: v.videoWidth, height: v.videoHeight } });
                    onReadyForDisplay?.();
                }}
                onTimeUpdate={(e) => {
                    const v = e.currentTarget as HTMLVideoElement;
                    onProgress?.({
                        currentTime: v.currentTime,
                        playableDuration: v.duration,
                        seekableDuration: v.duration,
                    });
                }}
                onEnded={() => onEnd?.()}
                onError={(e) => onError?.({ error: { localizedDescription: 'Video error' } })}
                onWaiting={() => onBuffer?.({ isBuffering: true })}
                onCanPlay={() => onBuffer?.({ isBuffering: false })}
            />
        </View>
    );
});

Video.displayName = 'Video';

export default Video;
