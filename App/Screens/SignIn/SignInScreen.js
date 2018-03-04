import React, { Component } from 'react'
import { View } from 'react-native'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { firebaseConnect } from 'react-redux-firebase'
import Firebase from 'react-native-firebase'
import { NavigationActions } from 'react-navigation'
import Video from 'react-native-video'
import RNRestart from 'react-native-restart'

import Button from '../Components/Button'
import BackgroundVideo from '../../Assets/Videos/BackgroundVideo2.mp4'

import { Fonts } from '../../Themes'
import Styles from './Styles/SignInStyles'

@firebaseConnect()
class SignInScreen extends Component {
  constructor (props) {
    super(props)

    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleError = this.handleError.bind(this)
    this.state = {
      emailError: null,
      passwordError: null,
      email: null,
      password: null
    }
  }

  handleSignIn () {
    this.props.firebase.login({email: this.state.email, password: this.state.password})
      // .then(() => RNRestart.Restart()) // Part time fix for sign in bug
      .catch((error) => {
        this.handleError(error)
      })
  }

  handleError (error) {
    console.tron.error(error)
    switch (error.code) {
      case 'auth/invalid-email':
        this.setState({ emailError: <FormValidationMessage>{'An invalid email was entered. Please check again.'}</FormValidationMessage> })
        break
      case 'auth/wrong-password':
        this.setState({ passwordError: <FormValidationMessage>{'The provided password does not match. Please check agian.'}</FormValidationMessage> })
        break
      default:
        if (!__DEV__) {
          Firebase.fabric.crashlytics().log('Auth Error: Unknown Error Code')
          Firebase.fabric.crashlytics().report(error)
        }
        break
    }
  }

  render () {
    return (
      <View style={Styles.mainContainer}>

        <Video
          source={BackgroundVideo}
          rate={1.0}
          muted
          resizeMode={'cover'}
          repeat
          style={Styles.video}
        />
        <View style={Styles.overlay} />

        <View style={Styles.contentView}>
          <View style={Styles.form}>
            <FormLabel containerStyle={Styles.formLabelContainer} labelStyle={Styles.formLabelText} fontFamily={Fonts.type.content}>E-Mail</FormLabel>
            <FormInput
              inputStyle={Styles.formInputText}
              autoCapitalize='none'
              keyboardType='email-address'
              onChangeText={email => this.setState({ emailError: null, email: email })}
              shake={this.state.emailError} />
            {this.state.emailError}
            <FormLabel containerStyle={Styles.formLabelContainer} labelStyle={Styles.formLabelText} fontFamily={Fonts.type.content}>Password</FormLabel>
            <FormInput
              inputStyle={Styles.formInputText}
              autoCapitalize='none'
              secureTextEntry
              onChangeText={password => this.setState({ passwordError: null, password: password })}
              shake={this.state.passwordError} />
            {this.state.passwordError}
          </View>
        </View>

        {/* Footer */}
        <View style={Styles.bottomButton}>
          <Button text={'Log In'} onPress={this.handleSignIn} />
        </View>

      </View>
    )
  }
}

export default SignInScreen
