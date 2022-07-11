import React from "react";
import { connect } from "react-redux";
import MainDrawerNavigator from "./MainDrawerNavigator";

const mapStateToProps = (state) => ({
	loggedInChef: state.loggedInChef,
});

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	class MainDrawerNavigatorContainer extends React.Component {
		static router = MainDrawerNavigator.router;
		static navigationOptions = {
			header: null,
		};

		state = {};

		render() {
			return (
				<MainDrawerNavigator
					navigation={this.props.navigation}
					setLoadedAndLoggedIn={this.props.setLoadedAndLoggedIn}
				/>
			);
		}
	}
);
