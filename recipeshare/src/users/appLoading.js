import React from 'react'
import { AsyncStorage, View, ImageBackground, Image } from 'react-native'
import { connect } from 'react-redux'
import { styles } from './usersStyleSheet'

const mapStateToProps = (state) => ({
	e_mail: state.loginUserDetails.e_mail,
	password: state.loginUserDetails.password,
	loggedInChef: state.loggedInChef,
	stayingLoggedIn: state.stayLoggedIn,
})

const mapDispatchToProps = {
	updateLoggedInChefInState: (id, username, auth_token, image_url, is_admin) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username, auth_token: auth_token, image_url: image_url, is_admin: is_admin })
		}
	},
	stayLoggedIn: (value) => {
		return dispatch => {
			dispatch({ type: 'STAY_LOGGED_IN', value: value })
		}
	},
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class AppLoading extends React.Component {
		static navigationOptions = {
			header: null,
		};

		componentDidMount = () => {
			// AsyncStorage.removeItem('chef', () => {})
			AsyncStorage.getItem('chef', (err, res) => {
				if (res != null) {
					const loggedInChef = JSON.parse(res)
					// console.log(loggedInChef)
					this.props.stayLoggedIn(true)
					this.props.updateLoggedInChefInState(loggedInChef.id, loggedInChef.username, loggedInChef.auth_token, loggedInChef.image_url, loggedInChef.is_admin, loggedInChef.is_member)
					this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: true })
				} else {
					this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: false })

				}
			})
		}

		componentWillUnmount = () => {
		}

		render() {
			return (
				<View style={styles.mainPageContainer}>
					<ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.background} imageStyle={styles.backgroundImageStyle}>
						<View style={styles.logoContainer}>
							<Image style={styles.logo} resizeMode={"contain"} source={require('../dataComponents/yellowLogo.png')} />
						</View>
					</ImageBackground>
				</View>
			)
		}

	}
)
