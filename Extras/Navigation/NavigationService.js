import { StackActions, NavigationActions } from 'react-navigation'

let _navigator

function setTopLevelNavigator (navigatorRef) {
  _navigator = navigatorRef
}

function navigate (routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  )
}

function clearStackAndNavigate (routeName, params) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName, params })]
  })
  _navigator.dispatch(resetAction)
}

export default {
  navigate,
  clearStackAndNavigate,
  setTopLevelNavigator
}
