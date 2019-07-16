import React from 'react'
import { Modal, Text, View, TouchableOpacity, Switch, Dimensions, Picker } from 'react-native'
import { styles } from './filterMenuStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import { cuisines } from '../dataComponents/cuisines'
import { clearedFilters } from '../dataComponents/clearedFilters'

const mapStateToProps = (state) => ({
    all_Recipes: state.recipes.all,
    chef_Recipes: state.recipes.chef,
    chef_feed_Recipes: state.recipes.chef_feed,
    chef_liked_Recipes: state.recipes.chef_liked,
    chef_made_Recipes: state.recipes.chef_made,
    global_ranks_Recipes: state.recipes.global_ranks,
    most_liked_Recipes: state.recipes.most_liked,
    most_made_Recipes: state.recipes.most_made,
    recipes_details: state.recipes_details,
    loggedInChef: state.loggedInChef,
    global_ranking: state.global_ranking,
    filter_settings: state.filter_settings,
    cuisine: state.cuisine,
})

const mapDispatchToProps = {
    switchFilterValue: (category, value) => {
      return dispatch => {
        dispatch({ type: 'TOGGLE_FILTER_CATEGORY', category: category, value: value})
      }
    },
    clearFilters: () => {
        return dispatch => {
          dispatch({ type: 'CLEAR_FILTERS', clearedFilters: clearedFilters})
        }
      },
    setCuisine: (cuisine) => {
    return dispatch => {
        dispatch({ type: 'SET_CUISINE', cuisine: cuisine})
    }
    },
  }

export default connect(mapStateToProps, mapDispatchToProps)(
    class FilterMenu extends React.PureComponent{

        handleClearFilterButton = async() =>{
            await this.props.clearFilters()
            this.props.closeFilterAndRefresh()
        }

        renderLeftColumnCategories = () => {
            // console.log(Object.keys(this.props.filter_settings).sort().filter( (cat, index) => index <= keysPerCol ))
            return Object.keys(this.props.filter_settings).sort().filter( (cat, index) => index % 2 === 0 ).map( category => {
                return (
                    <View 
                        style={styles.columnRow}
                        key={category}>
                        <View style={styles.switchContainer}>
                            <Switch value={this.props.filter_settings[category]} onChange={(e) => this.props.switchFilterValue(category, e.nativeEvent.value)}/>
                        </View>
                        <View style={styles.categoryContainer}>
                            <Text style={styles.categoryText}>{category}</Text>
                        </View>
                    </View>
                )
            })
        }

        renderRightColumnCategories = () => {
            return Object.keys(this.props.filter_settings).sort().filter( (cat, index) => index % 2 !== 0 ).map( category => {
                return (
                    <View style={styles.columnRow} key={category}>
                        <View style={styles.switchContainer}>
                            <Switch value={this.props.filter_settings[category]} onChange={(e) => this.props.switchFilterValue(category, e.nativeEvent.value)}/>
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

        render() {
            // console.log(store)
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
                                <Text style={styles.title}>Apply filters to recipes list</Text>
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
                                        onValueChange={e => this.props.setCuisine(e)}
                                        >
                                        <Picker.Item style={styles.pickerText} key={this.props.cuisine} label={this.props.cuisine} value={this.props.cuisine} />
                                            {this.cuisinesPicker()}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.clearFiltersButtonContainer}>
                                    <TouchableOpacity style={styles.clearFiltersButton} activeOpacity={0.7} title="clearFilters" onPress={this.handleClearFilterButton}>
                                        <Icon style={styles.clearFiltersIcon} size={25} name='cancel' />
                                        <Text style={styles.clearFiltersButtonText}>Clear{"\n"}filters</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.applyFiltersButton} activeOpacity={0.7} title="applyFilters" onPress={this.props.closeFilterAndRefresh}>
                                        <Icon style={styles.applyFiltersIcon} size={25} name='check' />
                                        <Text style={styles.applyFiltersButtonText}>Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7} onPress={this.props.closeFilterAndRefresh}>
                            <Icon name='filter' size={24} style={styles.filterIcon}/>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )
        }
    }
)