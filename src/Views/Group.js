// @flow

import * as React from 'react'
import _ from 'lodash'
import { Text, View, TouchableOpacity } from 'react-native'

type Props = {
  onPress: (number) => number,
  renderGroup: (Object) => React.Element<*>,
  renderGroupItems: (Object, Array<Object>) => React.Element<*>,
  groupData: Object,
  type: string,
}

const Group = ({
  onPress,
  renderGroup,
  groupData,
  renderGroupItems,
  type,
}: Props) => {
  const group = _.get(groupData, 'item')
  const index = _.get(groupData, 'index')
  const onPressGroup = type === 'subgroup' ? () => onPress(group.id) : () => onPress(index)
  const isSubGroup = _.get(group, 'items[0].type', '') === 'subgroup'
  return (
    <View>
      <TouchableOpacity onPress={onPressGroup}>
        {renderGroup && renderGroup(group) || <Text>Group {index}</Text>}
      </TouchableOpacity>
      {renderGroupItems(group, isSubGroup)}
    </View>
  )
}

export default Group
