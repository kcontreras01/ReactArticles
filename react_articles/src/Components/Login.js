import React, { Component } from 'react';
//import {TextLoop, Link, BodyText} from 'react-text-loop'
import axios from 'axios';

// login component
// this will render when the user auth mode is set to login
class Login extends Component {
  constructor(){
    super();
    // set default state
    this.state = {
      // we have 2 inputs that we will be changing
      inputs: {
        email: '',
        password: ''
      }
    }
    this.setUser = this.setUser.bind(this);

  }

  // method to log in
  login(e){
    e.preventDefault(); // prevent default form action
    // send request to make sure the email and password are correct
    axios.post(`${this.props.url}/login`, this.state.inputs)
      .then(res => { // set the user based off of the response
        this.props.setUser(res.data);
      })
  }

  // method to change an input
  changeInput(e, input){
    const val = e.target.value;
    this.setState(prev => { // sets the state for that input to the value
      prev.inputs[input] = val;
      return prev;
    });
  }

  // method to initialize our user
  initUser(){
    // get the token from the cookie
    const token = Cookies.get('token');

    // if there is a token
    if(token && token !== ''){
      // send a request to our API to validate the user
      axios.get(`${this.state.url}/users/validate`, {
        // include the token as a parameter
        params: {auth_token: token}})
        .then(res => { // the response will be the user
          // set the user in the state, and change the mode to content
          this.setState({user: res.data, mode: 'content'});
        })
        .catch(err => { // if there is an error
          Cookies.set('token', '') // take away the cookie
          // change the state so that there is no user and render the auth
          this.setState({user: false, mode: 'auth'});
        })
    } else { // if there is no token
      // we should render the auth forms
      this.setState({mode: 'auth'});
    }
  }

  // method to set a user
  setUser(user){
    // set a cookie with the user's token
    Cookies.set('token', user.token);
    // set state to have the user and the mode to content
    this.setState({user: user, mode: 'content'});
  }

  render(){
    return(
      <div>
      <div className='loginBackground'>
      </div>
      <section>
      <div className="auth-form">

        <div className='loginHead'><h1>Articles</h1></div>

        <form className='loginForm' onSubmit={this.login.bind(this)}>
          <label htmlFor='email'>EMAIL:</label>
          <input placeholder="JohnSmith@js.com" className='searchBar' value={this.state.inputs.email}
            id='email' name='email' type='email'
            onChange={e => this.changeInput(e, 'email')}
          />

          <label htmlFor='password'>PASSWORD:</label>
          <input placeholder="**********" className='searchBar' value={this.state.inputs.password}
            id='password' name='password' type='password'
            onChange={e => this.changeInput(e, 'password')}
          />

          <div className="form-buttons">
            <button type="submit" className="login-form-button">Log In</button>
            <button onClick={this.props.toggleMode} className="login-form-button">Sign Up</button>
          </div>
        </form>
      </div>   
      </section>
      <footer>footer</footer>
      </div>
    )
  }
}
export default Login;
