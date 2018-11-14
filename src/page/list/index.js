import React from 'react'
import { Table, Modal, Button, Form, Input } from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item;

function mapStateToProps(state){
    console.log(state)
    return {
        cardsList: state.cards.cardsList,
        cardsLoading: state.loading.effects['cards/queryList']
    }
}

class List extends React.Component { 
    state = {
        visible: false
    }

    showModal = () => {
        console.log('show modal')
        this.setState({
            visible: true
        })
    }
    handleOk = () => {
        const { dispatch, form: { validateFields }} = this.props;

        validateFields((err, values) => {
            console.log('values', values)
            if(!err){
                dispatch({
                    type: 'cards/addOne',
                    payload: values
                })
                this.setState({
                    visible: false
                })
            }
        })
        
    }

    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    columns = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '描述',
            dataIndex: 'desc',
        },
        {
            title: '链接',
            dataIndex: 'url',
        },
    ];

    componentDidMount(){
        this.props.dispatch({
            type: 'cards/queryList'
        })
    }
    render(){
        const { cardsList, cardsLoading } = this.props;
        const { form: { getFieldDecorator } } = this.props
        return (
            <div>
                <Table columns={this.columns} dataSource={cardsList} loading={cardsLoading} rowKey="id" />

                <Button onClick={this.showModal}>新建</Button>
                <Modal title="新建记录" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form>
                        <FormItem label="名称">
                            {getFieldDecorator('name', {
                                rules: [{ required: true }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="描述">
                            {getFieldDecorator('desc')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="链接">
                            {getFieldDecorator('url', {
                                rules: [{ type: 'url' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Form.create()(List));