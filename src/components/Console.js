import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { clear as actionClear } from '@/actions/console';

const mapStateToProps = ({ console }) => ({ console });
const mapDispatchToProps = (dispatch) => ({
  clear: () => dispatch(actionClear()),
});

class Console extends Component {
  constructor(props) {
    super(props);

    this.bottomRef = React.createRef();
  }

  componentDidUpdate() {
    this.bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  handleClear = () => {
    const { clear } = this.props;

    clear();
  }

  render() {
    const { console } = this.props;

    const ClearButton = withStyles(() => ({
      root: {
        marginTop: '10px',
      },
    }))(Button);

    /* eslint-disable react/no-array-index-key */
    return (
      <>
        <div style={{ height: '200px', overflow: 'scroll' }}>
          {
            console.messages.map((message, index) => (
              <p key={index}>
                {`>> ${message}`}
              </p>
            ))
          }
          <div ref={this.bottomRef} />
        </div>
        <ClearButton variant="contained" color="primary" onClick={this.handleClear}>
          <FormattedMessage
            id="app.console.clear"
            description="Button label to clear the console"
            defaultMessage="Clear"
          />
        </ClearButton>
      </>
    );
  }
}

Console.propTypes = {
  console: PropTypes.shape({
    messages: PropTypes.array.isRequired,
  }).isRequired,
  clear: PropTypes.func.isRequired,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Console));
