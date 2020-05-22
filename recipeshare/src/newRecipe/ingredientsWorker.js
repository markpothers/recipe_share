import React from 'react'

  export const fetchIngredientsForAutoComplete = async() => {
    const ingredients = await fetchIngredients(this.props.loggedInChef.auth_token)
    if (ingredients) {
      this.setState({ingredientsList: ingredients})
    }
  }

