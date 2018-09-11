import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

function Grid({classes, metaHashes}) {

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div"><h4>Spaces<h4>Add Space</ListSubheader>
        </GridListTile>
        {spaces.map((s,idx) =>
          <Tile key={idx} id={idx} hash={this.props.metaHashes[s.hash]} fee={this.props.fees[s.fee]} showForm={this.props.showForm.bind(this, idx)} />)}
      </GridList>
    </div>
  );
}

Grid.propTypes = {
  classes: PropTypes.object.isRequired,
  showForm: PropTypes.func.isRequired
};

export default withStyles(styles)(Grid);
