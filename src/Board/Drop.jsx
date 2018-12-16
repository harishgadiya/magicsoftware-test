import React from 'react';
import { PropTypes } from 'prop-types';

const Drop = ({ id, text, dropText }) => (
  <div className="board__drops__drop">
    <div
      className="board__drops__drop__target"
    >
      {`You have  dropped ${text} in ${dropText}.`}
    </div>
  </div>
);

Drop.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  // dragText: PropTypes.string.isRequired,
  dropText: PropTypes.string.isRequired,
};

export default Drop;
