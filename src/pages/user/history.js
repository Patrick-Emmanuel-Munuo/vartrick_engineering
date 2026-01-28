import React from 'react';
import ReactDatatable from '../../components/table';
import { Input, Select, Option } from "../../components/form";
import { Button } from "../../components/button";
import { getInfo, permission, config, padStart } from '../../helpers/functions';

const History = React.memo((props) => {
  const { state, dispatch, handleInputChange, post, unMount } = props.application;

  // Fetch login history for a given user
  const readLoginHistory = async (user_id) => {
    try {
      dispatch({ loading: true });
      const response = await post({ 
        route: 'read', 
        body: { table: 'login_history', condition: { user_id } } 
      });
      dispatch({ login_history: response.success ? response.message : [] });
      if (!response.success) dispatch({ notification: "user login history not found." });
    } catch (error) {
      dispatch({ notification: "An error occurred while fetching login history." });
    } finally {
      dispatch({ loading: false });
    }
  };

  // Search for users by full name
  const handleSearch = async () => {
    try {
      dispatch({ user_id: null, login_history: [] }); // ✅ clear old selection/history
      const response = await post({ 
        route: 'search', 
        body: {
          table: "users",
          condition: { full_name: state.search_text.trim() || "" }
        } 
      });
      if(response.success){
      dispatch({ search_data: response.success ? response.message : [] });
      }else{
        dispatch({ notification: "user login delails not found" });
      }
    } catch (error) {
      dispatch({ notification: "Failed to search users." });
    }
  };

  // Load all users initially
  const mount = async () => {
    try {
      dispatch({ user_id: null, search_data: [], login_history: [] });
      const response = await post({ 
        route: 'read',
        body: { 
          table: 'users',
          condition: { delated: 0 }
        }
      });
      dispatch({ users: response.success ? response.message : [] });
    } catch (error) {
      dispatch({ notification: error.message || 'An error occurred' });
    }
  };

  React.useEffect(() => {
    if (permission(1004)) {
      document.title = "Login History";
      mount();
      const user_id = getInfo("user", "id");
      readLoginHistory(user_id);
    } else {
      window.location.href = "/not-found";
    }
    return () => unMount();
    // eslint-disable-next-line
  }, []);

  // ✅ Auto-fetch login history when user_id changes
  React.useEffect(() => {
    if (state.user_id) {
      readLoginHistory(state.user_id);
    }
    // eslint-disable-next-line
  }, [state.user_id]);

  // Render user options in Select dropdown
  const render_users = React.useMemo(() => 
    state.search_data.map((user, i) => 
      <Option key={i} value={user.id} label={user.full_name} />
    ),
    [state.search_data]
  );

  // Memoize processed users with names mapped
  const mappedUsers = React.useMemo(() => {
    if (!state.users || !state.login_history) return [];
    const usersMap = Object.fromEntries(state.users.map(user => [user.id, user.full_name]));
    //console.log(usersMap)
    //console.log(state.login_history)
    return state.login_history.map(data => ({
      id: padStart(data.id,0) || 'N/A',
      //user_id: data.user_id || 'N/A',
      full_name: usersMap[data.user_id],
      created_date: data.created_date || 'N/A',
      time_zone: data.time_zone || 'N/A',
      ip_address: data.ip_address || 'N/A',
      login_device: data.login_device || 'N/A',
      browser_name: data.browser_name || 'N/A',
      browser_version: data.browser_version || 'N/A',
      status: data.status || 'inactive',
    }));
  }, [state.users, state.login_history]);

  const columns = [
    { key: "id", text: "Id", className: "text-center", align: "center", sortable: true },
    //{ key: "user_id", text: "user_id", className: "text-center", align: "center", sortable: true },
    { key: "full_name", text: "Name", className: "center", align: "center", sortable: true },
    { key: "created_date", text: "Login Date", className: "center", align: "center", sortable: true },
    { key: "time_zone", text: "Time Zone", className: "center", align: "center", sortable: true },
    { key: "ip_address", text: "IP Address", className: "center", align: "center", sortable: true },
    { key: "login_device", text: "Device", className: "center", align: "center", sortable: true },
    { key: "browser_name", text: "Browser", className: "center", align: "center", sortable: true },
    { key: "browser_version", text: "Version", className: "center", align: "center", sortable: true },
    { key: "status", text: "Status", className: "center", align: "center", sortable: true, cell: r => (
        <span className={`badge rounded-pill ${r.status.toLowerCase() === "active" ? "bg-success" : "bg-warning"}`}>
          {r.status}
        </span>
      )
    }
  ];

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              {permission(3001) && (
                <form className="form" action="#">
                  <div className="row">
                    <div className="col-md-4 col-12">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="search_text"
                          error={state.search_text_error}
                          label="Search User by Name"
                          value={state.search_text}
                          onChange={handleInputChange}
                          placeholder="Enter user name"
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      <div className="form-group d-flex gap-2 flex-wrap">
                        <Button
                          className="btn btn-info mt-md-0 mt-2"
                          loading={state.loading}
                          disabled={state.disabled}
                          title="Search"
                          onClick={handleSearch}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      {state.search_data.length > 0 && (
                        <div className="form-group">
                          <Select
                            name="user_id"
                            value={state.user_id || ""}
                            onChange={handleInputChange}
                            label="Select User"
                            error={state.user_id_error}
                          >
                            <Option value="" label="Select user" disabled />
                            {render_users}
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              )}
              <div className="row">
                <div className="col-lg-12">
                  <ReactDatatable
                    config={config}
                    records={mappedUsers}
                    columns={columns}
                    loading={state.loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default History;
