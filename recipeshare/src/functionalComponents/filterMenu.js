import React from 'react'
import { Modal, Text, View, TouchableOpacity, Switch, Platform, ScrollView } from 'react-native'
import { styles } from './filterMenuStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import { cuisines } from '../dataComponents/cuisines'
import { serves } from '../dataComponents/serves'
import { clearedFilters } from '../dataComponents/clearedFilters'
import DualOSPicker from '../functionalComponents/DualOSPicker'

const mapStateToProps = (state) => ({
	filter_settings: state.filter_settings,
	cuisine: state.cuisine,
	serves: state.serves,
})

const mapDispatchToProps = {
	switchRecipesListFilterValue: (category, value) => {
		return dispatch => {
			dispatch({ type: 'TOGGLE_RECIPES_LIST_FILTER_CATEGORY', category: category, value: value })
		}
	},
	clearRecipesListFilters: () => {
		return dispatch => {
			dispatch({ type: 'CLEAR_RECIPES_LIST_FILTERS', clearedFilters: clearedFilters })
		}
	},
	setRecipesListCuisine: (cuisine) => {
		return dispatch => {
			dispatch({ type: 'SET_RECIPES_LIST_CUISINE', cuisine: cuisine })
		}
	},
	setRecipesListServes: (serves) => {
		return dispatch => {
			dispatch({ type: 'SET_RECIPES_LIST_SERVES', serves: serves })
		}
	},
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class FilterMenu extends React.PureComponent {

		renderFilterItems = () => {
			const filtersList = this.props.newRecipe ? this.props.newRecipeFilterSettings : this.props.filter_settings
			return Object.keys(filtersList).sort().map(category => {
				return (
					<View
						style={styles.filterItemContainer}
						key={category}>
						<View style={styles.switchContainer}>
							<Switch
								style={(Platform.OS == 'ios' ? { transform: [{ scaleX: .8 }, { scaleY: .8 }] } : null)}
								value={filtersList[category]}
								onChange={(e) => this.handleCategoryChange(category, e.nativeEvent.value)}
								trackColor={{ true: '#4b714299' }}
								thumbColor={filtersList[category] ? "#4b7142" : "#ececec"}
							/>
						</View>
						<View style={styles.categoryContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.categoryText}>{category}</Text>
						</View>
					</View>
				)
			})
		}

		// renderLeftColumnCategories = () => {
		// 	const filtersList = this.props.newRecipe ? this.props.newRecipeFilterSettings : this.props.filter_settings
		// 	return Object.keys(filtersList).sort().filter((cat, index) => index % 2 === 0).map(category => {
		// 		return (
		// 			<View
		// 				style={styles.columnRow}
		// 				key={category}>
		// 				<View style={styles.switchContainer}>
		// 					<Switch
		// 						style={(Platform.OS == 'ios' ? { transform: [{ scaleX: .8 }, { scaleY: .8 }] } : null)}
		// 						value={filtersList[category]}
		// 						onChange={(e) => this.handleCategoryChange(category, e.nativeEvent.value)}
		// 						trackColor={{ true: '#4b714299' }}
		// 						thumbColor={filtersList[category] ? "#4b7142" : null}
		// 					/>
		// 				</View>
		// 				<View style={styles.categoryContainer}>
		// 					<Text maxFontSizeMultiplier={2} style={styles.categoryText}>{category}</Text>
		// 				</View>
		// 			</View>
		// 		)
		// 	})
		// }

		// renderRightColumnCategories = () => {
		// 	const filtersList = this.props.newRecipe ? this.props.newRecipeFilterSettings : this.props.filter_settings
		// 	return Object.keys(filtersList).sort().filter((cat, index) => index % 2 !== 0).map(category => {
		// 		return (
		// 			<View style={styles.columnRow} key={category}>
		// 				<View style={styles.switchContainer}>
		// 					<Switch
		// 						style={(Platform.OS == 'ios' ? { transform: [{ scaleX: .8 }, { scaleY: .8 }] } : null)}
		// 						value={filtersList[category]}
		// 						onChange={(e) => this.handleCategoryChange(category, e.nativeEvent.value)}
		// 						trackColor={{ true: '#4b714299' }}
		// 						thumbColor={filtersList[category] ? "#4b7142" : null}
		// 					/>
		// 				</View>
		// 				<View style={styles.categoryContainer}>
		// 					<Text maxFontSizeMultiplier={2} style={styles.categoryText}>{category}</Text>
		// 				</View>
		// 			</View>
		// 		)
		// 	})
		// }

		handleApplyButton = () => {
			this.props.newRecipe ? this.props.handleCategoriesButton() : this.props.closeFilterAndRefresh()
		}

		handleCategoryChange = (category, value) => {
			this.props.newRecipe ? this.props.switchNewRecipeFilterValue(category) : this.props.switchRecipesListFilterValue(category, value)
		}

		handleCuisineChange = (cuisine) => {
			this.props.newRecipe ? this.props.setNewRecipeCuisine(cuisine, "cuisine") : this.props.setRecipesListCuisine(cuisine)
		}

		handleServesChange = (serves) => {
			this.props.newRecipe ? this.props.setNewRecipeServes(serves, "serves") : this.props.setRecipesListServes(serves)
		}

		handleClearButton = () => {
			this.props.newRecipe ? this.props.clearNewRecipeFilters() : this.props.clearRecipesListFilters()
		}

		render() {
			// console.log(Platform)
			let selectedCuisine = this.props.newRecipe ? this.props.newRecipeCuisine : this.props.cuisine
			let selectedServes = this.props.newRecipe ? this.props.newRecipeServes : this.props.serves
			return (
				<Modal
					animationType="fade"
					transparent={true}
					visible={true}
				>
					<View style={styles.modalFullScreenContainer}>
						<View style={styles.contentsContainer}>
							<View style={styles.titleContainer}>
								<Text maxFontSizeMultiplier={2} style={styles.title}>{this.props.title}</Text>
							</View>
							<ScrollView style={styles.categoriesScrollView}>
								<View style={styles.columnsContainer}>
									{/* <View style={styles.columnsInnerContainer}> */}
									{this.renderFilterItems()}
									{/* </View> */}
									{/* <View style={styles.column}>
										{this.renderLeftColumnCategories()}
									</View>
									<View style={styles.column}>
										{this.renderRightColumnCategories()}
									</View> */}
								</View>
							</ScrollView>
							<View style={styles.bottomContainer}>
								<View style={styles.bottomTopContainer}>
									<Text maxFontSizeMultiplier={2} style={styles.title}>Cuisine:</Text>
									<View style={styles.picker} >
										<DualOSPicker
											onChoiceChange={this.handleCuisineChange}
											options={cuisines}
											selectedChoice={selectedCuisine}
											textAlignment={"flex-start"}
										/>
									</View>
								</View>
								<View style={styles.bottomTopContainer}>
									<Text maxFontSizeMultiplier={2} style={styles.title}>Serves: </Text>
									<View style={styles.picker} >
										<DualOSPicker
											onChoiceChange={this.handleServesChange}
											options={serves}
											selectedChoice={selectedServes}
											textAlignment={"flex-start"}
										/>
									</View>
								</View>
								<View style={styles.clearFiltersButtonContainer}>
									<TouchableOpacity style={styles.clearFiltersButton} activeOpacity={0.7} title="clearFilters" onPress={this.handleClearButton}>
										<Icon style={styles.clearFiltersIcon} size={25} name='cancel' />
										<Text maxFontSizeMultiplier={2} style={styles.clearFiltersButtonText}>Clear{"\n"}filters</Text>
									</TouchableOpacity>
									<TouchableOpacity style={styles.applyFiltersButton} activeOpacity={0.7} title="applyFilters" onPress={this.handleApplyButton}>
										<Icon style={styles.applyFiltersIcon} size={25} name='check' />
										<Text maxFontSizeMultiplier={2} style={styles.applyFiltersButtonText}>{this.props.confirmButtonText}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			)
		}
	}
)
