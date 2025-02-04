import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = `https://project-dev-0hj6.onrender.com/`;
// Endpoint
const loginUrl = `${baseUrl}admin/login`;
const Fetchuser = `${baseUrl}admin/auth`;
const logout = `${baseUrl}admin/logout`

const GetEventsAll = {
  super_admin: (page , status)=>`${baseUrl}admin/event/super_admin?page=${page}&per_page=10&status=${status}`,
  normal: (page , status)=> `${baseUrl}admin/event/normal?page=${page}&per_page=10&status=${status}`,
  special: (page , status)=> `${baseUrl}admin/event/special?page=${page}&per_page=10&status=${status}`
}

const getDetail = (eventID) => `${baseUrl}events/events/${eventID}/customers`;

const GetAll ={
  normal: (page) => `${baseUrl}customer/customers?page=${page}&per_page=10&st_tpye=ทั่วไป`,
  specail: (page) => `${baseUrl}customer/customers?page=${page}&per_page=10&st_tpye=กยศ.`
}

const adminEndpoint = {
  create : `${baseUrl}admin/create`,
  getAdmin : (page)=> `${baseUrl}admin/admins/getadmin?page=${page}&per_page=10`,
  updateA : (adminID) => `${baseUrl}admin/admins/${adminID}`,
  DeleteA : (adminID) => `${baseUrl}admin/admins/${adminID}`
}

const rewards = {
  createReward: `${baseUrl}admin/createReward`,
  getreward: (page) => `${baseUrl}admin/rewards?page=${page}&per_page=10`,
  updateReward: (rewardID) => `${baseUrl}admin/rewards/${rewardID}`,
  deleteReware: (rewardID) => `${baseUrl}admin/rewards/${rewardID}`
}

const CreateEventURL =`${baseUrl}admin/createEvent`
const Editeventinfo = (eventID) => `${baseUrl}events/event/${eventID}/edit`;
const DeleteEventdata = (eventID) => `${baseUrl}events/event/${eventID}/delete`;

//Line OA 
const LineMessageurl = `${baseUrl}admin/sendMessage`;

//admin create
export const createAdmin = createAsyncThunk("user/createAdmins", 
  async ({ formData }, { rejectWithValue, getState }) => {
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue("Token or role not found!");
    }

    const url = adminEndpoint.create;

    try {

      const response = await axios.post(url , formData , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
    }
});

//admin update
export const updateadmin = createAsyncThunk(
  "user/updateadmins",
  async ({ adminID, formData }, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue("Token or role not found!");
    }
    
    const url = adminEndpoint.updateA;
    
    try {
      const response = await axios.put(url(adminID , formData), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        return rejectWithValue(error.response.data);
      } else {
        console.error("Network error:", error.message);
        return rejectWithValue("Network error occurred");
      }
    }
  }
);

