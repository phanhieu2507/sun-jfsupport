/* eslint-disable no-nested-ternary */
import { Divider, List, Avatar, Button, Typography, Tooltip, Card } from 'antd'
import React, { useEffect, useState } from 'react'
import TimeAgo from 'react-timeago'
import PropTypes from 'prop-types'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
// import Link from 'next/link'
import { useRouter } from 'next/router'
import { getJobfairComment } from '../../api/comment'
import './style.scss'
import CommentChannel from '../../libs/echo/channels/comment-channel'
import MarkDownView from '../markDownView'
import Loading from '../loading'

function RecentUpdate(props) {
  // const [initLoading, setInitLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [start, setStart] = useState(0)
  const [list, setList] = useState([])

  const router = useRouter()

  const changeFormat = (date) => {
    const temp = new Date(date)
    const year = temp.getUTCFullYear()
    const month = temp.getUTCMonth() + 1
    const day = temp.getUTCDate()
    const time = `${year}年${month}月${day}日`
    return time
  }
  const formatter = buildFormatter(frenchStrings)
  const addData = (data) => {
    // setInitLoading(false)
    const newList = list.concat(data)
    let currentDate = ''
    newList.forEach((element) => {
      const date = new Date(element.last_edit).toLocaleDateString()
      if (date !== currentDate) {
        element.isFirstOfDay = true
        currentDate = date
      } else {
        element.isFirstOfDay = false
      }
    })
    setList(newList)
    // setStart(start + 5)
  }
  useEffect(async () => {
    setList([])
    setLoading(true)
    getJobfairComment(props.JFid, start, 5)
      .then((response) => {
        addData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
    new CommentChannel().listen((data) => {
      setList((prev) => {
        let newList = [...prev]
        if (props.JFid === 'all' || data.jobfair_id.toString() === props.JFid.toString()) {
          newList = [data, ...newList]

          let currentDate = ''
          newList.forEach((element) => {
            const date = new Date(element.last_edit).toLocaleDateString()
            if (date !== currentDate) {
              element.isFirstOfDay = true
              currentDate = date
            } else {
              element.isFirstOfDay = false
            }
          })
        }
        return newList
      })
    })
  }, [])
  // const data = [q
  //   {
  //     title: "木村さんがタスクを追加",
  //     display: true,
  //   },
  //   {
  //     title: "木村さんがタスクを追加",
  //     display: false,
  //   },
  //   {
  //     title: "木村さんがタスクを追加",
  //     display: false,
  //   },
  //   {
  //     title: "木村さんがタスクを追加",
  //     display: true,
  //   },
  // ];
  const onLoadMore = async () => {
    await getJobfairComment(props.JFid, start + 5, 5).then((response) => {
      addData(response.data)
    })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
    setStart(start + 5)
  }
  const loadMore = (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button onClick={onLoadMore}>もっと読む</Button>
    </div>
  )
  const commentStyle = {
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }
  return (
    <Card className="recent-update ml-12" bordered={false}>
      <h1 className="">最近の更新</h1>
      {
        loading ? <Loading loading={loading} overlay={loading} /> : (
          <List
            className=""
            style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', marginTop: '5px' }}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={(item) => (
              <>
                {item.isFirstOfDay && (
                  <Divider orientation="center">
                    <div className="time-wrapper">
                      {changeFormat(item.last_edit)}
                    </div>
                  </Divider>
                )}
                <a href={`/jobfairs/${item.jobfair_id}/tasks/${item.task.id}`}>
                  <List.Item
                    className="cursor-pointer"
                    style={{ transition: '0.25s', display: 'flex' }}
                  >
                    <List.Item.Meta
                      avatar={(
                        <>
                          {item.author?.avatar === 'images/avatars/default.jpg' ? (
                            <Avatar src="../images/avatars/default.jpg" />
                          ) : (
                            <>
                              <Avatar src={`${process.env.APP_URL}/api/avatar/${item.author.id}`} />
                            </>
                          )}
                        </>
                      )}
                      title={(
                        <>
                          <span href="">{item.author.name}</span>
                          {item.is_created_task ? (
                            <span>さんがタスクを追加</span>
                          ) : item.is_normal_comment ? (
                            <span>がタスクにコメント</span>
                          ) : (
                            <span>さんがタスクを更新</span>
                          )}
                        </>
                      )}
                      description={(
                        <>
                          <a href={`/jobfairs/${item.jobfair_id}/tasks/${item.task.id}`}>{item.task.name}</a>
                          <MarkDownView source={item.content} style={commentStyle} />
                          {(item.old_name || item.new_name) && (
                            <div className="flex pr-4">
                              <div className="old__status flex">
                                <strong className="text-right" style={{ minWidth: '90px' }}>
                                  タスク名：
                                </strong>
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.old_name}
                                </Typography>
                              </div>
                              &rArr;
                              <div className="new__status">
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.new_name}
                                </Typography>
                              </div>
                            </div>
                          )}
                          {(item.old_status || item.new_status) && (
                            <div className="flex">
                              <div className="old__status flex">
                                <strong className="text-right" style={{ minWidth: '90px' }}>
                                  ステータス：
                                </strong>
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.old_status}
                                </Typography>
                              </div>
                              &rArr;
                              <div className="new__status">
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.new_status}
                                </Typography>
                              </div>
                            </div>
                          )}
                          {(item.old_start_date || item.new_start_date) && (
                            <div className="flex">
                              <div className="old__status flex">
                                <strong className="text-right" style={{ minWidth: '90px' }}>
                                  開始日：
                                </strong>
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.old_start_date}
                                </Typography>
                              </div>
                              &rArr;
                              <div className="new__status">
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.new_start_date}
                                </Typography>
                              </div>
                            </div>
                          )}
                          {(item.old_end_date || item.new_end_date) && (
                            <div className="flex">
                              <div className="old__status flex">
                                <strong className="text-right" style={{ minWidth: '90px' }}>
                                  終了日：
                                </strong>
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.old_end_date}
                                </Typography>
                              </div>
                              &rArr;
                              <div className="new__status">
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.new_end_date}
                                </Typography>
                              </div>
                            </div>
                          )}
                          {(item.old_assignees.length > 0 || item.new_assignees.length > 0) && (
                            <div className="flex pr-4">
                              <div className="old__status flex">
                                <strong className="text-right" style={{ minWidth: '90px' }}>
                                  担当者：
                                </strong>
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.old_assignees.map((el, index, arr) => (el.length > 20 ? (
                                    <Tooltip placement="top" title={el}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '20ch' }}
                                      >
                                        {index < arr.length - 1 ? `${el}, ` : el}
                                        &nbsp;
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '20ch' }}
                                    >
                                      {index < arr.length - 1 ? `${el}, ` : el}
                                      &nbsp;
                                    </span>
                                  )))}
                                </Typography>
                              </div>
                              &rArr;
                              <div className="new__status">
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.new_assignees.map((el, index, arr) => (el.length > 20 ? (
                                    <Tooltip placement="top" title={el}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '20ch' }}
                                      >
                                        {index < arr.length - 1 ? `${el}, ` : el}
                                        &nbsp;
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '20ch' }}
                                    >
                                      {index < arr.length - 1 ? `${el}, ` : el}
                                      &nbsp;
                                    </span>
                                  )))}
                                </Typography>
                              </div>
                            </div>
                          )}
                          {(item.old_previous_tasks.length > 0
                            || item.new_previous_tasks.length > 0) && (
                            <div className="flex pr-4">
                              <div className="old__status flex">
                                <strong className="text-right" style={{ minWidth: '90px' }}>
                                    前のタスク：
                                </strong>
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.old_previous_tasks.map((el, index, arr) => (el.length > 20 ? (
                                    <Tooltip placement="top" title={el}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '20ch' }}
                                      >
                                        {index < arr.length - 1 ? `${el}, ` : el}
                                          &nbsp;
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '20ch' }}
                                    >
                                      {index < arr.length - 1 ? `${el}, ` : el}
                                        &nbsp;
                                    </span>
                                  )))}
                                </Typography>
                              </div>
                                &rArr;
                              <div className="new__status">
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.new_previous_tasks.map((el, index, arr) => (el.length > 20 ? (
                                    <Tooltip placement="top" title={el}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '20ch' }}
                                      >
                                        {index < arr.length - 1 ? `${el}, ` : el}
                                          &nbsp;
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '20ch' }}
                                    >
                                      {index < arr.length - 1 ? `${el}, ` : el}
                                        &nbsp;
                                    </span>
                                  )))}
                                </Typography>
                              </div>
                            </div>
                          )}

                          {(item.old_following_tasks.length > 0
                            || item.new_following_tasks.length > 0) && (
                            <div className="flex pr-4">
                              <div className="old__status flex">
                                <strong className="text-right" style={{ minWidth: '90px' }}>
                                    次のタスク：
                                </strong>
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.old_following_tasks.map((el, index, arr) => (el.length > 20 ? (
                                    <Tooltip placement="top" title={el}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '20ch' }}
                                      >
                                        {index < arr.length - 1 ? `${el}, ` : el}
                                          &nbsp;
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '20ch' }}
                                    >
                                      {index < arr.length - 1 ? `${el}, ` : el}
                                        &nbsp;
                                    </span>
                                  )))}
                                </Typography>
                              </div>
                                &rArr;
                              <div className="new__status">
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.new_following_tasks.map((el, index, arr) => (el.length > 20 ? (
                                    <Tooltip placement="top" title={el}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '20ch' }}
                                      >
                                        {index < arr.length - 1 ? `${el}, ` : el}
                                          &nbsp;
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '20ch' }}
                                    >
                                      {index < arr.length - 1 ? `${el}, ` : el}
                                        &nbsp;
                                    </span>
                                  )))}
                                </Typography>
                              </div>
                            </div>
                          )}
                          {(item.old_reviewers.length > 0 || item.new_reviewers.length > 0) && (
                            <div className="flex pr-4">
                              <div className="old__status flex">
                                <strong className="text-right" style={{ minWidth: '90px' }}>
                                  レビュアー：
                                </strong>
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.old_reviewers.map((el, index, arr) => (el.length > 20 ? (
                                    <Tooltip placement="top" title={el}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '20ch' }}
                                      >
                                        {index < arr.length - 1 ? `${el}, ` : el}
                                        &nbsp;
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '20ch' }}
                                    >
                                      {index < arr.length - 1 ? `${el}, ` : el}
                                      &nbsp;
                                    </span>
                                  )))}
                                </Typography>
                              </div>
                              &rArr;
                              <div className="new__status">
                                <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                                  {item.new_reviewers.map((el, index, arr) => (el.length > 25 ? (
                                    <Tooltip placement="top" title={el}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '25ch' }}
                                      >
                                        {index < arr.length - 1 ? `${el}, ` : el}
                                        &nbsp;
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '25ch' }}
                                    >
                                      {index < arr.length - 1 ? `${el}, ` : el}
                                      &nbsp;
                                    </span>
                                  )))}
                                </Typography>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    />
                    <h4 style={{ alignSelf: 'start' }}>
                      {' '}
                      <TimeAgo
                        style={{ paddingBottom: '4px' }}
                        date={item.last_edit}
                        formatter={formatter}
                      />
                    </h4>
                  </List.Item>
                </a>
              </>
            )}
          />
        )
      }
      {/* <Divider orientation="center">10/11/2021</Divider>
        <List
          className="my-3"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        /> */}
    </Card>
  )
}
RecentUpdate.propTypes = {
  JFid: PropTypes.isRequired,
}
export default RecentUpdate
