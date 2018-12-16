import React from 'react';
import { DragSource } from 'react-dnd';
import { PropTypes } from 'prop-types';
import ItemTypes from './itemTypes';

const Source = ({ text, connectDragSource, isDragging }) => (
  connectDragSource(
    <div
     className="board__sources__source"
     style={{
       opacity: isDragging ? 0.25 : 1,
      }}
    >
      {text}
    </div>
  )
);

Source.propTypes = {
  id: PropTypes.number.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
}

const source = {
  beginDrag(props) {
    const { id, text, action } = props;
    return ({
      id,
      text,
      action,
    });
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource(ItemTypes.FIRST_LEVEL, source, collect)(Source);