import React from 'react'
import './styles.scss'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Row, Col, Avatar } from 'antd'
import { getMember } from '~/api/member-detail'

class MemberDetailTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      member: {
        id: 0,
        avatar: '',
        fullName: '',
        email: '',
        role: 0,
        phoneNumber: '',
        categories: [],
        chatworkID: '',
        assignedJF: [],
      },
      listCate: [],
      listJF: [],
    }
  }

  componentDidMount() {
    // const search = window.location.search
    // const params = new URLSearchParams(search)
    const id = parseInt(this.props.router.query.id, 10)
    getMember(id)
      .then((res) => {
        const member = res.data
        this.setState(
          {
            member: {
              id: member.id,
              email: member.email,
              fullName: member.name,
              avatar: member.avatar,
              role: member.role,
              chatworkID: member.chatwork_id,
              phoneNumber: member.phone_number,
            },
          },
          () => {
            this.setID(id) // set ID and Role after setState
          },
        )

        const listJobfair = [...new Map(res.data.schedules.map((item) => [item.jobfair_id, item])).values()]
        this.setState({
          listJF: listJobfair.map((element) => (
            <div className="assigned-jf border-none block mx-auto">
              <a href={`/jobfairs/${element.jobfair_id}/jf-toppage`}>
                <div className="border-none inline-block mr-2">
                  {element.jobfair.name}
                </div>
              </a>
            </div>
          )),
        })
        const categorires = res.data.categories
        this.setState({
          listCate: categorires.map((element) => (
            <div className="category-name border-none block mx-auto">
              {element.category_name}
            </div>
          )),
        })
      })
      .catch((error) => {
        if (error.response.status === 404) {
          window.location.href = '/404'
        }
      })
  }

  setID(id) {
    this.props.setID(id)
  }

  render() {
    return (
      <div className="flex css_all items-center justify-center">
        {this.state.member.avatar ? (
          <Avatar
            size={150}
            style={{
              lineHeight: '100px',
              marginRight: '60px',
            }}
            src={`/api/avatar/${this.state.member.id}`}
          />
        ) : (
          <Avatar
            size={150}
            style={{
              backgroundColor: '#FFD802',
              lineHeight: '100px',
              marginRight: '60px',
            }}
            src="../images/avatars/default.jpg"
          />
        )}

        <div className="member_table py-3" style={{ width: '650px' }}>
          <Row>
            <Col span={7} className="text-right font-bold py-3 pl-5">
              フルネーム
            </Col>
            <Col offset={1} className="py-3 text-left ">
              {this.state.member.fullName}
            </Col>
          </Row>
          <Row>
            <Col span={7} className="text-right font-bold py-3 pl-5">
              メールアドレス
            </Col>
            <Col offset={1} className="py-3 text-left">
              {this.state.member.email}
            </Col>
          </Row>
          <Row>
            <Col span={7} className="text-right font-bold py-3 pl-5">
              カテゴリー
            </Col>
            <Col offset={1} className="py-3 text-left">
              {this.state.listCate}
            </Col>
          </Row>
          <Row>
            <Col span={7} className="text-right font-bold py-3 pl-5">
              アサインされたJF
            </Col>
            <Col offset={1} className="py-3 text-left">
              {this.state.listJF}
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
export default withRouter(MemberDetailTable)
MemberDetailTable.propTypes = {
  router: PropTypes.any,
  setID: PropTypes.func,
}
MemberDetailTable.defaultProps = {
  router: null,
  setID: null,
}
