import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Drop from './Drop';
import Source from './Source';
import Target, { Base as DraggbleTarget} from './Target';
import mockData from '../mockData';
import dragAndDrop from './DragAndDrop';
import ItemTypes from './itemTypes';

import './Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draggleData: mockData.draggleData,
      dropableData: mockData.dropableData,
      dropedData: [],
    };

    this.dragDropComponent = dragAndDrop({
      SortableComponent: DraggbleTarget,
      itemType: ItemTypes.FIRST_LEVEL,
      additionalDropTargetItemTypes: ItemTypes.SECOND_LEVEL,
  });
  }

  handleDrop = ({ dragSource, dropTarget }) => {
    console.log(dragSource, dropTarget, 'dragSource, dropTarget');
    const { id: dragId, text: dragText, action: dragAction } = dragSource;
    const { id: dropId, text: dropText, action: dropAction } = dropTarget;

    const { dropedData, dropableData } = this.state;
    const droppedBox = dropedData.indexOf(dragId) === -1
      ? [
        ...dropedData,
        {id: dragId, text: dragText, dropText}
      ] : dropedData;
    // if (this.state.dropedData.indexOf(dragId) === -1) {
    //   dropedData = [
    //     ...this.state.dropedData,
    //     {id: dragId, text: dragText, dropText}
    //   ];
    // }
    let revertIfHaveData;
    const dropableBox = [...dropableData.map(d => {
      if(d.id === dropId) {
        if (Object.prototype.hasOwnProperty.call(d, 'droppedToId')) {
          revertIfHaveData = {
            id: d.draggedFromId,
            text: d.draggedText,
            action: dragAction,
          };
        }
        return {
          ...d,
          draggedFromId: dragId,
          droppedToId: dropId,
          draggedText: dragText,
        }
      }
      return d;
    })]
    const draggleData = this.state.draggleData
      .map(d => revertIfHaveData ? revertIfHaveData : d)
      .filter(d => d.id !== dragId)

    this.setState({
      dropedData: droppedBox,
      draggleData,
      dropableData: dropableBox,
    });
  }

  render() {
    const { draggleData, dropedData, dropableData } = this.state;
    const DragDropComponent = this.dragDropComponent;
    return (
      <div className="container">
        <div id="board">
          <div id="board__sources">
            {draggleData.map(item => (
              <Source
                key={item.id}
                id={item.id}
                text={item.text}
                action={item.action}
                onDrop={this.handleDrop} />
            ))}
            {/* <Source id="1" color="red" text="A" onDrop={this.handleDrop} />
            <Source id="2" color="green" text="B" onDrop={this.handleDrop} />
            <Source id="3"color="blue" text="C" onDrop={this.handleDrop} />
            <Source id="4" color="blue" text="D" onDrop={this.handleDrop} /> */}
          </div>
          <div id="board__targets">
            {dropableData
              .map(item => {
                console.log(item)
                if (item.action === 'canDragDrop' || item.droppedToId >= 0) {
                  return (<DragDropComponent
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    action={item.action}
                    hasMultiple={item.id === item.droppedToId}
                    onDrop={this.handleDrop}
                    {...item}
                  />)
                }
                return (
                  <Target
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    action={item.action}
                    onDrop={this.handleDrop}
                    hasMultiple={item.id === item.droppedToId}
                  />
                );
              })
            }
          </div>
        </div>
        <div id="board__drops">
          {dropedData.map((drop, i) => (
            <Drop
              key={drop.id}
              id={drop.id}
              {...drop}
            />
          ))}
        </div>
      </div>
    );
  }
}
export default DragDropContext(HTML5Backend)(Board);