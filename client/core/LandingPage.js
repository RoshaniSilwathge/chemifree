import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Suggestions from './../product/Suggestions'
import {listLatest, listCategories} from './../product/api-product.js'
import Search from './../product/Search'
// import ReactDOM from 'react-dom';
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Carousel } from 'react-responsive-carousel';
import Categories from './../product/Categories';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.67)',
    family: 'montserrat',
    padding: '8px 10px 0',
    cursor: 'pointer',
    display: 'inline-block',
    textAlign:'center'
  }
})

class Home extends Component {
  state={
    suggestionTitle: "Latest Fertilizer",
    suggestions: [],
    categories: []
  }
  // componentDidMount = () => {
  //   listLatest().then((data) => {
  //     if (data.error) {
  //       console.log(data.error)
  //     } else {
  //       this.setState({suggestions: data})
  //     }
  //   })
  //   listCategories().then((data) => {
  //     if (data.error) {
  //       console.log(data.error)
  //     } else {
  //       this.setState({categories: data})
  //     }
  //   })
  // }
  render() {
    const {classes} = this.props
    return (
      
      
      <div className={classes.root}>
        <img src='https://compost.lk/wp-content/uploads/2016/09/compost-tag-banner-3-1117x500.jpg'/>
      <Typography type="title" color="inherit">Leading Organic Fertiliser Manufacturer in Sri Lanka</Typography>
       <br></br>
    
We are Saarabhoomi Agro, a Sri Lankan enterprise striving to further the concept of ecological farming. In order to achieve this mission, we have researched and manufactured a fertilizer and a pest repellent, by only using local and natural resources.
We guarantee the quality of our products and do not use any external chemicals. We follow an agile process with continuous improvement of our products based on feedback from farmers. We also conduct laboratory testing with relevant accredited institutions.
After years of dedicated work, we have been able to successfully introduce a Liquid Fertilizer (Crop Star), Natural Herbal Pest Repellent (Bio Guard) and a Compost with high Microbial Density for our farmers. We have done many field tests with the help of experienced farmers and our concept is to use a combination of our products for the mutual benefit of each other’s maximum effectiveness.
Our Microbial Compost (Super Bio Treat) needs to be applied during the soil preparation time and it will re-treat the soil biologically and enrich it with nutrients. The Liquid Fertilizer can be added afterwards to energize the crops and soil condition by fostering the micro-organisms. Pests and diseases will be controlled naturally using this combination, however if further measures are required, our Natural Herbal Pest Repellent can be applied.
We are a registered fertilizer manufacturer in Agricultural Ministry and the Fertilizer Secretariat in Sri Lanka.
      <br></br><br></br>
      <Typography type="title" color="inherit">Our Vision</Typography>
      <br></br>
To be the most trusted provider in ecological farming products and services in Sri Lanka
<br></br><br></br>
<Typography type="title" color="inherit">
        Our Mission
      </Typography>
      <br></br>
Continuous improvements through experimentation and feedback from our customers
Use of most appropriate and naturally available raw materials
Develop products that are environmentally friendly and preserve natural resources
Emphasize the fairness in all work we do
      
      </div>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)
