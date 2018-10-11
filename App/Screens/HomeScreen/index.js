import React, { Component } from 'react'
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native'
import { firebaseConnect, populate } from 'react-redux-firebase'
import CurrentSeminarCard from '../../Components/CurrentSeminarCard'
import { connect } from 'react-redux'
// import Firebase from 'firebase'
import { MaterialIcons } from '@expo/vector-icons'
import BlueButton from '../../Components/Button'
import { profilePopulates } from '../../../Extras/Config/FirebaseConfig'

import Styles from './Styles'

@firebaseConnect()
@connect(
  ({ firebase }) => {
    return { profile: populate(firebase, 'profile', profilePopulates) }
  }
)
export default class HomeScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: Dimensions.get('window').width
    }
  }

  getAndFormatTeachers = () => {
    const profile = this.props.profile

    let defaultTeacherCards = null
    let requestedTeacherCards = null

    if (!profile.isLoaded) { return null } // Sanity Check

    if (profile.defaultTeachers) {
      defaultTeacherCards = Object.keys(profile.defaultTeachers).map(defaultDay => {
        let teacherID = profile.defaultTeachers[defaultDay]
        let teacherProfile = profile.school.teachers[teacherID]

        return <CurrentSeminarCard key={teacherProfile.id} day={defaultDay} teacher={teacherProfile} />
      })
    }

    if (profile.requests) {
      requestedTeacherCards = Object.keys(profile.requests).map(requestID => {
        // TODO: Figure out how requests are structured
        // let request = profile.school.requests[requestID]
        return null
      })
    }

    return {
      defaultCards: defaultTeacherCards,
      requestCards: requestedTeacherCards
    }
  }

  render () {
    let cards = this.getAndFormatTeachers()

    if (cards == null) {
      return (
        <View style={Styles.loadingView}>
          <ActivityIndicator size='large' animating />
        </View>
      )
    }

    return (
      <View style={Styles.mainContainer}>
        <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center', width: this.state.width }}>
          <ScrollView>

            <Text style={Styles.header}>Requests</Text>
            {cards.requestCards}
            <Text style={Styles.header}>Regular Homerooms</Text>
            {cards.defaultCards}

          </ScrollView>
        </View>

        {/* Footer */}
        <View style={{ flex: 1, justifyContent: 'center', height: this.state.width, margin: 20 }}>
          <BlueButton onPress={() => this.props.navigation.navigate('SearchScreen')} >
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', width: '100%', paddingTop: 10 }} >
              <MaterialIcons name='add' size={32} color='white' />
              <Text style={Styles.requestText}>Request</Text>
            </View>
          </BlueButton>
        </View>
      </View>
    )
  }
}
