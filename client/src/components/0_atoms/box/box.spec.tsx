import * as React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({ adapter: new Adapter() })

import { Box } from './box'

it('should render a Box', () => {
  const component = shallow(<Box>Test</Box>)
  expect(component).toBeTruthy()
  expect(component.html()).toContain('Test')
})
