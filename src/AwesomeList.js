import * as React from 'react'
import {
  Animated,
  View,
  LayoutAnimation,
} from 'react-native'

import Header from './Views/Header'
import Footer from './Views/Footer'
import List from './Views/List'
import Item from './Views/Item'
import Group from './Views/Group'
import styles from './styles'

type Props = {
  data: Array,
  childListProps: any,
  renderItem: () => React.Element<*>,
  renderGroup: () => React.Element<*>,
  renderSubGroup: () => React.Element<*>,
  toggleGroup: () => number,
  toggleSubGroup: () => number,
  headerHeight: number,
  footerHeight: number,
  renderAnimatingHeader: () => React.Element<*>,
  renderAnimatingFooter: () => React.Element<*>,
  disableScaleAnimation: boolean,
  disableOpacityAnimation: boolean,
}

export default class AwesomeList extends React.Component<Props> {
  static defaultProps = {
    headerHeight: 100,
    footerHeight: 100,
  };

  constructor(props) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0),
    }
  }

  /* eslint-disable class-methods-use-this */
  componentDidUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  render() {
    return (
      <View style={styles.fill}>
        {this.renderMainList()}
        {this.props.renderAnimatingHeader && this.renderHeader()}
        {this.props.renderAnimatingFooter && this.renderFooter()}
      </View>
    )
  }

  renderMainList() {
    return (
      <List
        scrollY={this.state.scrollY}
        {...this.props}
        renderItem={this.renderRow}
      />
    )
  }

  renderHeader() {
    return (
      <Header
        headerHeight={this.props.headerHeight}
        scrollY={this.state.scrollY}
        disableOpacityAnimation={this.props.disableOpacityAnimation}
        disableScaleAnimation={this.props.disableScaleAnimation}
        renderAnimatingHeader={this.props.renderAnimatingHeader}
      />
    )
  }

  renderFooter() {
    return (
      <Footer
        footerHeight={this.props.footerHeight}
        scrollY={this.state.scrollY}
        disableOpacityAnimation={this.props.disableOpacityAnimation}
        disableScaleAnimation={this.props.disableScaleAnimation}
        renderAnimatingFooter={this.props.renderAnimatingFooter}
      />
    )
  }

  renderRow = (rowData) => {
    if (rowData.item.type === 'group') {
      return this.renderGroup(rowData)
    } else if (rowData.item.type === 'subgroup') {
      return this.renderSubGroup(rowData)
    }
    return this.renderItemBlock(rowData)
  }

  renderItemBlock = rowData => <Item renderItem={this.props.renderItem} rowData={rowData} />

  renderGroup = (groupData) => {
    return (
      <Group
        groupData={groupData}
        onPress={this.toggleGroup}
        renderGroup={this.props.renderGroup}
        renderGroupItems={this.renderGroupItems}
      />
    )
  }

  renderSubGroup = (subGroupData) => {
    return (
      <Group
        groupData={subGroupData}
        onPress={this.toggleSubGroup}
        renderGroup={this.props.renderGroup}
        renderGroupItems={this.renderGroupItems}
      />
    )
  }


  renderGroupItems = (group, isSubgroup) => {
    if (group.expanded) {
      return (
        <List
          extraData={this.state}
          keyExtractor={(item, index) => (item.id || index)}
          renderItem={isSubgroup ? this.renderSubGroupItems : this.renderItemBlock}
          data={group.items}
        />
      )
    }
  }

  renderSubGroupItems = (subGroupData) => {
    return (
      <Group
        type={'subgroup'}
        groupData={subGroupData}
        onPress={this.toggleSubGroup}
        renderGroup={this.props.renderSubGroup}
        renderGroupItems={this.renderSubGroupChildren}
      />
    )
  }

  renderSubGroupChildren = (group) => {
    if (group.expanded) {
      return (
        <List
          {...this.props.childListProps}
          extraData={this.props}
          keyExtractor={(item, index) => (item.id || index)}
          renderItem={this.renderItemBlock}
          data={group.items}
        />
      )
    }
  }

  toggleGroup = (index) => {
    const { data, toggleGroup } = this.props
    data[index].expanded = !data[index].expanded
    if (!data[index].expanded) {
      data[index].items.map((item) => {
        item.expanded = false
      })
    }
    if (toggleGroup != null) {
      toggleGroup(index, data[index].expanded)
    }
    this.forceUpdate()
  }

  toggleSubGroup = (id) => {
    const { data, toggleSubGroup } = this.props
    data.map((group) => {
      if (group.items) {
        group.items.map((subgroup) => {
          if (subgroup.id === id) {
            subgroup.expanded = !subgroup.expanded
            if (toggleSubGroup != null) {
              toggleSubGroup(id, subgroup.expanded)
            }
          }
        })
      }
    })
    this.setState({ data })
  }
}
