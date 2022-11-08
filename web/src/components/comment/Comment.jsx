// eslint-disable-next-line operator-linebreak
import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Divider, Modal, notification, Popover, Typography } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { ReactReduxContext, useSelector } from 'react-redux'
import * as deleteCommentAPI from '../../api/comment'
import { commentSelectors } from '../../store/modules/comment'
import actions from '../../store/modules/comment/types'
import MarkDownView from '../markDownView'
import './styles.scss'

const convertToCheckList = (paser, comment) => {
  const doc = paser.parseFromString(comment, 'text/html')
  const checkAll = []
  const checkTrue = doc.querySelectorAll("[data-checked='true']")
  const checkFalse = doc.querySelectorAll("[data-checked='false']")
  Array.from(checkFalse).map((cl) => {
    const l = cl.getElementsByClassName('ql-indent-1')
    return Array.from(l).map((e) => e.textContent)
  }).map((cl) => {
    [...cl].map((e) => {
      checkAll.push({ name: e, state: false })
      return e
    })
    return cl
  })
  Array.from(checkTrue).map((cl) => {
    const l = cl.getElementsByClassName('ql-indent-1')
    return Array.from(l).map((e) => e.textContent)
  }).map((cl) => {
    [...cl].map((e) => {
      checkAll.push({ name: e, state: true })
      return e
    })
    return cl
  })
  return checkAll
}

