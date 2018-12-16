import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import './DragAndDrop.css';

export default function dragAndDrop({
    SortableComponent,
    itemType,
    additionalDropTargetItemTypes = [],
}) {
    const dragItemSource = {
        beginDrag(props) {
            const { id, text, action } = props;
            return ({
              id,
              text,
              action,
            });
          },
    };

    const dragItemTarget = {
        drop(props, monitor) {
            const dragSource = monitor.getItem();
            const data = {
                dragSource,
                dropTarget: props,
            };
            if (props.id === dragSource.id) return;
            const { id, text } = dragSource;
            props.onDrop(data);
        },
    };
    function dragSourceCollect(connect, monitor) {
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        };
    }
    
    function dropTargetCollect(connect, monitor) {
        return {
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            highlighted: monitor.canDrop(),
        };
    }

    class DragAndDrop extends React.Component {
        render() {
            const {
                connectDragSource,
                connectDropTarget,
                isDragging,
                isOver,
                canDrop,
                highlighted,
                hasMultiple,

                ...other
            } = this.props;

            let content = (
                <div
                    className={canDrop ? (
                        !isOver ? 'can__drop__style' : 'drag__is__over'
                    ) : ''}
                    // ref={el => (this.sortable = el)}
                    style={{
                        opacity: isDragging ? 0.25 : 1,
                    }}
                >
                    <SortableComponent
                        {...other}
                        isDragging={isDragging}
                        connectDropTarget={connectDropTarget}
                        connectDragSource={connectDragSource}
                    />
                </div>
            );

            content = hasMultiple ? connectDragSource(content) : content;
            return connectDropTarget(content);
        }
    }

    DragAndDrop.propTypes = {
        ...SortableComponent.propTypes,

        hasMultiple: PropTypes.bool,

        // Injected by React DnD:
        isDragging: PropTypes.bool.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        highlighted: PropTypes.bool.isRequired,
    };

    DragAndDrop.defaultProps = {
        hasMultiple: false,
    };

    const dropTargetType = [itemType, additionalDropTargetItemTypes];

    return DropTarget(dropTargetType, dragItemTarget, dropTargetCollect)(
        DragSource(additionalDropTargetItemTypes, dragItemSource, dragSourceCollect)(DragAndDrop),
    );
}
