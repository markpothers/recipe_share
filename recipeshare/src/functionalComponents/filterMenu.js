import React from 'react'
import { Modal, Text, View, TouchableOpacity, Switch, Dimensions, Picker } from 'react-native'
import { styles } from './filterMenuStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import { cuisines } from '../dataComponents/cuisines'
import { clearedFilters } from '../dataComponents/clearedFilters'

const mapStateToProps = (state) => ({
    filter_settings: state.filter_settings,
    cuisine: state.cuisine,
    newRecipeFilterSettings: state.newRecipeDetails.filter_settings,
    newRecipeCuisine: state.newRecipeDetails.cuisine,
})

const mapDispatchToProps = {
    switchRecipesListFilterValue: (category, value) => {
      return dispatch => {
        dispatch({ type: 'TOGGLE_RECIPES_LIST_FILTER_CATEGORY', category: category, value: value})
      }
    },
    clearRecipesListFilters: () => {
        return dispatch => {
          dispatch({ type: 'CLEAR_RECIPES_LIST_FILTERS', clearedFilters: clearedFilters})
        }
      },
      setRecipesListCuisine: (cuisine) => {
    return dispatch => {
        dispatch({ type: 'SET_RECIPES_LIST_CUISINE', cuisine: cuisine})
    }
    },
    switchNewRecipeFilterValue: (category, value) => {
        return dispatch => {
          dispatch({ type: 'TOGGLE_NEW_RECIPE_FILTER_CATEGORY', category: category, value: value})
        }
      },
      clearNewRecipeFilters: () => {
          return dispatch => {
            dispatch({ type: 'CLEAR_NEW_RECIPE_FILTERS', clearedFilters: clearedFilters})
          }
        },
    setNewRecipeCuisine: (cuisine) => {
        return dispatch => {
            dispatch({ type: 'SET_NEW_RECIPE_CUISINE', cuisine: cuisine})
        }
    },
  }

export default connect(mapStateToProps, mapDispatchToProps)(
    class FilterMenu extends React.PureComponent{

        renderLeftColumnCategories = () => {
            // console.log(Object.keys(this.props.filter_settings).sort().filter( (cat, index) => index <= keysPerCol ))
            const filtersList = this.props.newRecipe ? this.props.newRecipeFilterSettings : this.props.filter_settings
            return Object.keys(filtersList).sort().filter( (cat, index) => index % 2 === 0 ).map( category => {
                return (
                    <View 
                        style={styles.columnRow}
                        key={category}>
                        <View style={styles.switchContainer}>
                            <Switch value={filtersList[category]} onChange={(e) => this.handleCategoryChange(category, e.nativeEvent.value)}/>
                        </View>
                        <View style={styles.categoryContainer}>
                            <Text style={styles.categoryText}>{category}</Text>
                        </View>
                    </View>
                )
            })
        }

        renderRightColumnCategories = () => {
            const filtersList = this.props.newRecipe ? this.props.newRecipeFilterSettings : this.props.filter_settings
            return Object.keys(filtersList).sort().filter( (cat, index) => index % 2 !== 0 ).map( category => {
                return (
                    <View style={styles.columnRow} key={category}>
                        <View style={styles.switchContainer}>
                            <Switch value={filtersList[category]} onChange={(e) => this.handleCategoryChange(category, e.nativeEvent.value)}/>
                        </View>
                        <View style={styles.categoryContainer}>
                            <Text style={styles.categoryText}>{category}</Text>
                        </View>
                    </View>
                )
            })
        }

        cuisinesPicker = () => {
            return cuisines.sort().map( cuisine => {
              return <Picker.Item style={styles.pickerText} key={cuisine} label={cuisine} value={cuisine} />
            })
          }

        handleApplyButton = () => {
            this.props.newRecipe ? this.props.handleCategoriesButton() : this.props.closeFilterAndRefresh()
        }

        handleCategoryChange = (category, value) => {
            this.props.newRecipe ? this.props.switchNewRecipeFilterValue(category, value) : this.props.switchRecipesListFilterValue(category, value)
        }

        handleCuisineChange = (cuisine) => {
            this.props.newRecipe ? this.props.setNewRecipeCuisine(cuisine) : this.props.setRecipesListCuisine(cuisine)
        }

        handleClearButton = () => {
            this.props.newRecipe ? this.props.clearNewRecipeFilters() : this.props.clearRecipesListFilters()
        }

        render() {
            // console.log(store)
            let selectedCuisine = this.props.newRecipe ? this.props.newRecipeCuisine : this.props.cuisine
            return (
                <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                >
                    <View style={[styles.modalFullScreenContainer, {height: Dimensions.get('window').height,
                            width: Dimensions.get('window').width,
                            }]}>
                        <View style={styles.contentsContainer}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{this.props.title}</Text>
                            </View>
                            <View style={styles.columnsContainer}>
                                <View style={styles.column}>
                                    {this.renderLeftColumnCategories()}
                                </View>
                                <View style={styles.column}>
                                    {this.renderRightColumnCategories()}
                                </View>
                            </View>
                            <View style={styles.bottomContainer}>
                                <View style={styles.bottomTopContainer}>
                                    <Text style={styles.title}>Cuisine:</Text>
                                    <View picker style={styles.cuisinePicker} >
                                        <Picker style={styles.picker}
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        onValueChange={this.handleCuisineChange}
                                        >
                                        <Picker.Item style={styles.pickerText} key={selectedCuisine} label={selectedCuisine} value={selectedCuisine} />
                                            {this.cuisinesPicker()}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.clearFiltersButtonContainer}>
                                    <TouchableOpacity style={styles.clearFiltersButton} activeOpacity={0.7} title="clearFilters" onPress={this.handleClearButton}>
                                        <Icon style={styles.clearFiltersIcon} size={25} name='cancel' />
                                        <Text style={styles.clearFiltersButtonText}>Clear{"\n"}filters</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.applyFiltersButton} activeOpacity={0.7} title="applyFilters" onPress={this.handleApplyButton}>
                                        <Icon style={styles.applyFiltersIcon} size={25} name='check' />
                                        <Text style={styles.applyFiltersButtonText}>{this.props.confirmButtonText}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {/* <TouchableOpacity style={styles.filterButton} activeOpacity={0.7} onPress={this.handleApplyButton}>
                            <Icon name='filter' size={24} style={styles.filterIcon}/>
                        </TouchableOpacity> */}
                    </View>
                </Modal>
            )
        }
    }
)