function Comment(props) {
  const AVATAR_SIZE = 42
  const MAX_CHAR_PER_LINE = 300
  const [expanded, setExpanded] = useState(false)
  const [commentOverflow, setCommentOverflow] = useState(false)
  const { store } = useContext(ReactReduxContext)
  const [userId, setUserId] = useState(1)
  const [checklistChange, setChecklistChange] = useState([])
  const router = useRouter()
  // const classNames = (...classes) => classes.filter(Boolean).join(' ')
  const commentArray = useSelector((state) => commentSelectors.comments(state).toJS())

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    setUserId(store.getState().get('auth').get('user').get('id'))
    if (props.comment.content) {
      setCommentOverflow(props.comment.content.length > MAX_CHAR_PER_LINE)
    }
    const paser = new DOMParser()
    if (props.comment.new_description) {
      const clNew = convertToCheckList(paser, props.comment.new_description)
      const clOld = convertToCheckList(paser, props.comment.old_description)
      const checkList = clNew.filter((cl) => {
        const mappingEle = clOld.find((e) => e.name === cl.name)
        return mappingEle?.state !== cl.state
      })
      setChecklistChange(checkList)
    }
  }, [props.comment.content])

  const editComment = () => {
    props.parentCallBack(props)
  }

  const deleteComment = async () => {
    try {
      const comments = commentArray.filter((comment) => comment.id !== props.comment.id)

      const response = await deleteCommentAPI.deleteComment(props.comment.id)

      if (response.status === 200) {
        store.dispatch({
          type: actions.DELETE_COMMENT,
          payload: comments,
        })
        props.parentCallBack('delete')
        notification.open({
          icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
          duration: 3,
          message: '正常に削除されました',
          onClick: () => {},
        })
      }
      return comments
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      } else router.push('/error')
      return null
    }
  }
  const onDeleteClick = () => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: () => {
        deleteComment()
      },
      onCancel: () => {},
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }

  return (
    <>
      <div className="comment">
        <div className="flex flex-row ">
          <div>
            <Avatar
              className="mr-4 inline-block"
              size={AVATAR_SIZE}
              src={`${process.env.APP_URL}/api/avatar/${props.comment.author?.id}`}
            />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between">
              <div className="flex gap-4">
                <span className="comment__author">{props.comment.author?.name}</span>
                <span className="comment__time">
                  {moment(props.comment.created).format('YYYY/MM/DD HH:mm:ss')}
                </span>
              </div>
              <div className="mr-4" hidden={userId !== props.comment.author?.id}>
                {props.comment.content !== '<p></p>' && (
                  <EditTwoTone
                    className="border-none mx-1 text-2xl"
                    type="primary"
                    onClick={editComment}
                  />
                )}
                <DeleteTwoTone
                  className="border-none mx-1 text-2xl"
                  type="primary"
                  onClick={onDeleteClick}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col ">
                {/* status member change */}
                <div className="">
                  {props.comment.new_member_status?.length > 0 && (
                    <div className="flex">
                      <div className="old__status flex">
                        <p className="text-right" style={{ minWidth: '90px' }}>
                          {props.comment.member_name}
                          のステータスを編集：
                        </p>
                        <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                          {props.comment.old_member_status}
                        </Typography>
                      </div>
                      &rArr;
                      <div className="new__status">
                        <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                          {props.comment.new_member_status}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
                {/* status changed */}
                <div className="">
                  {(props.comment.new_status?.length > 0
                    || props.comment.old_status?.length > 0) && (
                    <div className="flex">
                      <div className="old__status flex">
                        <strong className="text-right" style={{ minWidth: '90px' }}>
                          ステータス：
                        </strong>
                        <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                          {props.comment.old_status}
                        </Typography>
                      </div>
                      &rArr;
                      <div className="new__status">
                        <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                          {props.comment.new_status}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
                {/* assignees changed */}
                <div className="">
                  {props.comment.new_assignees?.length !== 0
                  || props.comment.old_assignees?.length !== 0 ? (
                      <div className="flex">
                        <div className="old__assignees flex">
                          <strong className="text-right" style={{ minWidth: '90px' }}>
                          担当者：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic">
                            {props.comment.old_assignees.join(', ')}
                          </Typography>
                        </div>
                      &rArr;
                        <div className="new__assignees">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {props.comment.new_assignees.join(', ')}
                          </Typography>
                        </div>
                      </div>
                    ) : null}
                </div>
                {/* reviewers changed */}
                <div className="">
                  {props.comment.new_reviewers?.length !== 0
                  || props.comment.old_reviewers?.length !== 0 ? (
                      <div className="flex">
                        <div className="old__reviewers flex">
                          <strong className="text-right" style={{ minWidth: '90px' }}>
                            レビュアー：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic">
                            {props.comment.old_reviewers?.length !== 0
                              ? props.comment.old_reviewers?.join(', ')
                              : 'なし'}
                          </Typography>
                        </div>
                        &rArr;
                        <div className="new__assignees">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {props.comment.new_reviewers?.length !== 0
                              ? props.comment.new_reviewers?.join(', ')
                              : 'なし'}
                          </Typography>
                        </div>
                      </div>
                    ) : null}
                </div>
                {/* checklist changed */}
                <div className="">
                  {checklistChange.length > 0 && (
                    <div className="flex">
                      {
                        checklistChange.map((cl) => {
                          if (cl.state) {
                            return (
                              <>
                                ☐&rArr;✅&nbsp;&nbsp;&nbsp;&nbsp;
                                {cl.name}
                                <br />
                              </>
                            )
                          }
                          return (
                            <>
                              ✅&rArr;☐&nbsp;&nbsp;&nbsp;&nbsp;
                              {cl.name}
                              <br />
                            </>
                          )
                        })
                      }
                    </div>
                  )}
                </div>
                {(props.comment.new_status?.length > 0
                  || props.comment.new_assignees?.length > 0) && <div className="mb-5" />}
              </div>
              {/* <Divider className="mx-2 bg-gray-300" /> */}

              <div className="flex items-center overflow-hidden ">
                {/* comment content */}
                <div className="max-w-4xl  px-2 w-auto">
                  {/* <div>{props.comment.content}</div> */}
                  {props.comment.content && (
                    <div
                      className={
                        expanded
                          ? 'h-auto break-words'
                          : commentOverflow && 'h-10 break-words overflow-hidden'
                      }
                    >
                      <MarkDownView id="editor" source={props.comment.content} className="" />
                    </div>
                  )}
                </div>
                {/* edited time */}
                <div>
                  <Popover
                    content={moment(props.comment.lastEdit).format('YYYY/MM/DD HH:mm:ss')}
                    trigger="hover"
                  >
                    <span
                      className="comment__edited inline text-gray-500 italic  w-1/12"
                      hidden={!props.comment.edited}
                    >
                      編集済み
                    </span>
                  </Popover>
                </div>
                {/*   display more button */}
                {commentOverflow && (
                  <Button
                    className="block mx-2 xl:w-1/12 lg:w-2/12 see-more float-right"
                    onClick={toggleExpanded}
                  >
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {expanded ? '閉じる' : commentOverflow ? 'もっと読む' : ''}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <Divider className="mx-2 bg-gray-300" />
      </div>
    </>
  )
}
Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  parentCallBack: PropTypes.func.isRequired,
}

export default Comment
