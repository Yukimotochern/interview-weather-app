import React from 'react'
import { Input, Button, Form, Col, Row } from 'antd'
import { getLocationAction } from '../../redux/location/locationSlice'
import { useDispatch } from 'react-redux'

export default function WeatherSearchBar() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const onSearch = (values: { city: string; country: string }) => {
    dispatch(getLocationAction(values))
  }

  const onReset = () => {
    form.resetFields()
  }
  return (
    <Form form={form} onFinish={onSearch} requiredMark={false}>
      <Row gutter={28}>
        <Col xs={24} sm={12} md={10} lg={8} xl={7} xxl={7}>
          <Form.Item
            name='city'
            label='City'
            rules={[
              {
                required: true,
                message: 'Please enter a city name.',
              },
            ]}
          >
            <Input size='small' placeholder='Enter a city to search weather' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={9} lg={8} xl={7} xxl={7}>
          <Form.Item name='country' label='Country'>
            <Input size='small' placeholder='Enter a country' />
          </Form.Item>
        </Col>
        <Col xs={4} sm={3} md={2} lg={2} xl={2} xxl={2}>
          <Form.Item>
            <Button size='small' type='primary' htmlType='submit'>
              Search
            </Button>
          </Form.Item>
        </Col>
        <Col xs={4} sm={3} md={2} lg={2} xl={2} xxl={2}>
          <Form.Item>
            <Button size='small' type='primary' onClick={onReset}>
              Clear
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
