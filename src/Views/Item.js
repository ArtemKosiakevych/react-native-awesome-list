// @flow

import * as React from 'react'
import { Text } from 'react-native'

type Props = {
  renderItem: (Object) => React.Element<*>,
  rowData: Object
}
const Item = ({
  renderItem,
  rowData,
}: Props) => {
  if (renderItem && rowData) {
    return renderItem(rowData.item)
  }
  return <Text>Item {rowData && rowData.index + 1}</Text>
}
export default Item
