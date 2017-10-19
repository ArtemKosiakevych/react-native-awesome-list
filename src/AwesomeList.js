import React from 'react'
import PropTypes from 'prop-types'
import {
  TouchableOpacity,
  Animated,
  View,
  Platform,
  LayoutAnimation,
  FlatList
} from 'react-native'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class AwesomeList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: props.data,
      scrollY: new Animated.Value(0),
    }
  }

  componentWillUnmount(){
    if (this.refs.list) {
      this.refs.list.getNode().scrollToOffset({ offset: 0, animated: false });
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({data: nextProps.data})
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    if (!this.props.renderAnimatingHeader) {
      return this.renderMainList()
    }
    const translateYContent = this.state.scrollY.interpolate({
      inputRange: [0, this.props.headerHeight],
      outputRange: [this.props.headerHeight, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={{flex: 1}}>
        <Animated.View style={{ flex: 1, transform: [{ translateY: Platform.OS === 'ios' ? translateYContent : 0 }] }}>
          {this.renderMainList()}
        </Animated.View>
        {this.renderHeader()}
        {this.props.renderAnimatingFooter && this.renderFooter()}
      </View>
    )
  }

  renderMainList(){
    const scrollYEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}],
      { useNativeDriver: true });
    return (
      <AnimatedFlatList
        onScroll={scrollYEvent}
        extraData={this.state}
        keyExtractor={item => item.id}
        scrollEventThrottle={16}
        {...this.props}
        contentContainerStyle={[
          {...this.props.contentContainerStyle},
          {paddingTop: Platform.OS === 'android' && this.props.renderAnimatingHeader ? this.props.headerHeight : null}]}
        ref="list"
        data={this.state.data}
        renderItem={ this.renderRow }
      />
    )
  }

  renderHeader() {
    const translateY = this.state.scrollY.interpolate({
      inputRange: [0, this.props.headerHeight, this.props.headerHeight * 1.5],
      outputRange: [0, -this.props.headerHeight / 1.5, -this.props.headerHeight],
      extrapolate: 'clamp',
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, this.props.headerHeight / 2, this.props.headerHeight * 1.5],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const scale = this.state.scrollY.interpolate({
      inputRange: [-50, 0],
      outputRange: [1.2, 1],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={[
        {position: 'absolute', width: '100%', height: this.props.headerHeight},
        { opacity: this.props.disableOpacityAnimation ? 1 : opacity },
        { transform: [
          { translateY },
          { scale: this.props.disableScaleAnimation ? 1 : scale }
        ]}
      ]}>
        {this.props.renderAnimatingHeader()}
      </Animated.View>
    )
  }

  renderFooter() {
    const translateY = this.state.scrollY.interpolate({
      inputRange: [0, this.props.headerHeight, this.props.headerHeight * 1.5],
      outputRange: [0, this.props.headerHeight / 1.5, this.props.headerHeight],
      extrapolate: 'clamp',
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, this.props.headerHeight / 2, this.props.headerHeight * 1.5],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const scale = this.state.scrollY.interpolate({
      inputRange: [-50, 0],
      outputRange: [1.2, 1],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={[
        {position: 'absolute', bottom: 0, right: 0, left: 0, height: this.props.headerHeight},
        { opacity: this.props.disableOpacityAnimation ? 1 : opacity },
        { transform: [
          { translateY },
          { scale: this.props.disableScaleAnimation ? 1 : scale }
        ]}
      ]}>
        {this.props.renderAnimatingFooter()}
      </Animated.View>
    )
  }

  renderRow = (rowData) => {
    if (rowData.item.type === 'group') {
      return this.renderGroup(rowData)
    } else if (rowData.item.type === 'subgroup') {
      return this.renderSubGroup(rowData)
    } else {
      return this.renderItemBlock(rowData)
    }
  }

  renderGroup = (rowData) => {
    let group = rowData.item
    return (
      <View>
        <TouchableOpacity onPress={()=>this.toggleGroup(rowData.index)}>
          {this.props.renderGroup && this.props.renderGroup(group)}
        </TouchableOpacity>
        {this.renderGroupItems(group, group.items)}
      </View>
    )
  }

  renderSubGroup = (rowData) => {
    let subGroup = rowData.item
    return (
      <View>
        <TouchableOpacity onPress={()=>this.toggleSubGroup(subGroup.id)}>
          {this.props.renderSubGroup && this.props.renderSubGroup(subGroup)}
        </TouchableOpacity>
        {this.renderGroupItems(subGroup, true)}
      </View>
    )
  }

  renderItemBlock = (data) => {
    if (!this.props.renderItem) {
      return null
    }
    return this.props.renderItem(data.item)
  }

  renderGroupBlock(data){
    let group = data.item
    return (
      <View>
        <TouchableOpacity onPress={()=>this.toggleGroup(data.index)}>
          {this.props.renderGroup(group)}
        </TouchableOpacity>
        {this.renderGroupItems(group)}
      </View>
    )
  }

  renderGroupItems(group, isSubgroup){
    if (group.expanded) {
      if (isSubgroup) {
        return (
          <AnimatedFlatList
            extraData={this.state}
            keyExtractor={item => item.id}
            renderItem={this.renderSubGroupItems}
            data={group.items}/>
        )
      } else {
        return (
          <AnimatedFlatList
            extraData={this.state}
            keyExtractor={item => item.id}
            renderItem={this.renderItemBlock}
            data={group.items}/>
        )
      }
    }
  }

  renderSubGroupItems = (data) => {
    let group = data.item
    return (
      <View>
        <TouchableOpacity onPress={()=>this.toggleSubGroup(group.id)}>
          {this.props.renderSubGroup && this.props.renderSubGroup(group)}
        </TouchableOpacity>
        {this.renderSubGroupChildren(group)}
      </View>
    )
  }

  renderSubGroupChildren(group){
    if (group.expanded) {
      return (
        <AnimatedFlatList
          {...this.props.childListProps}
          extraData={this.state}
          keyExtractor={item => item.id}
          renderItem={this.renderItemBlock}
          data={group.items}/>
      )
    }
  }

  toggleGroup(index){
    let data = this.state.data
    data[index].expanded = !data[index].expanded
    if (!data[index].expanded) {
      data[index].items.map((item) => {
        item.expanded = false
      })
    }
    if (this.props.toggleGroup) {
      this.props.toggleGroup(index, data[index].expanded)
    }
    this.setState({data})
  }

  toggleSubGroup(id){
    let data = this.state.data
    data.map((group) => {
      if (group.items) {
        group.items.map((subgroup)=>{
          if (subgroup.id === id) {
            subgroup.expanded = !subgroup.expanded
            if (this.props.toggleSubGroup) {
              this.props.toggleSubGroup(id, subgroup.expanded)
            }
          }
        })
      }
    })
    this.setState({data})
  }

}

AwesomeList.propTypes = {
  data: PropTypes.array.isRequired,
  contentContainerStyle: PropTypes.any,
  childListProps: PropTypes.object,
  renderItem: PropTypes.func,
  renderGroup: PropTypes.func,
  renderSubGroup: PropTypes.func,
  toggleGroup: PropTypes.func,
  toggleSubGroup: PropTypes.func,
  headerHeight: PropTypes.number,
  renderAnimatingHeader: PropTypes.func,
  renderAnimatingFooter: PropTypes.func,
  disableScaleAnimation: PropTypes.bool,
  disableOpacityAnimation: PropTypes.bool,
}

AwesomeList.defaultProps = {
  headerHeight: 100
}
module.exports = AwesomeList;
