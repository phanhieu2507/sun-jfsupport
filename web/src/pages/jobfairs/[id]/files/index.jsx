import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import {
  Table,
  Checkbox,
  Button,
  notification,
  Breadcrumb,
  Empty,
  Modal,
  Tooltip,
  Form,
  Input,
  Row,
  Col,
} from 'antd'
import {
  FolderFilled,
  ExclamationCircleOutlined,
  FileFilled,
} from '@ant-design/icons'
import './style.scss'
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { ReactReduxContext } from 'react-redux'
import Search from '../../../../components/file/search'
import JfLayout from '../../../../layouts/layout-task'
import {
  getLatest,
  getRootPathFile,
  deleteDocument,
  editDocument,
  getPath,
} from '../../../../api/file'
import ButtonAddFile from '../../../../components/file/ButtonAddFile'
import ButtonAddFolder from '../../../../components/file/ButtonAddFolder'
import Loading from '../../../../components/loading'

function File() {
  const { store } = useContext(ReactReduxContext)
  const user = store.getState().get('auth').get('user')

  const router = useRouter()
  const JFid = router.query.id
  const formatter = buildFormatter(frenchStrings)
  const [disableBtnEdit, setDisableBtnEdit] = useState(true)
  const [disableBtnDelete, setDisableBtnDelete] = useState(true)
  const [isModalEditFileVisible, setIsModalEditFileVisible] = useState(false)
  const [isModalEditFolderVisible, setIsModalEditFolderVisible] = useState(false)
  const [directory, setDirectory] = useState(['ファイル'])
  const [currentRowIndex, setCurrentRowIndex] = useState(-1)
  const [isDisableEditFile, setIsDisableEditFile] = useState(false)
  const [isDisableEditFolder, setIsDisableEditFolder] = useState(false)
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formEditFile] = Form.useForm()
  const [formEditFolder] = Form.useForm()
  const [role, setRole] = useState('')
  const [fileAdded, setFileAdded] = useState(false)
  const onEditFileChange = () => {
    const nameFile = formEditFile.getFieldValue('name_file')
    const link = formEditFile.getFieldValue('link')
    if (!nameFile || !link) {
      setIsDisableEditFile(true)
      return
    }
    setIsDisableEditFile(false)
  }
  const onChangeDisableEditFolder = () => {
    const nameFolder = formEditFolder.getFieldValue('name_folder')
    if (!nameFolder) {
      setIsDisableEditFolder(true)
      return
    }
    setIsDisableEditFolder(false)
  }

  // my code
  const [recentUpdated, setRecentUpdated] = useState([])
  const [data, setData] = useState([])
  const [isChecked, setIsChecked] = useState([])
  const columns = [
    {
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: '5%',
      render: (checkbox, record, rowIndex) => (
        <>
          {!checkbox || (
            <Checkbox
              checked={isChecked[rowIndex]}
              onChange={(e) => {
                setIsChecked((prev) => prev.map((el, i) => (i === rowIndex ? e.target.checked : el)))
              }}
            />
          )}
        </>
      ),
    },
    {
      title: <div className="ml-10">名前</div>,
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div
          onClick={async () => {
            setLoading(true)
            if (record.is_file) {
              window.open(record.link)
            } else if (record.key !== -1) {
              let queryPath = ''
              for (let i = 0; i < directory.length; i += 1) {
                if (i !== 0) {
                  queryPath += `${directory[i]}/`
                } else {
                  queryPath += '/'
                }
              }
              queryPath += `${record.name}`
              try {
                const res = await getPath({
                  params: {
                    jfId: JFid,
                    path: queryPath,
                  },
                })

                const result = res.data.map((element) => ({
                  key: element.id,
                  checkbox:
                    user.get('id') === element.authorId || role !== 'member',
                  is_file: element.is_file,
                  name: element.name,
                  updater: element.updaterName,
                  updated_at: element.updated_at,
                  link: element.link,
                }))
                setData(result)
                setIsCheckAll(false)
                setDirectory([...directory, record.name])
              } catch (error) {
                if (error.response.status === 404) {
                  router.push('/404')
                }
                setLoading(false)
              }
            } else {
              let queryPath = ''
              for (let i = 0; i < directory.length - 1; i += 1) {
                if (i !== 0 && i !== directory.length - 2) {
                  queryPath += `${directory[i]}/`
                } else if (i === 0) {
                  queryPath += '/'
                } else {
                  queryPath += directory[i]
                }
              }
              try {
                const res = await getPath({
                  params: {
                    jfId: JFid,
                    path: queryPath,
                  },
                })

                const result = res.data.map((element) => ({
                  key: element.id,
                  checkbox:
                    user.get('id') === element.authorId || role !== 'member',
                  is_file: element.is_file,
                  name: element.name,
                  updater: element.updaterName,
                  updated_at: element.updated_at,
                  link: element.link,
                }))
                setData(result)
                setIsCheckAll(false)
                setDirectory(directory.slice(0, directory.length - 1))
              } catch (error) {
                if (error.response.status === 404) {
                  router.push('/404')
                }
              }
            }
            setLoading(false)
          }}
          className="cursor-pointer flex flex-row items-center"
        >
          {record.is_file ? (
            <FileFilled className="mr-3" />
          ) : (
            <FolderFilled className="mr-3" />
          )}
          {name.length > 20 ? (
            <Tooltip placement="top" title={name}>
              <span
                className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
                style={{ maxWidth: '20ch' }}
              >
                {name}
              </span>
            </Tooltip>
          ) : (
            <span
              className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
              style={{ maxWidth: '20ch' }}
            >
              {name}
            </span>
          )}
        </div>
      ),
    },
    {
      title: '更新者',
      dataIndex: 'updater',
      key: 'updater',
    },
    {
      title: '更新時間',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updatedAt) => (
        <>
          <TimeAgo date={updatedAt} formatter={formatter} />
        </>
      ),
    },
  ]
  const getRole = () => {
    const manageIds = Array.from(user.get('manage_jf_ids'))
    if (manageIds.includes(parseInt(JFid, 10))) {
      setRole('admin')
    } else {
      setRole(user.get('role'))
    }
  }
  const setAddStateHandler = (state) => {
    setFileAdded(state)
  }
  useEffect(async () => {
    getRole()
    setLoading(true)
    setFileAdded(false)
    try {
      let res = await getRootPathFile(JFid)
      let result = res.data.map((element) => ({
        key: element.id,
        checkbox: user.get('id') === element.authorId || role !== 'member',
        is_file: element.is_file,
        name: element.name,
        updater: element.updaterName,
        updated_at: element.updated_at,
        link: element.link,
      }))
      setData(result)
      res = await getLatest(JFid)
      result = res.data.map((element) => ({
        key: element.id,
        checkbox: true,
        is_file: element.is_file,
        name: element.name,
        updater: element.updaterName,
        updated_at: element.updated_at,
        link: element.link,
      }))
      setRecentUpdated(result)
      setLoading(false)
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
      setLoading(false)
    }
  }, [role, fileAdded])
  useEffect(() => {
    const temp = []
    for (let index = 0; index < data.length; index += 1) {
      temp.push(false)
    }
    setIsChecked(temp)
  }, [data])
  useEffect(() => {
    let count = 0
    isChecked.forEach((elem, index) => {
      if (elem && data[index].checkbox) {
        setCurrentRowIndex(index)
        count += 1
      }
    })
    if (count > 1) {
      setDisableBtnDelete(false)
      setDisableBtnEdit(true)
    } else if (count === 1) {
      setDisableBtnEdit(false)
      setDisableBtnDelete(false)
    } else {
      setDisableBtnEdit(true)
      setDisableBtnDelete(true)
    }
  }, [isChecked])
  useEffect(() => {
    if (directory.length !== 1) {
      setData([
        {
          key: -1,
          name: '..',
          checkbox: false,
          is_file: false,
          updater: '',
          updated_at: '',
          link: '',
        },
        ...data,
      ])
    }
  }, [directory])
  const onBtnEditClick = () => {
    if (data[currentRowIndex].is_file) {
      setIsModalEditFileVisible(true)
      formEditFile.setFieldsValue({
        name_file: data[currentRowIndex].name,
        link: data[currentRowIndex].link,
      })
    } else {
      formEditFolder.setFieldsValue({
        name_folder: data[currentRowIndex].name,
      })
      setIsModalEditFolderVisible(true)
    }
  }
  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 2.5,
    })
  }
  const handleEditFileOk = () => {
    const nameInput = formEditFile.getFieldValue('name_file')
    const linkInput = formEditFile.getFieldValue('link')
    editDocument(data[currentRowIndex].key, {
      name: nameInput,
      link: linkInput,
    })
      .then((res) => {
        if (res.data.name) {
          if (res.data.name[0] === 'The name has already been taken.') {
            formEditFile.setFields([
              {
                name: 'name_file',
                errors: ['このファイル名は既に使用されています。'],
              },
            ])
            setIsDisableEditFile(true)
            return
          }
        }
        notification.success({
          message: '成功に編集しました。',
          duration: 3,
        })
        const result = res.data.map((element) => ({
          key: element.id,
          checkbox: user.get('id') === element.authorId || role !== 'member',
          is_file: element.is_file,
          name: element.name,
          updater: element.updaterName,
          updated_at: element.updated_at,
          link: element.link,
        }))
        if (directory.length > 1) {
          setData([
            {
              key: -1,
              name: '..',
              checkbox: false,
              is_file: false,
              updater: '',
              updated_at: '',
              link: '',
            },
            ...result,
          ])
        } else setData(result)
        setIsModalEditFileVisible(false)
        setIsCheckAll(false)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
        setIsModalEditFileVisible(false)
      })
  }
  const handleEditFolderOk = () => {
    const nameInput = formEditFolder.getFieldValue('name_folder')
    editDocument(data[currentRowIndex].key, {
      name: nameInput,
    })
      .then((res) => {
        if (res.data.name) {
          if (res.data.name[0] === 'The name has already been taken.') {
            formEditFolder.setFields([
              {
                name: 'name_folder',
                errors: ['このフォルダ名は既に使用されています。'],
              },
            ])
            setIsDisableEditFolder(true)
            return
          }
        }
        notification.success({
          message: '成功に編集しました。',
          duration: 3,
        })
        const result = res.data.map((element) => ({
          key: element.id,
          checkbox: user.get('id') === element.authorId || role !== 'member',
          is_file: element.is_file,
          name: element.name,
          updater: element.updaterName,
          updated_at: element.updated_at,
          link: element.link,
        }))
        if (directory.length > 1) {
          setData([
            {
              key: -1,
              name: '..',
              checkbox: false,
              is_file: false,
              updater: '',
              updated_at: '',
              link: '',
            },
            ...result,
          ])
        } else setData(result)
        setIsModalEditFolderVisible(false)
        setIsCheckAll(false)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
        setIsModalEditFolderVisible(false)
      })
  }
  const handleOkDelete = async () => {
    try {
      setLoading(true)
      const idArray = []
      data.forEach((element, index) => {
        if (isChecked[index] && element.checkbox) {
          idArray.push(element.key)
        }
      })

      const res = await deleteDocument(JFid, { id: idArray })
      const result = res.data.map((element) => ({
        key: element.id,
        checkbox: user.get('id') === element.authorId || role !== 'member',
        is_file: element.is_file,
        name: element.name,
        updater: element.updaterName,
        updated_at: element.updated_at,
        link: element.link,
      }))
      if (directory.length > 1) {
        setData([
          {
            key: -1,
            name: '..',
            checkbox: false,
            is_file: false,
            updater: '',
            updated_at: '',
            link: '',
          },
          ...result,
        ])
      } else setData(result)
      setIsCheckAll(false)
      setLoading(false)
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      } else {
        openNotification(
          'error',
          'このファイルとフォルダを削除する権限がないです!',
        )
      }
      setIsCheckAll(false)
      setLoading(false)
    }
  }
  return (
    <div className="File">
      {loading && <Loading loading={loading} overlay={loading} />}
      <JfLayout id={JFid} bgr={5}>
        <JfLayout.Main>
          <h1>ファイル</h1>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-x-12">
              <div className="md:col-span-5">
                <div className="w-full h-14 flex flex-row justify-end gap-x-6">
                  <ButtonAddFile
                    updater={user}
                    role={role}
                    path={directory}
                    documentId={JFid}
                    setData={setData}
                    setIsCheckAll={setIsCheckAll}
                    setAddState={setAddStateHandler}
                  />
                  <ButtonAddFolder
                    updater={user}
                    role={role}
                    path={directory}
                    documentId={JFid}
                    setData={setData}
                    setIsCheckAll={setIsCheckAll}
                  />
                </div>
                <div className="w-full">
                  <div className="h-24 grid grid-cols-3 table-top border-t border-r border-l border-black rounded-t-md">
                    <div className="flex flex-col justify-center gap-2 pl-5 items-start col-span-2">
                      <Checkbox
                        className="w-100"
                        checked={isCheckAll}
                        onChange={(e) => {
                          setIsChecked((prev) => prev.map(() => e.target.checked))
                          setIsCheckAll(e.target.checked)
                        }}
                      >
                        全て選択
                      </Checkbox>
                      <Breadcrumb>
                        {directory.map((ele, index) => (
                          <Breadcrumb.Item
                            onClick={async () => {
                              setLoading(true)
                              let queryPath = ''
                              for (let i = 0; i <= index; i += 1) {
                                if (i !== index && i !== 0) {
                                  queryPath += `${directory[i]}/`
                                }
                                if (i === 0) {
                                  queryPath += '/'
                                } else {
                                  queryPath += directory[i]
                                }
                              }
                              try {
                                const res = await getPath({
                                  params: {
                                    jfId: JFid,
                                    path: queryPath,
                                  },
                                })
                                const result = res.data.map((element) => ({
                                  key: element.id,
                                  checkbox:
                                    user.get('id') === element.authorId
                                    || role !== 'member',
                                  is_file: element.is_file,
                                  name: element.name,
                                  updater: element.updaterName,
                                  updated_at: element.updated_at,
                                  link: element.link,
                                }))
                                setData(result)
                                setIsCheckAll(false)
                                setDirectory(directory.slice(0, index + 1))
                                setLoading(false)
                              } catch (error) {
                                if (error.response.status === 404) {
                                  router.push('/404')
                                }
                                setLoading(false)
                              }
                            }}
                            className="underline text-xl cursor-pointer"
                          >
                            {ele}
                          </Breadcrumb.Item>
                        ))}
                      </Breadcrumb>
                    </div>
                    <div className="col-start-3 flex flex-row items-center justify-center gap-4">
                      <Button
                        type="primary"
                        className="w-14 md:w-24"
                        disabled={disableBtnEdit}
                        onClick={onBtnEditClick}
                      >
                        編集
                      </Button>
                      <Modal
                        title="ファイル編集"
                        okText="保存"
                        cancelText="キャンセル"
                        centered
                        visible={isModalEditFileVisible}
                        onOk={handleEditFileOk}
                        onCancel={() => {
                          setIsModalEditFileVisible(false)
                        }}
                        okButtonProps={{ disabled: isDisableEditFile }}
                      >
                        <Form
                          form={formEditFile}
                          onValuesChange={onEditFileChange}
                          layout="horizontal"
                          labelCol={{
                            span: 6,
                          }}
                          wrapperCol={{
                            span: 16,
                          }}
                          name="basic"
                          size="large"
                        >
                          <Form.Item
                            label={<span className="font-bold mr-3">名前</span>}
                            name="name_file"
                            rules={[
                              {
                                required: true,
                                message: 'この項目は必須です。',
                              },
                            ]}
                          >
                            <Input
                              type="text"
                              size="large"
                              placeholder="新しいファイル名"
                            />
                          </Form.Item>

                          <Form.Item
                            label={
                              <span className="font-bold mr-3">リンク</span>
                            }
                            name="link"
                            rules={[
                              {
                                required: true,
                                message: 'この項目は必須です。',
                              },
                            ]}
                          >
                            <Input
                              type="text"
                              size="large"
                              placeholder="グーグルドライブリンク"
                            />
                          </Form.Item>
                        </Form>
                      </Modal>
                      <Modal
                        title="フォルダ編集"
                        okText="保存"
                        cancelText="キャンセル"
                        centered
                        visible={isModalEditFolderVisible}
                        onOk={handleEditFolderOk}
                        onCancel={() => {
                          setIsModalEditFolderVisible(false)
                        }}
                        okButtonProps={{ disabled: isDisableEditFolder }}
                      >
                        <Form
                          form={formEditFolder}
                          onValuesChange={onChangeDisableEditFolder}
                          layout="horizontal"
                          labelCol={{
                            span: 6,
                          }}
                          wrapperCol={{
                            span: 16,
                          }}
                          size="large"
                          name="basic"
                        >
                          <Form.Item
                            label={(
                              <span
                                style={{ marginBottom: 0 }}
                                className="font-bold mr-3"
                              >
                                名前
                              </span>
                            )}
                            name="name_folder"
                            rules={[
                              {
                                required: true,
                                message: 'この項目は必須です。',
                              },
                            ]}
                          >
                            <Input
                              type="text"
                              size="large"
                              placeholder="新しいフォルダ名"
                            />
                          </Form.Item>
                        </Form>
                      </Modal>
                      <Button
                        type="primary"
                        className="w-14 md:w-24"
                        disabled={disableBtnDelete}
                        onClick={() => {
                          Modal.confirm({
                            title:
                              'ファイルとフォルダを削除してもよろしいですか?',
                            icon: <ExclamationCircleOutlined />,
                            content: '',
                            onOk: async () => {
                              handleOkDelete()
                            },
                            onCancel: () => {},
                            centered: true,
                            okText: 'はい',
                            cancelText: 'いいえ',
                          })
                        }}
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                  <Table
                    scroll={{ y: 1000 }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    // onRow={onRowClick}
                    locale={{
                      emptyText: (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="データがありません"
                        />
                      ),
                    }}
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <div className="pt-12">
                  <h3 className="font-bold mb-1">最近更新されたファイル</h3>
                  <div className="h-60 recently mt-1 border border-black rounded-md flex flex-col justify-start">
                    {recentUpdated.map((el, index) => (
                      <>
                        <div
                          className={`my-2 px-6 ${
                            index !== recentUpdated.length - 1
                              ? 'border-b border-black'
                              : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <FileFilled className="mr-2 " />
                            {el.name.length > 10 ? (
                              <Tooltip placement="top" title={el.name}>
                                <span
                                  className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                  style={{ maxWidth: '20ch' }}
                                >
                                  {el.name}
                                </span>
                              </Tooltip>
                            ) : (
                              <span
                                className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                style={{ maxWidth: '20ch' }}
                              >
                                {el.name}
                              </span>
                            )}
                          </div>
                          <div className="py-2 flex flex-row items-center gap-2">
                            <Row>
                              <Col span={6}>
                                <TimeAgo
                                  date={el.updated_at}
                                  formatter={formatter}
                                />
                              </Col>
                              <Col span={1}>
                                <span>/</span>
                              </Col>

                              {el.updater.length > 16 ? (
                                <Col span={9}>
                                  <Tooltip placement="top" title={el.updater}>
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '19ch' }}
                                    >
                                      {el.updater}
                                    </span>
                                  </Tooltip>
                                </Col>
                              ) : (
                                <Col span={11}>
                                  <span
                                    className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                    style={{ maxWidth: '19ch' }}
                                  >
                                    {el.updater}
                                  </span>
                                </Col>
                              )}
                            </Row>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="mb-1 font-bold">ファイルを検索</h3>
                  <div className="search p-3 border border-black rounded-md">
                    <Search />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
File.middleware = ['auth:superadmin', 'auth:member']
export default File
