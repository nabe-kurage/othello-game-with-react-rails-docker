import React from 'react';
import PropTypes from 'prop-types';

const HelloWorld = (props) => {
  return <React.Fragment>Greeting: {props.greeting} test</React.Fragment>;
};

HelloWorld.propTypes = {
  greeting: PropTypes.string,
};

export default HelloWorld;
