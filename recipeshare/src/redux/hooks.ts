import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "./store"
import type { RootState } from "./types"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
