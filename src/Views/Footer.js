// @flow

import * as React from 'react'
import { Animated } from 'react-native'
import styles from '../styles'

type Props = {
  scrollY: any,
  footerHeight?: number,
  headerHeight?: number,
  disableOpacityAnimation?: boolean,
  disableScaleAnimation?: boolean,
  renderAnimatingHeader?: () => React.Element<*>,
  renderAnimatingFooter?: () => React.Element<*>,
}
export default class Footer extends React.Component<Props> {
  static defaultProps = {
    footerHeight: 100,
  };

  render() {
    const {
      scrollY,
      footerHeight,
      disableOpacityAnimation,
      disableScaleAnimation,
      renderAnimatingFooter,
    } = this.props

    const translateY = scrollY.interpolate({
      inputRange: [0, footerHeight, footerHeight * 1.5],
      outputRange: [0, footerHeight / 1.5, footerHeight],
      extrapolate: 'clamp',
    })
    const opacity = scrollY.interpolate({
      inputRange: [0, footerHeight / 2, footerHeight * 1.5],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    })
    const scale = scrollY.interpolate({
      inputRange: [-50, 0],
      outputRange: [1.2, 1],
      extrapolate: 'clamp',
    })
    const animStyle = {
      height: footerHeight,
      opacity: disableOpacityAnimation ? 1 : opacity,
      transform: [
        { translateY },
        { scale: disableScaleAnimation ? 1 : scale },
      ],
    }
    return (
      <Animated.View style={[styles.footer, animStyle]}>
        {renderAnimatingFooter && renderAnimatingFooter()}
      </Animated.View>
    )
  }
}
