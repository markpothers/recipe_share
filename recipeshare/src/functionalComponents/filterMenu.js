import React from 'react'
import { Modal, Text, View, TouchableOpacity, Switch, Dimensions, Picker, Platform } from 'react-native'
import { styles } from './filterMenuStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux'
import { cuisines } from '../dataComponents/cuisines'
import { serves } from '../dataComponents/serves'
import { clearedFilters } from '../dataComponents/clearedFilters'

const mapStateToProps = (state) => ({
    filter_settings: state.filter_settings,
    cuisine: state.cuisine,
    serves: state.serves,
    newRecipeFilterSettings: state.newRecipeDetails.filter_settings,
    newRecipeCuisine: state.newRecipeDetails.cuisine,
    newRecipeServes: state.newRecipeDetails.serves,
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
    setRecipesListServes: (serves) => {
        return dispatch => {
            dispatch({ type: 'SET_RECIPES_LIST_SERVES', serves: serves})
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
    setNewRecipeServes: (serves) => {
        return dispatch => {
            dispatch({ type: 'SET_NEW_RECIPE_SERVES', serves: serves})
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

        servesPicker = () => {
        return serves.sort((a,b) => a-b ).map( serve => {
            return <Picker.Item style={styles.pickerText} key={serve} label={serve} value={serve} />
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

        handleServesChange = (serves) => {
            this.props.newRecipe ? this.props.setNewRecipeServes(serves) : this.props.setRecipesListServes(serves)
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
                                    {Platform.OS === 'ios' ? <Icon2 style={styles.iOSdropDownIcon} size={15} name='select-arrows' /> : null}
                                    <Text style={styles.title}>Cuisine:</Text>
                                    <View picker style={styles.cuisinePicker} >
                                        <Picker style={styles.picker}
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        onValueChange={this.handleCuisineChange}
                                        selectedValue={selectedCuisine}
                                        >
                                        {/* <Picker.Item style={styles.pickerText} key={selectedCuisine} label={selectedCuisine} value={selectedCuisine} /> */}
                                            {this.cuisinesPicker()}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.bottomTopContainer}>
                                    {Platform.OS === 'ios' ? <Icon2 style={styles.iOSdropDownIcon} size={15} name='select-arrows' /> : null}
                                    <Text style={styles.title}>Serves: </Text>
                                    <View picker style={styles.cuisinePicker} >
                                        <Picker style={styles.picker}
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        onValueChange={this.handleServesChange}
                                        selectedValue={selectedServes}
                                        >
                                        {/* <Picker.Item style={styles.pickerText} key={selectedServes} label={selectedServes} value={selectedServes} /> */}
                                            {this.servesPicker()}
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