import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Card , {CardMedia} from 'material-ui/Card'
import Icon from 'material-ui/Icon'
import List, {ListItem, ListItemText} from 'material-ui/List'
import Typography from 'material-ui/Typography'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import Collapse from 'material-ui/transitions/Collapse'
import Divider from 'material-ui/Divider'
import auth from './../auth/auth-helper'
import {getShopOrdersPlacedToday,getOrdersPlacedWithinThisYear} from './api-order.js'
import ProductOrderEdit from './ProductOrderEdit'
import Grid from 'material-ui/Grid'
import StatCard from '../stats/StatCard'
import {Bar} from 'react-chartjs-2';


const styles = theme => ({
  root: {
    margin: 30,
  },
  title: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 3}px ${theme.spacing.unit}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing.unit,
    color: '#434b4e',
    fontSize: '1.1em'
  },
  customerDetails: {
    paddingLeft: '36px',
    paddingTop: '16px',
    backgroundColor:'#f8f8f8'
  },
  card: {
    padding:'24px 20px 20px',
    margin: '20px 10px'
  },
  icon: {
    verticalAlign: 'sub'
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

const monthlyIncomeChartDetails = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','Octomber','November','December'],
        datasets: [
          {
            label: 'Income',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]
          }
        ]
      }

const monthlyOrderCountChartDetails = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','Octomber','November','December'],
        datasets: [
          {
            label: 'Order',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]
          }
        ]
      }
const monthlyCustomerCountChartDetails = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','Octomber','November','December'],
        datasets: [
          {
            label: 'Customers',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]
          }
        ]
      }
      
class ShopAnalysis extends Component {
  constructor({match}) {
    super()
    this.state = {
      noOfOrders:0,
      totalIncome:0,
      totalCustomers:0,
      monthlyIncomeChartDetails,
      monthlyOrderCountChartDetails,
      monthlyCustomerCountChartDetails
    }
    this.match = match
  }

  loadShopAnalysis = () => {
    const jwt = auth.isAuthenticated()
    this.loadOrdersPlacedWithinToday(jwt)
    this.loadOrdersPlacedWithinThisYear(jwt)    
  }

  loadOrdersPlacedWithinToday = (jwt) => {
    getShopOrdersPlacedToday({
          shopId: this.match.params.shopId
        }, {t: jwt.token}).then((data) => {
          if (data.error) {
            console.log(data)
          } else {
            this.generateStatBlockData(data) 
          }
    })
  }

  loadOrdersPlacedWithinThisYear = (jwt) => {
    getOrdersPlacedWithinThisYear({
      shopId: this.match.params.shopId
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        console.log(data)
      } else {
        this.generateStatChartData(data) 
      }
    })
  }

  generateStatBlockData = (orders) => {

        let noOfOrders = orders.length
        let totalIncome = 0
        let totalCustomers = 0
        let customers = []

        orders.forEach(order => {
          // calculate income
          order.products.forEach(product=>{
            let itemCost = product.quantity * product.product.price
            totalIncome += itemCost
          })

          // calculate total customers
          if(customers.indexOf(order.user) === -1){
            customers.push(order.user)
          }

        })

        totalCustomers = customers.length
        this.setState({noOfOrders,totalIncome,totalCustomers})
  }

  generateStatChartData = (orders) => {
         let incomeByMonth = [0,0,0,0,0,0,0,0,0,0,0,0]
         let orderCountByMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
         let customersByMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
         let customersIdsByMonth = [[],[],[],[],[],[],[],[],[],[],[],[]]
         orders.forEach(order => {
          // calculate income
          let monthOfOrder = order.month
          orderCountByMonth[monthOfOrder-1] +=1
          order.products.forEach(product=>{
            if(product.shop === this.match.params.shopId){
              let itemCost = product.quantity * product.product.price
              incomeByMonth[monthOfOrder-1] += itemCost
            }
          })

          // calculate total customers
          if(customersIdsByMonth[monthOfOrder-1].indexOf(order.user) === -1){
            customersIdsByMonth[monthOfOrder-1].push(order.user)
          }

        })

         customersIdsByMonth.forEach((customers,index)=>{
          customersByMonth[index] = customers.length
         })
         monthlyIncomeChartDetails.datasets[0].data=incomeByMonth
         monthlyOrderCountChartDetails.datasets[0].data=orderCountByMonth
         monthlyCustomerCountChartDetails.datasets[0].data=customersByMonth
         this.setState({monthlyIncomeChartDetails,monthlyOrderCountChartDetails,monthlyCustomerCountChartDetails})
  }

  componentDidMount = () => {
    this.loadShopAnalysis()
  }

  render() {
    const {classes} = this.props
    return (
    <div  className={classes.root}>
      <Grid container spacing={40}>
        <Grid item xs={12} sm={12}>
            <Typography type="title" className={classes.title}>
                  Analysis of {this.match.params.shop}
            </Typography>
        </Grid>
        <Grid item xs={4} sm={4}>
            <StatCard count={this.state.noOfOrders} text='Orders Placed today' image={require('../assets/images/order_img.png')}/>
            <StatCard count={this.state.totalIncome} text='Total income today (Rs.)' image={require('../assets/images/income_img.png')}/>
            <StatCard count={this.state.totalCustomers} text='Total customers today' image={require('../assets/images/customer_img.png')}/>
        </Grid>
        <Grid item xs={8} sm={8}>
          <div>
            <h2>Monthly Income</h2>
            <Bar
              data={this.state.monthlyIncomeChartDetails}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: false
              }}
            />
          </div>
          <div>
            <h2>Monthly Order Count</h2>
            <Bar
              data={this.state.monthlyOrderCountChartDetails}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: false
              }}
            />
          </div>
          <div>
            <h2>Monthly Customer Count</h2>
            <Bar
              data={this.state.monthlyCustomerCountChartDetails}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: false
              }}
            />
          </div>
        </Grid>
      </Grid>
    </div>)
  }
}

ShopAnalysis.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ShopAnalysis)
