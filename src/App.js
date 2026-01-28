import React, { Suspense, useEffect, useReducer } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Loader from './components/loader';
import routing from './routes/routing';
import { AuthLayout, GuestLayout } from "./components/layout";
import Functons from './helpers/';
import reducer from "./state/reducer";
import initialState from './state/state';
import { getInfo, permission, storage } from './helpers/functions';

/* Helper Functions */
async function read_roles(application, id, dispatch) {
  try {
    const result = await application.post({
      route: 'read',
      body: {
        table: 'roles',
        condition: { delated: 0, status: 'active', id },
        select: { name: "", id: "", data: "" },
      },
    });
    if (result.success) {
      storage.store("roles", result.message[0].data);
      return result.message[0].data;
    } else {
      storage.remove('roles');
      return null;
    }
  } catch (error) {
    dispatch({ notification: error instanceof Error ? error.message : 'Role read error' });
    return null;
  }
}
async function read_user(application, id, dispatch) {
  if (!id) return null; // early return
  try {
    const response = await application.post({
      route: 'read',
      body: {
        table: 'users',
        condition: { id, status: 'active', delated: 0 },
        select: { role_id: "", id: "" },
      },
    });
    if (response.success) {
      return response.message[0]?.role_id || null;
    } else {
      return null;
    }
  } catch (error) {
    dispatch({ notification: error instanceof Error ? error.message : 'User read error' });
    return null;
  }
}
/* Subcomponent inside Router */
const AppContent = ({ state, dispatch, application }) => {
const location = useLocation();

useEffect(() => {
  const checkUserRole = async () => {
    const storedUserId = getInfo("user", "id");
    const storedRoleId = getInfo("user", "role_id");
    const localRoleData = storage.retrieve("roles");
    if (!storedUserId) return; // stop early if user is not logged in
    const dbRoleId = await read_user(application, storedUserId, dispatch);
    if (!dbRoleId) return;
    if (storedRoleId === dbRoleId) {
      const dbRoleData = await read_roles(application, dbRoleId, dispatch);
      if (dbRoleData !== localRoleData) {
        dispatch({ notification: "Your role_data changed." });
        storage.store("roles", dbRoleData);
        application.authenticate("logout");
      }
    } else {
      dispatch({ notification: "Your role_id has changed." });
      const dbRoleData = await read_roles(application, dbRoleId, dispatch);
      storage.store("roles", dbRoleData);
      //application.authenticate("logout");
    }
  };
  checkUserRole();
}, [location.pathname]);

  return state.authenticated ? (
    <AuthLayout
      application = { application }
      user = { getInfo("user", "id") }
      authenticate = { application.authenticate }
    >
      { routing(application) }
    </AuthLayout>
  ) : (
    <GuestLayout application = { application }>
      { routing(application) }
    </GuestLayout>
  );
};

/* App Component */
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const application = new Functons(state, dispatch);

useEffect(() => {
  function handleMainClick(event) {
    const window_size = window.innerWidth;
    const mainEl = document.querySelector("main");
    if (window_size < 1200 && mainEl && mainEl.contains(event.target)) {
      application.closeSidebar();
    }
  }
  document.body.addEventListener("click", handleMainClick);
  return () => {
    document.body.removeEventListener("click", handleMainClick);
  };
}, []);

useEffect(() => {
  // Authenticate user on mount (runs only once)
  application.retrieveUserAndAuthenticate();
}, []); // runs only on first mount

useEffect(() => {
  // Online user notification (runs whenever online_users changes)
  if (state.online_users.length > 0 && permission(2020)) {
    dispatch({ notification: `${state.online_users.length} users are online` });
  }
}, [state.online_users]); // watch for changes
// Function to handle incoming online users
const online_user = (users) => {
  try {
    const myId = getInfo("user", "id");
    let updatedIds = [...state.online_users];
    if (Array.isArray(users)) {
      // Loop through array and merge
      for (let i = 0; i < users.length; i++) {
        if (users[i]?.id && !updatedIds.includes(users[i].id)) {
          updatedIds.push(users[i].id);
        }
      }
    } else if (users?.id) {
      if (!updatedIds.includes(users.id)) {
        updatedIds.push(users.id);
      }
    }
    // Ensure your own ID is included
    if (myId && !updatedIds.includes(myId)) {
      updatedIds.push(myId);
    }
    dispatch({ online_users: updatedIds });
  } catch (error) {
    dispatch({
      notification: error instanceof Error ? error.message : "Online user error",
    });
  }
};
// Setup Socket.IO listeners once
useEffect(() => {
  const handleConnect = () => {
    console.log("Connected to real-time connection");
    const currentUser = {
      id: getInfo("user", "id"),
      full_name: getInfo("user", "full_name"),
    };
    state.socket.emit("online", currentUser);
    //dispatch({ notification: "You are connected to real-time connection" });
  };
  const handleConnectError = (error) => {
    console.log(`Failed to connect: ${error}`);
    dispatch({ online_users: [] });
  };
  // FIX: online-user is an array
  const handleOnlineUser = (users) => online_user(users);
  state.socket.on("connect", handleConnect);
  state.socket.on("connect_error", handleConnectError);
  state.socket.on("online-user", handleOnlineUser);
  return () => {
    state.socket.off("connect", handleConnect);
    state.socket.off("connect_error", handleConnectError);
    state.socket.off("online-user", handleOnlineUser);
  };
}, [state.socket]);



useEffect(() => {
  if (state.notification) {
    const timer = setTimeout(() => {
    dispatch({ notification: "" });
  }, 5000);
   return () => clearTimeout(timer);
  }
}, [state.notification]);

  return (
    <Suspense fallback={<Loader />}>
      {state.loading && <Loader />}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent state={state} dispatch={dispatch} application={application} />
      </Router>
    </Suspense>
  );
};

export default App;