//delete admin
export const Deleteadmin = createAsyncThunk(
  "users/Deleteadmins",
  async ({ adminID }, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;
    if (!token) {
      return rejectWithValue("Token not found!");
    }
    try {
      const response = await axios.delete(adminEndpoint.DeleteA(adminID), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
    }
  }
);


//get admin
export const getAdmin = createAsyncThunk(
  "user/getAdmins",
  async (page = 1, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;
    if (!token) {
      return rejectWithValue("Token not found!");
    }

    try {
      const response = await axios.get(adminEndpoint.getAdmin(page), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
    }
  }
);


//Reward create
export const createReward = createAsyncThunk("user/createRewards", async ({ formData }, { rejectWithValue, getState }) => {
  const token = getState().user.userToken;

  if (!token) {
    return rejectWithValue("Token or role not found!");
  }

  const url = rewards.createReward; // Ensure this is the correct API URL

  try {
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"  // Important for file uploads
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
  }
});

//Reward update
export const updateReward = createAsyncThunk(
  "user/updateRewards",
  async ({ rewardID, formData }, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;

    console.log("Retrieved token:", token);

    if (!token) {
      return rejectWithValue("Token or role not found!");
    }
    
    const url = rewards.updateReward(rewardID);

    try {
      const response = await axios.put(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        return rejectWithValue(error.response.data);
      } else {
        console.error("Network error:", error.message);
        return rejectWithValue("Network error occurred");
      }
    }
  }
);

//delete Reward
export const DeleteReward = createAsyncThunk(
  "users/DeleteRewards",
  async ({ rewardID }, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;
    if (!token) {
      return rejectWithValue("Token not found!");
    }
    try {
      const response = await axios.delete(rewards.deleteReware(rewardID), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
    }
  }
);


//get Reward
export const getReward = createAsyncThunk(
  "user/getRewards",
  async (page = 1, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;
    if (!token) {
      return rejectWithValue("Token not found!");
    }

    try {
      const response = await axios.get(rewards.getreward(page), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

export const SentMessage = createAsyncThunk(
  "users/SentMessages",
  async (updatedSentData, { rejectWithValue , getState }) => { 
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.post(LineMessageurl,
        updatedSentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while transferring the commission.");
    }
  }
);

// login
export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(loginUrl, credentials);
      localStorage.setItem("userToken", response.data.token);
      return { ...response.data};
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Invalid email or password. Please try again.");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "users/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const response = await axios.get(Fetchuser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to fetch user");
    }
  }
);

export const getNormal = createAsyncThunk(
  "users/getNormals",
  async (page = 1 , { getState, rejectWithValue }) => {
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue('Token not found!');
    }


    try {
      const response = await axios.get(GetAll.normal(page), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error occurred while fetching events");
    }
  }
);

export const getSpecail = createAsyncThunk(
  "users/getSpecails",
  async (page = 1 , { getState, rejectWithValue }) => {
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue('Token not found!');
    }

    try {
      const response = await axios.get(GetAll.specail(page), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error occurred while fetching events");
    }
  }
);

export const getEvent = createAsyncThunk(
  "users/getEvents",
  async ({ role , page , status }, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue('Token not found!');
    }


    try {
      const response = await axios.get(GetEventsAll[role](page , status), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error occurred while fetching events");
    }
  }
);

export const getEventDetail = createAsyncThunk(
  "users/getEventDetails",
  async ({ eventID }, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue('Token not found!');
    }


    try {
      const response = await axios.get(getDetail(eventID), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error occurred while fetching events");
    }
  }
);

export const createEvent = createAsyncThunk(
  "users/createEvents",
  async (formValues, { rejectWithValue, getState }) => {
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue("Authentication token is missing!");
    }

    try {
      const response = await axios.post(CreateEventURL,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An error occurred while transferring the commission.");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "users/createEvents",
  async (_, { rejectWithValue, getState }) => {
    const token = getState().user.userToken;
    if (!token) {
      return rejectWithValue("Authentication token is missing!");
    }

    try {
      const response = await axios.post(logout, // ส่งข้อมูล amount และ note
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An error occurred while transferring the commission.");
    }
  }
);

export const editEvent = createAsyncThunk(
  "user/editEvents",
  async ({ eventID, formValues }, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue("Token or role not found!");
    }

    const url = Editeventinfo(eventID); 

    try {
      const response = await axios.put(url, formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error response:", error.response); // Log the error response
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        console.error("Network error:", error.message);
        return rejectWithValue("Network error occurred");
      }
    }
  }
);

export const DeleteEvent = createAsyncThunk(
  "user/DeleteEvents",
  async ({ eventID, event_type }, { getState, rejectWithValue }) => {
    const token = getState().user.userToken;

    if (!token) {
      return rejectWithValue("Token or role not found!");
    }

    const url = DeleteEventdata(eventID); 

    try {
      const response = await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { event_type } // ส่ง event_type เหมือนในตัวอย่าง postman
      });
      return response.data;
    } catch (error) {
      console.error("Error response:", error.response); 
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        console.error("Network error:", error.message);
        return rejectWithValue("Network error occurred");
      }
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
    currentUser: null,
    userToken: localStorage.getItem("userToken") || null,
    getEventData: { data: [], meta: {} },
    getRewardData: { data: [], meta: {} },
    getNormalsData: { data: [], meta: {} },
    getSpecailsData: { data: [], meta: {} },
    getEventDetailsData: { data: [], meta: {} },
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        localStorage.setItem("currentUser", JSON.stringify(action.payload.user));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
        state.userToken = null;
        state.currentUser = null;
        localStorage.removeItem("userToken");
        localStorage.removeItem("currentUser");
      })
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          if (action.payload?.code === "ALREADY_REDEEM_TODAY") {
            state.response = action.payload;
          } else if (action.payload?.code === "CODE_OUT_OF_STOCK") {
            state.response = action.payload;
          } else if (action.type.includes("fetchUser")) {
            state.currentUser = action.payload;
          } else if (action.type.includes("getRewards")) {
            state.getRewardData = action.payload;
          } else if (action.type.includes("getAdmins")) {
            state.getAdminData = action.payload;
          } else if (action.type.includes("getEvents")) {
            state.getEventData = action.payload;
          } else if (action.type.includes("getNormals")) {
            state.getNormalsData = action.payload;
          } else if (action.type.includes("getSpecails")) {
            state.getSpecailsData = action.payload;
          } else if (action.type.includes("getEventDetails")) {
            state.getEventDetailsData = action.payload;
          } else if (action.type.includes("createEvents")) {
            state.users.push(action.payload);
          } else if (action.type.includes("SentMessages")) {
            state.users.push(action.payload);
          } else if (action.type.includes("createAdmins")) {
            state.users.push(action.payload);
          } else if (action.type.includes("updateadmins")) {
            state.users.push(action.payload);
          } else if (action.type.includes("updateRewards")) {
            state.users.push(action.payload);
          } else if (action.type.includes("Deleteadmins")) {
            state.users = state.users.filter(user => user.id !== action.payload.id);
          } else if (action.type.includes("DeleteRewards")) {
            state.users = state.users.filter(user => user.id !== action.payload.id);
          } else if (action.type.includes("loginUser")) {
            state.currentUser = action.payload.user;
            state.userToken = action.payload.token;
            state.tokenExpiresAt = action.payload.token_expires_at;
          } else if (action.type.includes("logout")) {
            state.userToken = null;
            state.currentUser = null;
          }
        }
      );
  },
});

export const { resetState } = userSlice.actions;

export default userSlice.reducer;
