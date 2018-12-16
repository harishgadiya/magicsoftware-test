import React from 'react';
import { DropTarget } from 'react-dnd';
import { PropTypes } from 'prop-types';
import ItemTypes from './itemTypes';

import './DragAndDrop.css'

const Target = ({
  connectDropTarget,
  highlighted,
  text,
  action,
  canDrop,
  isOver,
  draggedText,
}) => {
  const backgroundColor = highlighted ? 'black' : 'gray';
  const content = (
    <div
      className={
        `
          board__targets__target
          ${canDrop ? (
            !isOver ? 'can__drop__style' : 'drag__is__over'
        ) : ''}
        `
      }
      style={{ backgroundColor }}
    >
      <div>
        {text}
        {draggedText && <span className="count">{draggedText}</span>}
      </div>
    </div>
  );

  return (
    action === 'canDrop'
      ? connectDropTarget(content)
      : content
  );
};

Target.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  highlighted: PropTypes.bool,
  text: PropTypes.string.isRequired,
  action: PropTypes.string,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  draggedText: PropTypes.string,
}

Target.defualtProps = {
  highlighted: false,
  action: null,
  draggedText: null,
};

const target = {
  drop(props, monitor) {
    const dragSource = monitor.getItem();
    const data = {
      dragSource,
      dropTarget: props,
    };
    props.onDrop(data);
  },
}

const collect = (connect,  monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
});

export default DropTarget(ItemTypes.SECOND_LEVEL, target, collect)(Target);
export { Target as Base };
