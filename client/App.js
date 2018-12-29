import React from 'react'
import MainRouter from './MainRouter'
import {BrowserRouter} from 'react-router-dom'
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles'
import { blueGrey, lightGreen } from 'material-ui/colors'
import { hot } from 'react-hot-loader'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
    light: '#9BDEAC',
    main: '#3CB371',
    dark: '#3CB371',
    contrastText: '#fff',
  },
  secondary: {
    light: '#e7ff8c',
    main: '#EE6C4D',
    dark: '#7ecb20',
    contrastText: '#000',
  },
    openTitle: '#3CB371',
    protectedTitle: '#9BDEAC',
    type: 'light'
  }
})

const App = () => (
  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <MainRouter/>
    </MuiThemeProvider>
  </BrowserRouter>
)

export default hot(module)(App)
