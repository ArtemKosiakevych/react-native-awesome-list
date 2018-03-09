// @flow

import * as React from 'react'
import { Animated } from 'react-native'
import styles from '../styles'

type Props = {
  scrollY?: any,
  headerHeight?: number,
  disableOpacityAnimation?: boolean,
  disableScaleAnimation?: boolean,
  renderAnimatingHeader?: () => React.Element<*>
}
export default class Header extends React.Component<Props> {
  static defaultProps = {
    headerHeight: 100,
  };

  render() {
    const {
      scrollY,
      headerHeight,
      disableOpacityAnimation,
      disableScaleAnimation,
      renderAnimatingHeader,
    } = this.props

    const translateY = scrollY && scrollY.interpolate({
      inputRange: [0, headerHeight, headerHeight * 1.5],
      outputRange: [0, -headerHeight / 1.5, -headerHeight],
      extrapolate: 'clamp',
    })
    const opacity = scrollY && scrollY.interpolate({
      inputRange: [0, headerHeight / 2, headerHeight * 1.5],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    })
    const scale = scrollY && scrollY.interpolate({
      inputRange: [-50, 0],
      outputRange: [1.2, 1],
      extrapolate: 'clamp',
    })
    const animStyle = {
      height: headerHeight,
      opacity: disableOpacityAnimation ? 1 : opacity,
      transform: [
        { translateY },
        { scale: disableScaleAnimation ? 1 : scale },
      ],
    }
    return (
      <Animated.View style={[styles.header, animStyle]}>
        {renderAnimatingHeader && renderAnimatingHeader()}
      </Animated.View>
    )
  }
}
