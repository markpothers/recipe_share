import { ReduxStateType } from "./types";
import { createSelector } from "@reduxjs/toolkit";

const selectRoot = (state: ReduxStateType) => state.root

export const getLoggedInChef = createSelector(selectRoot, root => root.loggedInChef)
export const getLoggedInUserDetails = createSelector(selectRoot, root => root.loginUserDetails)
export const getDeviceType = createSelector(selectRoot, root => root.deviceType)
export const getStayLoggedIn = createSelector(selectRoot, root => root.stayLoggedIn)
