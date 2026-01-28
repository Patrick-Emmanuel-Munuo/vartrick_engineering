import React, { useEffect, useMemo } from 'react';
import { JobPie, ProfileVisit } from "../components/chart";
import {  Navigate } from 'react-router-dom';
import { Icon } from "../components/elements";
import { permission } from '../helpers/functions';

// Reusable Dashboard Card Component
// DashboardCard Component
const DashboardCard = ({ menu, count }) => (
  <div className="col-6 col-md-6 col-lg-3 mb-4">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body d-flex align-items-center">
        <div
          className="d-flex align-items-center justify-content-center me-3 shadow-sm"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: `2px solid ${menu.color}`, // dynamic border color
            transition: 'all 0.3s ease',
            flexShrink: 0,
            boxShadow: '0 4px 8px rgba(113, 130, 179, 0.5)',
            cursor: 'pointer',
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center w-100 h-100"
          >
            <Icon name={menu.icon} type="round" />
          </div>
        </div>
        <div>
          <h6 className="text-muted mb-1">{menu.name}</h6>
          <h4 className="mb-0">{count ?? 0}</h4>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = (props) => {
  const { state, dispatch } = props.application;
  // Fetch dashboard data
  const fetch_data = async () => {
    try {
      const response = await props.application.post({
        route: 'bulk-count',
        body: [
          { table: "users", condition: { delated: 0 } },
          { table: "departments", condition: { delated: 0 } },
          { table: "jobs", condition: { delated: 0 } },
          { table: "jobs", condition: { delated: 0, completed: 0 } },
          { table: "jobs", condition: { delated: 0 }, or_condition: { attempt_by: null } },
          { table: "jobs", condition: { delated: 0, completed: 1 } },
          { table: "jobs", condition: { delated: 0, customer_approve: 0 } },
        ]
      });

      if (response?.success) {
        response.message?.forEach((item, index) => {
          const keys = [
            "dashboard_users",
            "dashboard_departments",
            "dashboard_jobs",
            "dashboard_pending_jobs",
            "dashboard_attempted_jobs",
            "dashboard_completed_jobs",
            "dashboard_approval_pending_jobs"
          ];
          dispatch({ [keys[index]]: item?.count ?? 0 });
        });
      } else {
        dispatch({ notification: response?.message ?? 'Failed to fetch data' });
      }
    } catch (error) {
      dispatch({ notification: error?.message ?? 'Error fetching data' });
    }
  };
  useEffect(() => {
    if (!permission(9000)) return;
    document.title = "Dashboard";
    fetch_data();
  }, []);

  const menus = useMemo(() => [
    { name: "Users", title: "dashboard_users", color: "purple", icon: "verified", link: "user/list" },
    { name: "Departments", title: "dashboard_departments", color: "blue", icon: "groups", link: "department/list" },
    { name: "Pending Assignments", title: "dashboard_pending_jobs", color: "orange", icon: "work_history", link: "job/assigned" },
    { name: "All Jobs", title: "dashboard_jobs", color: "green", icon: "work_history", link: "" },
    { name: "Attempted Jobs", title: "dashboard_attempted_jobs", color: "red", icon: "check_circle", link: "" },
    { name: "Completed Jobs", title: "dashboard_completed_jobs", color: "green", icon: "task_alt", link: "" },
    { name: "Approval Pending", title: "dashboard_approval_pending_jobs", color: "red", icon: "pending_actions", link: "pending_job" },
  ], []);

  const renderDashboardCards = useMemo(() => 
    menus.map((menu, index) => (
      <DashboardCard
        key={index}
        menu={menu}
        count={state?.[menu.title]}
      />
    ))
  , [menus, state]);

  if (!permission(9000)) return <Navigate to="/not-found" replace />;

  return (
    <section className="section">
      <div className="row">
        <div className="col-12">
          <div className="row">
            {renderDashboardCards}
          </div>
          {/* Charts Section 
          <div className="row mt-4 g-4">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h4>Job Requested</h4>
                </div>
                <div className="card-body">
                  <ProfileVisit data={state?.dashboard_jobs_data ?? []} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h4>Job Attempted</h4>
                </div>
                <div className="card-body">
                  <ProfileVisit data={state?.dashboard_jobs_data ?? []} />
                </div>
              </div>
            </div>
            {/* job pie requested,attempter and pending job }
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h4>Job Summary</h4>
                </div>
                <div className="card-body">
                  <JobPie 
                   requested_job={state?.dashboard_jobs ?? 0}
                   attempted_job={state?.dashboard_attempted_jobs ?? 0}
                   pending_job={state?.dashboard_pending_jobs ?? 0}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4 g-4">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h4>Created Users</h4>
                </div>
                <div className="card-body">
                  <ProfileVisit data={state?.dashboard_users_data ?? []} />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h4>Profile Visits</h4>
                </div>
                <div className="card-body">
                  <ProfileVisit data={state?.dashboard_login_history ?? []} />
                </div>
              </div>
            </div>
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Dashboard);
