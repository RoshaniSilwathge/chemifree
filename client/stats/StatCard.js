import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Card , {CardMedia} from 'material-ui/Card'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  title: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 3}px ${theme.spacing.unit}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em',
    textAlign:'center'
  },
  card: {
    padding:'24px 20px 20px',
    margin: '20px 10px'
  },
  cover: {
    width: 160,
    height: 125,
    margin: '8px',
    backgroundSize: 'contain',
    float:'left'
  },
  details: {
    padding: "4px",
    fontSize: '60px',
    textAlign: 'center'
  }
})
class StatCard extends Component {
  constructor() {
    super()
  }

  render() {
    const {classes,count,text,image} = this.props
    return (
      <Card className={classes.card}>
        <CardMedia className={classes.cover} image={image} />
        <div className={classes.details}>{count}</div>
        <Typography type="title" className={classes.title}> {text} </Typography>
      </Card>
      )
  }
}

StatCard.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  text:PropTypes.string.isRequired,
  image:PropTypes.string.isRequired
}

export default withStyles(styles)(StatCard)
