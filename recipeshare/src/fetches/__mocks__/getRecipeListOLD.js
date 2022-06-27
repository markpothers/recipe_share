import { mockRecipeList } from "../../../__mocks__/mockRecipeList"

export const getRecipeList = () => {
    console.warn("mock fetch was called")
    // console.warn(mockRecipeList)
    return new Promise((resolve, reject) => {
        resolve(mockRecipeList)
    })
}
