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
			// AsyncStorage.setItem('chef', JSON.stringify({
			// 	"auth_token": "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OTd9.JSvCrNXkn91DyRtROCR_NOC7bqxMOZoXWIhLQLEpj0sX",
			// 	"country": "United States",
			// 	"created_at": "2020-08-08T15:26:17.878Z",
			// 	"deactivated": false,
			// 	"e_mail": "markpothers@hotmail.com",
			// 	"first_name": null,
			// 	"hex": "d8a61ace5c6f70dd443a26f3705ae84d350e276c",
			// 	"id": 97,
			// 	"image_url": "https://storage.googleapis.com/download/storage/v1/b/chef-avatars-ac1cff8d11c908f3cf8613121b61683221152250/o/d8a61ace5c6f70dd443a26f3705ae84d350e276c.jpg?generation=1597808270098251&alt=media",
			// 	"is_admin": false,
			// 	"is_member": false,
			// 	"last_name": null,
			// 	"password_is_auto": false,
			// 	"profile_text": "I like baking bread",
			// 	"username": "pothers",
			// }), () => { })
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
