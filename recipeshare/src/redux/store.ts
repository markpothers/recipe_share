import { createStore, compose, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import reducer from "./reducer";
import { initialRootState } from "./initialRootState";

export const middleware = compose(
	//exported ONLY for unit testing
	applyMiddleware(ReduxThunk)
);

export const store = createStore(reducer, initialRootState, middleware);
export type AppDispatch = typeof store.dispatch;


// to use Redux Toolkit, use the below
// import { configureStore } from "@reduxjs/toolkit"
// import rootReducer  from "./rootReducer"

// export const store = configureStore({
// 	reducer: {
// 		root: rootReducer
// 	}
// })

// export type AppDispatch = typeof store.dispatch;
