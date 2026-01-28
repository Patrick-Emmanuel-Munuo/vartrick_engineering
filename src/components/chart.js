import moment from "moment";
import React from "react";
import Chart from "react-apexcharts";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// ---------------- Pie Chart ----------------
//requested,attempter and pending job
export const JobPie = React.memo(({ requested_job = 0, attempted_job = 0, pending_job = 0 }) => {
  const renderChart = React.useCallback(() => {
    const series = [requested_job, attempted_job, pending_job];
    const options = {
      labels: ["requested_job", "attempted_job", "pending_job"],
      colors: ["#A4A3A6", "#4CAF50", "#1565C0"],
      legend: { position: "bottom" },
      dataLabels: { enabled: true },
      responsive: [{
        breakpoint: 480,
        options: { chart: { width: "100%" }, legend: { position: "bottom" } }
      }]
    };
    return <Chart options={options} series={series} type="donut" height="90%" width="90%" />;
  }, [requested_job, attempted_job, pending_job]);

  return <>{renderChart()}</>;
});

// ---------------- CustomChart ----------------
export const CustomChart = React.memo(({ data = [] }) => {
  const currentYearData = React.useCallback(() => {
    const totalUsers = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    data.forEach(user => {
      const date = moment(user.created_date);
      if (date.isValid() && date.year() === currentYear) {
        totalUsers[date.month()] += 1;
      }
    });
    return totalUsers;
  }, [data]);

  const renderChart = React.useCallback(() => {
    const options = {
      colors: ["#1565C0"],
      plotOptions: { bar: { borderRadius: 0, horizontal: true } },
      dataLabels: { enabled: true },
      xaxis: { categories: months }
    };
    const series = [{ name: "System User(s)", data: currentYearData() }];
    return <Chart type="bar" width="100%" height="500" options={options} series={series} />;
  }, [currentYearData]);
  return <>{renderChart()}</>;
});
// ---------------- ProfileVisit Chart ----------------
export const ProfileVisit = React.memo(({ data = [] }) => {
  const yearData = React.useCallback(() => {
    const totalUsers = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    data.forEach(user => {
      const date = moment(user.created_date);
      if (date.isValid() && date.year() === currentYear) {
        totalUsers[date.month()] += 1;
      }
    });
    return totalUsers;
  }, [data]);

  const renderChart = React.useCallback(() => {
    const options = {
      colors: ["#1565C0"],
      plotOptions: { bar: { borderRadius: 0, horizontal: true } },
      dataLabels: { enabled: true },
      xaxis: { categories: months }
    };
    const series = [{ name: "Users", data: yearData() }];
    return <Chart type="bar" width="100%" height="500" options={options} series={series} />;
  }, [yearData]);
  return <>{renderChart()}</>;
});
