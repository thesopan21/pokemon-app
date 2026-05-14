/**
 * Skeleton Loader Component
 * Loading skeleton for displaying while content is being fetched
 */

import { BORDER_RADIUS, COLORS, SPACING } from '@/theme';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  animated?: boolean;
}

const Skeleton = React.forwardRef<View, SkeletonProps>(
  (
    {
      width = '100%',
      height = 16,
      borderRadius = BORDER_RADIUS.md,
      style,
      animated = true,
    },
    ref
  ) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      if (!animated) return;

      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      animation.start();

      return () => animation.stop();
    }, [opacity, animated]);

    const styles = createStyles();

    return (
      <Animated.View
        ref={ref}
        style={[
          styles.skeleton,
          {
            width,
            height,
            borderRadius,
            opacity: animated ? opacity : 0.5,
          },
          style,
        ]}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

const createStyles = () =>
  StyleSheet.create({
    skeleton: {
      backgroundColor: COLORS.skeleton,
    },
  });

export default Skeleton;

/**
 * Skeleton Grid Component
 * Display grid of skeleton loaders
 */
export interface SkeletonGridProps {
  count?: number;
  columns?: number;
  itemHeight?: number;
  gap?: number;
}

export const SkeletonGrid = React.forwardRef<View, SkeletonGridProps>(
  (
    {
      count = 6,
      columns = 2,
      itemHeight = 180,
      gap = SPACING.md,
    },
    ref
  ) => {
    const styles = createStyles();

    return (
      <View
        ref={ref}
        style={[
          styles.grid,
          {
            gap,
            marginHorizontal: -gap / 2,
          },
        ]}
      >
        {Array.from({ length: count }).map((_, index) => (
          <View
            key={index}
            style={{
              flex: 1 / columns,
              maxWidth: `${100 / columns}%`,
              paddingHorizontal: gap / 2,
              marginBottom: gap,
            }}
          >
            <Skeleton width="100%" height={itemHeight} borderRadius={BORDER_RADIUS.lg} />
          </View>
        ))}
      </View>
    );
  }
);

SkeletonGrid.displayName = 'SkeletonGrid';

/**
 * Skeleton List Component
 * Display list of skeleton loaders
 */
export interface SkeletonListProps {
  count?: number;
  itemHeight?: number;
  gap?: number;
}

export const SkeletonList = React.forwardRef<View, SkeletonListProps>(
  (
    {
      count = 6,
      itemHeight = 80,
      gap = SPACING.md,
    },
    ref
  ) => {
    const styles = createStyles();

    return (
      <View
        ref={ref}
        style={[
          styles.list,
          {
            gap,
          },
        ]}
      >
        {Array.from({ length: count }).map((_, index) => (
          <View
            key={index}
            style={{
              marginBottom: gap,
            }}
          >
            <Skeleton width="100%" height={itemHeight} borderRadius={BORDER_RADIUS.lg} />
          </View>
        ))}
      </View>
    );
  }
);

SkeletonList.displayName = 'SkeletonList';
