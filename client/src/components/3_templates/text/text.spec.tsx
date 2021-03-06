import * as React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({ adapter: new Adapter() })

import { Text } from './text'

it('should render a Text', () => {
  const component = shallow(<Text />)
  expect(component).toBeTruthy()
})
