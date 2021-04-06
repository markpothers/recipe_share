import React from 'react'
import { Modal, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { styles } from './filterMenuStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import { cuisines } from '../dataComponents/cuisines'
import { serves } from '../dataComponents/serves'
import { clearedFilters } from '../dataComponents/clearedFilters'
import DualOSPicker from '../dualOSPicker/DualOSPicker'
import SwitchSized from '../switchSized/switchSized'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

const mapStateToProps = (state) => ({
	filter_settings: state.filter_settings,
	filterCuisines: state.filterCuisines,
	serves: state.serves,
	cuisineChoices: state.cuisineChoices,
	servesChoices: state.servesChoices,
	filterChoices: state.filterChoices
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
	setRecipesListCuisine: (cuisine, listChoice) => {
		return dispatch => {
			dispatch({ type: 'SET_RECIPES_LIST_CUISINE', cuisine: cuisine, listChoice: listChoice })
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
			const filterChoices = this.props.filterChoices[this.props.listChoice].map(choice => (choice.charAt(0).toUpperCase() + choice.slice(1)).replace("_", " "))
			return Object.keys(filtersList).sort().map(category => {
				return (
					<View
						style={styles.filterItemContainer}
						key={category}>
						<View style={styles.switchContainer}>
							<SwitchSized
								value={filtersList[category]}
								onValueChange={(value) => this.handleCategoryChange(category, value)}
								disabled={!filterChoices.includes(category)}
							/>
						</View>
						<View style={styles.categoryContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.categoryText}>{category}</Text>
						</View>
					</View>
				)
			})
		}

		handleApplyButton = () => {
			this.props.newRecipe ? this.props.handleCategoriesButton() : this.props.closeFilterAndRefresh()
		}

		handleCategoryChange = async(category, value) => {
			await this.props.newRecipe ? this.props.switchNewRecipeFilterValue(category) : this.props.switchRecipesListFilterValue(category, value)
			await this.props.fetchFilterChoices()
		}

		handleCuisineChange = async(cuisine) => {
			await this.props.newRecipe ? this.props.setNewRecipeCuisine(cuisine, "cuisine") : this.props.setRecipesListCuisine(cuisine, this.props.listChoice)
			await this.props.fetchFilterChoices()
		}

		handleServesChange = async(serves) => {
			await this.props.newRecipe ? this.props.setNewRecipeServes(serves, "serves") : this.props.setRecipesListServes(serves)
			await this.props.fetchFilterChoices()
		}

		handleClearButton = async() => {
			await this.props.newRecipe ? this.props.clearNewRecipeFilters() : this.props.clearRecipesListFilters()
			await this.handleCuisineChange("Any")
			await this.handleServesChange("Any")
			await this.props.clearSearchTerm()
			await this.props.fetchFilterChoices()
		}

		render() {
			// console.log(this.props.cuisineChoices)
			let selectedCuisine = this.props.newRecipe ? this.props.newRecipeCuisine : this.props.filterCuisines[this.props.listChoice]
			let selectedServes = this.props.newRecipe ? this.props.newRecipeServes : this.props.serves

			let cuisineOptions = cuisines
			let servesOptions = serves
			if (!this.props.newRecipe) {
				cuisineOptions = this.props.cuisineChoices[this.props.listChoice]
				if (!cuisineOptions || cuisineOptions.length == 0) {
					cuisineOptions = ["Any"]
				}

				servesOptions = this.props.servesChoices[this.props.listChoice].map(serve => serve.toString())
				servesOptions = ["Any", ...servesOptions]
			}

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
									{this.renderFilterItems()}
								</View>
							</ScrollView>
							<View style={styles.bottomContainer}>
								<View style={styles.bottomTopContainer}>
									<Text maxFontSizeMultiplier={2} style={styles.title}>Cuisine:</Text>
									<View style={styles.picker} >
										<DualOSPicker
											onChoiceChange={this.handleCuisineChange}
											options={cuisineOptions}
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
											options={servesOptions}
											selectedChoice={selectedServes}
											textAlignment={"flex-start"}
										/>
									</View>
								</View>
								<View style={styles.clearFiltersButtonContainer}>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} title="clearFilters" onPress={this.handleClearButton}>
										<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='cancel' />
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Clear{"\n"}filters</Text>
									</TouchableOpacity>
									<TouchableOpacity style={centralStyles.greenRectangleButton} activeOpacity={0.7} title="applyFilters" onPress={this.handleApplyButton}>
										<Icon style={centralStyles.yellowButtonIcon} size={responsiveHeight(4)} name='check' />
										<Text maxFontSizeMultiplier={2} style={centralStyles.yellowButtonText}>{this.props.confirmButtonText}</Text>
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
