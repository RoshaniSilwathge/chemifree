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
import {getByOwner} from '../shop/api-shop.js'
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

const dailyIncomeByShopChartDetails = {
        labels: [],
        datasets: [
          {
            label: 'Income',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: []
          }
        ]
      }

const dailyOrderCountByShopChartDetails = {
        labels: [],
        datasets: [
          {
            label: 'Order',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: []
          }
        ]
      }

const dailyCustomerCountByShopChartDetails = {
        labels: [],
        datasets: [
          {
            label: 'Customers',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: []
          }
        ]
      }

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
      
class ShopsAnalysis extends Component {
  constructor({match}) {
    super()
    this.state = {
      myShops:[],
      noOfOrders:0,
      totalIncome:0,
      totalCustomers:0,
      monthlyIncomeChartDetails,
      monthlyOrderCountChartDetails,
      monthlyCustomerCountChartDetails,
      dailyIncomeByShopChartDetails,
      dailyOrderCountByShopChartDetails,
      dailyCustomerCountByShopChartDetails
    }
    this.match = match
  }

  loadShopsAnalysis = () => {
    const jwt = auth.isAuthenticated()
    this.loadMyShops(jwt) 
  }

  loadMyShops = (jwt) => {
    getByOwner({
          userId: jwt.user._id
        }, {t: jwt.token}).then((data) => {
          if (data.error) {
            console.log(data)
          } else {
            this.loadMyShopStats(data,jwt)
          }
    })
  }

  loadMyShopStats = (myShops,jwt) =>{

    let noOfOrders = 0
    let totalIncome = 0
    let totalCustomers = 0
    let totalIncomeByShop = []
    let totalOrderCountByShop = []
    let totalCustomerCountByShop = []
    let totalMonthlyIncome = [0,0,0,0,0,0,0,0,0,0,0,0]
    let totalMonthlyOrderCount = [0,0,0,0,0,0,0,0,0,0,0,0]
    let totalMonthlyCustomersCount = [0,0,0,0,0,0,0,0,0,0,0,0]
    let shopLabels = []
    let resultsForToday = []
    let resultsForYear = []

    myShops.forEach((shop,index) => {
      // load orders placed within today
      resultsForToday.push(getShopOrdersPlacedToday({
          shopId: shop._id
        }, {t: jwt.token}))

      resultsForYear.push( getOrdersPlacedWithinThisYear({
          shopId: shop._id
        }, {t: jwt.token}))
        
    })

    Promise.all(resultsForToday).then(result=>{
      result.forEach((res,index) => {
        let stats = this.generateStatBlockData(res)
        noOfOrders += stats.noOfOrders
        totalIncome += stats.totalIncome
        totalCustomers += stats.totalCustomers
        totalIncomeByShop.push(stats.totalIncome)
        totalOrderCountByShop.push(stats.noOfOrders)
        totalCustomerCountByShop.push(stats.totalCustomers)
        shopLabels.push(myShops[index].name)
        myShops[index] = Object.assign(stats,myShops[index])
      })
      
      dailyIncomeByShopChartDetails.labels = shopLabels
      dailyIncomeByShopChartDetails.datasets[0].data = totalIncomeByShop
      dailyOrderCountByShopChartDetails.labels = shopLabels
      dailyOrderCountByShopChartDetails.datasets[0].data = totalOrderCountByShop
      dailyCustomerCountByShopChartDetails.labels = shopLabels
      dailyCustomerCountByShopChartDetails.datasets[0].data = totalCustomerCountByShop
      this.setState({noOfOrders,totalCustomers,totalIncome,myShops,dailyIncomeByShopChartDetails,dailyOrderCountByShopChartDetails,dailyCustomerCountByShopChartDetails})
    })
    // TO DO : Handle error

    Promise.all(resultsForYear).then(result=>{
      result.forEach((res,index) => {
        let stats = this.generateStatChartData(res,myShops[index]._id)
        stats.incomeByMonth.forEach((income,index)=>{
            totalMonthlyIncome[index] += income
        })
        stats.orderCountByMonth.forEach((orderCount,index)=>{
            totalMonthlyOrderCount[index] += orderCount
        })
        stats.customersByMonth.forEach((customerCount,index)=>{
            totalMonthlyCustomersCount[index] += customerCount
        })
      })

      monthlyIncomeChartDetails.datasets[0].data=totalMonthlyIncome
      monthlyOrderCountChartDetails.datasets[0].data=totalMonthlyOrderCount
      monthlyCustomerCountChartDetails.datasets[0].data=totalMonthlyCustomersCount
      this.setState({monthlyIncomeChartDetails,monthlyOrderCountChartDetails,monthlyCustomerCountChartDetails})
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
        return {noOfOrders,totalIncome,totalCustomers}
  }

  generateStatChartData = (orders,shopId) => {
         let incomeByMonth = [0,0,0,0,0,0,0,0,0,0,0,0]
         let orderCountByMonth = [0,0,0,0,0,0,0,0,0,0,0,0]
         let customersByMonth = [0,0,0,0,0,0,0,0,0,0,0,0]
         let customersIdsByMonth = [[],[],[],[],[],[],[],[],[],[],[],[]]
         orders.forEach(order => {
          // calculate income
          let monthOfOrder = order.month
          orderCountByMonth[monthOfOrder-1] +=1
          order.products.forEach(product=>{
            if(product.shop === shopId){
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
         return {incomeByMonth,orderCountByMonth,customersByMonth}
  }

  componentDidMount = () => {
    this.loadShopsAnalysis()
  }

  render() {
    const {classes} = this.props
    return (
    <div  className={classes.root}>
      <Grid container spacing={40}>
        <Grid item xs={12} sm={12}>
            <Typography type="title" className={classes.title}>
                  Analysis of My Shops
            </Typography>
        </Grid>
        <Grid item xs={4} sm={4}>
            <StatCard count={this.state.noOfOrders} text='Orders Placed today' image={require('../assets/images/order_img.png')}/>
            <StatCard count={this.state.totalIncome} text='Total income today (Rs.)' image={require('../assets/images/income_img.png')}/>
            <StatCard count={this.state.totalCustomers} text='Total customers today' image={require('../assets/images/customer_img.png')}/>
        </Grid>
        <Grid item xs={8} sm={8}>
          <div>
            <h2>Daily Income by Shop</h2>
            <Bar
              data={this.state.dailyIncomeByShopChartDetails}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: false
              }}
            />
          </div>
          <div>
            <h2>Daily Order Count by Shop</h2>
            <Bar
              data={this.state.dailyOrderCountByShopChartDetails}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: false
              }}
            />
          </div>
          <div>
            <h2>Daily Customer Count by Shop</h2>
            <Bar
              data={this.state.dailyCustomerCountByShopChartDetails}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: false
              }}
            />
          </div>
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

ShopsAnalysis.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ShopsAnalysis)
