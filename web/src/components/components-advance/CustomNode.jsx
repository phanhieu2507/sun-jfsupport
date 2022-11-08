/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import {
  CloseCircleOutlined,
  CheckOutlined,
  EditTwoTone,
  FolderFilled,
  FileFilled,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { Row, Col, Slider } from 'antd'
import { useDragOver } from '@minoru/react-dnd-treeview'
import {
  DeleteTwoTone,
  // eslint-disable-next-line import/no-duplicates
} from '@ant-design/icons'
import styles from './CustomNode.module.scss'

export const CustomNode = (props) => {
  const [hover, setHover] = useState(false)
  const { id, parent, text } = props.node
  const indent = props.depth * 24
  const [labelText, setLabelText] = useState(text)
  const [iseOpen, setIsOpen] = useState(false)
  const [visibleInput, setVisibleInput] = useState(false)
  const handleToggle = (e) => {
    setIsOpen(!iseOpen)
    e.stopPropagation()
    props.onToggle(props.node.id)
  }
  const handleShowInput = () => {
    setVisibleInput(true)
  }
  const handleCancel = () => {
    setLabelText(text)
    setVisibleInput(false)
  }

  const handleChangeText = (e) => {
    setLabelText(e.target.value)
  }
  const handleSubmit = () => {
    setVisibleInput(false)
    props.onTextChange(id, labelText)
  }
  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle)
  const [inputValue, setInputValue] = useState({ id: null, value: props.node.duration })
  const onChange = (value) => {
    setInputValue({ id: props.node.id, value })
    props.setIdTaskInvalid(null)
    // eslint-disable-next-line no-unused-expressions
  }
  function onAfterChange(value) {
    props.onAfterChange({ id: props.node.id, value })
  }
  let defaultMaxDay
  if (props.daysMilestone.length > 0) {
    defaultMaxDay = props.daysMilestone[0].gap < 100 ? props.daysMilestone[0].gap : defaultMaxDay = 20
  }
  const categorys = []

  if (props.node.category) {
    props.node.category.forEach((element) => {
      categorys.push(element.category_name)
    })
  }
  useEffect(() => {
    setInputValue({ id: null, value: props.node.duration })
  }, [])
  return (
    <div
      className={`tree-node ${styles.root}`}
      {...dragOverProps}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="item">
        {visibleInput ? (
          <div className={styles.inputWrapper}>
            <input
              className="input_edit"
              value={labelText}
              onChange={handleChangeText}
            />
            <a
              className={styles.editButton}
              onClick={handleSubmit}
              disabled={labelText === ''}
            >
              <CheckOutlined className="mx-1" />
            </a>
            <a className={styles.editButton} onClick={handleCancel}>
              <CloseCircleOutlined className={styles.editIcon} />
            </a>
          </div>
        ) : (
          <>
            <div className="">
              <div className="">
                <Row>
                  <Col span={7}>
                    <Row gutter={[50, 50]}>
                      <Col span={20}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div>
                            {props.node.droppable ? (
                              <div onClick={handleToggle}>
                                {iseOpen ? (
                                  <DownOutlined className="mr-1" />
                                ) : (
                                  <RightOutlined className="mr-1" />
                                )}
                              </div>
                            ) : null}
                          </div>
                          <div className="mr-1">
                            {props.node.droppable ? (
                              <FolderFilled />
                            ) : props.node.parent ? (
                              <FileFilled className="ml-4" />
                            ) : (
                              <FileFilled />
                            )}
                          </div>
                          <div className="text">
                            <span>{props.node.text}</span>
                          </div>

                        </div>
                      </Col>
                      <Col span={4}>
                        {props.node.droppable ? (
                          <div className={styles.actionButton}>
                            <a className="mr-1" onClick={handleShowInput}>
                              <EditTwoTone className="" />
                            </a>
                            <a
                              size="small ml-10"
                              onClick={() => props.onDelete(id)}
                            >
                              <DeleteTwoTone />
                            </a>
                          </div>
                        ) : null}
                      </Col>
                    </Row>

                    <div className="flex items-center" />
                  </Col>
                  <Col span={5}>
                    <div className="text">
                      {categorys.length > 0 && categorys.join(',')}
                    </div>
                  </Col>
                  <Col span={3}>
                    <div className="text">
                      {props.node.droppable ? '' : props.node.effort}
                    </div>
                  </Col>
                  <Col span={8}>
                    {' '}
                    <div className={props.idTaskInvalid !== props.node.id ? 'item-task' : 'item-invalid'}>
                      {!props.node.droppable ? (
                        <div className="">
                          <Slider
                            min={0}
                            max={defaultMaxDay}
                            range
                            step={1}
                            defaultValue={inputValue.value ? [inputValue.value[0], inputValue.value[1]] : [0, 1]}
                            onChange={onChange}
                            onAfterChange={onAfterChange}
                          />
                          <div className="inputValue ml-3">
                            <span>{inputValue.value && inputValue.value[0].toString()}</span>
                            <span>-</span>
                            <span>{inputValue.value && inputValue.value[1].toString()}</span>

                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
