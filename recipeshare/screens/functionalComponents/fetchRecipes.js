// import React from 'react'
// import {connect} from 'react-redux'

// const mapStateToProps = state => {
//     console.log(state)
//     return {
//         chefID: state.chefID
//     }
// }

// const mapDispatchToProps = {
//     fetchAllRecipes: () => {
//         return dispatch => {
//             fetch('http://10.185.4.207:3000')
//             .then(res => res.json())
//             .then(recipes => {
//                 dispatch({ type: 'STORE_ALL_RECIPES', allRecipes: {recipes}})
//             })
//         }
//     }
// }

// const myConnector = connect(mapStateToProps, mapDispatchToProps)

// class FetchRecipes extends React.Component {

//     render(){
//         return (
//             <React.Fragment>
//             </React.Fragment>
//         )
//     }

// }

// export const fetchRecipes = myConnector(FetchRecipes)