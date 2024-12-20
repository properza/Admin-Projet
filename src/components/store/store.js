import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../common/userSlice";

const store = configureStore({
    reducer:{
        user:userSlice
    }
})

export default store