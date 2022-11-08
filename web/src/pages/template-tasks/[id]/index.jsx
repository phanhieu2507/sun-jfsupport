import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { Modal, notification, Tooltip, Switch } from 'antd'
import {
  ExclamationCircleOutlined,
  EditTwoTone,
  DeleteTwoTone,
  ArrowLeftOutlined,
} from '@ant-design/icons'

import { ReactReduxContext } from 'react-redux'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import OtherLayout from '../../../layouts/OtherLayout'
import {
  templateTask,
  beforeTask,
  afterTask,
  deleteTptt,
} from '../../../api/template-task'
import './style.scss'
// import MarkDownView from '../../components/markDownView'

const Editor = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('../../../components/editor'),
  { ssr: false },
)
function templatetTaskDt() {
  const router = useRouter()
  const idTplt = router.query.id
  const [name, setName] = useState('')
  const [categoryName, setCategory] = useState([])
  const [milestoneName, setMilestone] = useState('')
  const [beforeTasks, setBeforeTask] = useState([])
  const [afterTasks, setAfterTasks] = useState([])
  const [ef, setEf] = useState([])
  const [isDay, setIsDay] = useState([])
  const [unit, setUnit] = useState([])
  const [des, setDes] = useState([])
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isDuplicated, setIsDuplicated] = useState(false)
  const { store } = useContext(ReactReduxContext)

  const fetchInfo = async () => {
    await templateTask(idTplt)
      .then((response) => {
        setName(response.data.name)
        if (response.data.categories) {
          const NameCategory = []
          response.data.categories.forEach((element) => {
            NameCategory.push(element.category_name)
          })
          setCategory(NameCategory)
        }

        if (response.data.milestone) {
          setMilestone(response.data.milestone.name)
        }
        setEf(response.data.effort)
        setIsDay(response.data.is_day)
        setUnit(response.data.unit)
        setDes(
          response.data.description_of_detail.replace(
            /<a/g,
            '<a target="_blank" ',
          ),
        )
        setIsDuplicated(response.data.is_duplicated)
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          router.push('/404')
        }
      })
  }

  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const fetchBeforeTask = async () => {
    await beforeTask(idTplt)
      .then((response) => {
        setBeforeTask(response.data.before_tasks)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const fetchafterTask = async () => {
    await afterTask(idTplt)
      .then((response) => {
        setAfterTasks(response.data.after_tasks)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const saveNotification = () => {
    notification.success({
      duration: 3,
      message: '正常に削除されました',
      onClick: () => {},
    })
  }
  const deletetpl = async () => {
    await deleteTptt(idTplt)
      .then(async () => {
        router.push('/template-tasks')
        saveNotification()
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const modelDelete = () => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: async () => {
        deletetpl()
      },
      onCancel: () => {},
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  useEffect(() => {
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      setRole(user.get('role'))
    }
    fetchInfo()
    fetchBeforeTask()
    fetchafterTask()
  }, [user])
  const handleEdit = () => {
    router.push(`/template-tasks/${idTplt}/edit`)
  }
  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>
          <div className="template-task-dt">
            <Link href="/template-tasks">
              <ArrowLeftOutlined className="back-button" />
            </Link>
            <div className="flex items-center justify-between">
              <h1>テンプレートタスク詳細</h1>
              <div className="button__right mb-5">
                {role === 'superadmin' ? (
                  <>
                    <EditTwoTone
                      className="border-none mx-1 text-2xl"
                      type="primary"
                      onClick={handleEdit}
                    >
                      {/* <EditOutlined /> */}
                    </EditTwoTone>
                    <DeleteTwoTone
                      className="border-none mx-1 text-2xl"
                      type="primary"
                      onClick={modelDelete}
                    >
                      {/* <DeleteOutlined /> */}
                    </DeleteTwoTone>
                  </>
                ) : null}
              </div>
            </div>

            <div className="info__tplt">
              <div className="grid grid-cols-2 mx-16 info__center">
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-3 ">
                    <div className=" layber col-span-1 mx-4 text-right font-bold">
                      <p>テンプレートタスク名</p>
                    </div>
                    <div className="col-span-2 mx-4">
                      <div className="item__right">{name}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-3 ">
                    <div className="layber  col-span-1 mx-4 text-right font-bold">
                      <p>カテゴリ</p>
                    </div>
                    <div className="col-span-2 mx-4">
                      <div className="item__right">
                        {categoryName.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-3 ">
                    <div className="layber col-span-1 mx-4 text-right font-bold">
                      <p>マイルストーン</p>
                    </div>
                    <div className="col-span-2 mx-4">
                      <div className="item__right">{milestoneName}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-3 ">
                    <div className="layber col-span-1 mx-4 text-right font-bold">
                      <p>工数</p>
                    </div>
                    <div className="col-span-2 mx-4">
                      {unit === 'none' ? (
                        <>
                          <span className="ef">{ef}</span>
                          <span className="ef">{isDay ? '日' : '時間'}</span>
                        </>
                      ) : (
                        <>
                          <span className="ef">{ef}</span>
                          <span className="ef">{isDay ? '日' : '時間'}</span>
                          <span>/</span>
                          {unit === 'companies' ? '企業数' : '学生数'}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 mx-16 mt-5">
                <div
                  style={{ alignItems: 'flex-start' }}
                  className="col-span-1 mx-8 grid grid-cols-3"
                >
                  <p
                    style={{ marginBottom: '0' }}
                    className="layber col-span-1 mx-5 text-right font-bold"
                  >
                    前のタスク
                    {' '}
                  </p>
                  {beforeTasks.length > 0 ? (
                    <>
                      <ul className="ml-5">
                        {beforeTasks
                          ? beforeTasks.map((item) => (
                            <li className="mb-3">
                              <Tooltip placement="top" title={item.name}>
                                <a
                                  href={`/template-tasks/${item.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-block text-black-600 whitespace-nowrap "
                                >
                                  {truncate(item.name)}
                                </a>
                              </Tooltip>
                            </li>
                          ))
                          : null}
                      </ul>
                    </>
                  ) : (
                    <>
                      <ul className="list__task col-span-2" />
                    </>
                  )}
                </div>
                <div
                  style={{ alignItems: 'flex-start' }}
                  className="col-span-1 mx-8 grid grid-cols-3"
                >
                  <p
                    style={{ marginBottom: '0' }}
                    className="layber col-span-1 mx-5 text-right font-bold"
                  >
                    次のタスク
                  </p>
                  {afterTasks.length > 0 ? (
                    <>
                      <ul className="ml-5">
                        {afterTasks
                          ? afterTasks.map((item) => (
                            <li className="mb-3">
                              <Tooltip placement="top" title={item.name}>
                                <a
                                  href={`/template-tasks/${item.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-block text-black-600 whitespace-nowrap "
                                >
                                  {truncate(item.name)}
                                </a>
                              </Tooltip>
                            </li>
                          ))
                          : null}
                      </ul>
                    </>
                  ) : (
                    <>
                      <ul className="list__task col-span-2" />
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 mx-16 mt-5">
                <div
                  style={{ alignItems: 'flex-start' }}
                  className="col-span-1 mx-8 grid grid-cols-3"
                >
                  <p
                    style={{ marginBottom: '0' }}
                    className="layber col-span-1 mx-5 text-right font-bold"
                  >
                    タスクの複製
                  </p>
                  <div>
                    <Switch
                      className="switch-btn"
                      disabled
                      checked={isDuplicated}
                    />
                  </div>
                </div>
              </div>

              <div className="mr-7 ml-28 Editor">
                {/* <div className="mr-7 ml-28 des"> */}
                {/* <MarkDownView source={des} linkTarget="_blank" /> */}
                <Editor
                  editorText={des}
                  readOnly
                />
                {/* </div> */}
              </div>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}
templatetTaskDt.middleware = ['auth:superadmin', 'auth:member']
export default templatetTaskDt
