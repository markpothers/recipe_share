import React from "react"
import { View, ImageBackground, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { loadToken } from "../auxFunctions/saveLoadToken"
import { connect } from "react-redux"
import { styles } from "./usersStyleSheet"

const mapStateToProps = (state) => ({
	e_mail: state.loginUserDetails.e_mail,
	password: state.loginUserDetails.password,
	loggedInChef: state.loggedInChef,
	stayingLoggedIn: state.stayLoggedIn,
})

const mapDispatchToProps = {
	updateLoggedInChefInState: (id, e_mail, username, auth_token, image_url, is_admin) => {
		return dispatch => {
			dispatch({ type: "UPDATE_LOGGED_IN_CHEF", id: id, e_mail: e_mail, username: username, auth_token: auth_token, image_url: image_url, is_admin: is_admin })
		}
	},
	stayLoggedIn: (value) => {
		return dispatch => {
			dispatch({ type: "STAY_LOGGED_IN", value: value })
		}
	},
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class AppLoading extends React.Component {
		static navigationOptions = {
			header: null,
		};

		componentDidMount = async () => {
			let token = await loadToken()
			if (token) {
				let storedChef = JSON.parse(await AsyncStorage.getItem("chef"))
				if (storedChef != null) {
					storedChef.auth_token = token
					await this.props.stayLoggedIn(true)
					this.props.updateLoggedInChefInState(storedChef.id, storedChef.e_mail, storedChef.username, storedChef.auth_token, storedChef.image_url, storedChef.is_admin, storedChef.is_member)
					await this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: true })
				} else {
					await this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: false })
				}
			} else {
				await this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: false })
			}
		}

		render() {
			return (
				<View style={styles.mainPageContainer}>
					<ImageBackground source={require("../dataComponents/spinach.jpg")} style={styles.background} imageStyle={styles.backgroundImageStyle}>
						<View style={styles.logoContainer}>
							<Image
								style={styles.logo}
								resizeMode={"contain"}
								source={require("../dataComponents/yellowLogo.png")}
								testID={"yellowLogo"}
							/>
						</View>
					</ImageBackground>
				</View>
			)
		}

	}
)
