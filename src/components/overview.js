import React, { useEffect, useState } from "react";
import overviewService from "../service/overview.service";
import { Line } from "react-chartjs-2";
import Profile from "../img/hurufs.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Table } from "reactstrap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

export default function Overview({ user }) {
  const [UnresolvedTotal, setUnresolvedTotal] = useState();
  const [OverviewTotal, setOverviewTotal] = useState();
  const [OpenTotal, setOpenTotal] = useState();
  const [OnHoldTotal, setOnHoldTotal] = useState();
  const [Ticket1Year, setTicket1Year] = useState([]);
  const [UnresolvedData, setUnresolvedData] = useState([]);
  const [TaskData, setTaskData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const dataChart = {
    labels: Ticket1Year.map((_, i) => `Bulan ${i + 1}`),
    datasets: [
      {
        label: "Data Chart",
        data: Ticket1Year,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await overviewService.getAll();
      const body = response.data[0];
      
      setUnresolvedTotal(body.total_unresolved);
      setOverviewTotal(body.total_overview);
      setOpenTotal(body.total_open);
      setOnHoldTotal(body.total_on_hold);
      setUnresolvedData(body.unresolved_list);
      setTaskData(body.task_list);

      const dataChart = body.tickets_1year;
      setTicket1Year(dataChart);
    } catch (error) {
      console.error("Failed to fetch overview data: ", error);
    }
  }

  const filteredTasks = TaskData.filter((task) =>
    task.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UnresolvedList =
    UnresolvedData &&
    UnresolvedData.map((d, idx) => (
      <tr key={idx}>
        <td>{d.process}</td>
        <td>{d.total}</td>
      </tr>
    ));

  const TaskList =
    filteredTasks &&
    filteredTasks.map((d, idx) => (
      <tr key={idx}>
        <td>{d.task}</td>
        <td>{d.process}</td>
      </tr>
    ));

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>Overview</h1>
        <div className="overview-profile">
          <span>{user.role}</span>
          <img src={Profile} alt="Profile" />
        </div>
      </div>
      <div className="status-boxes">
        <div className="status-box">
          <label>Unresolved</label>
          <div className="total">
            <span>{UnresolvedTotal}</span>
          </div>
        </div>
        <div className="status-box">
          <label>Overdue</label>
          <div className="total">
            <span>{OverviewTotal}</span>
          </div>
        </div>
        <div className="status-box">
          <label>Open</label>
          <div className="total">
            <span>{OpenTotal}</span>
          </div>
        </div>
        <div className="status-box">
          <label>On hold</label>
          <div className="total">
            <span>{OnHoldTotal}</span>
          </div>
        </div>
      </div>
      <div className="graph">
        <label>Today's Trends</label>
        <div className="chart-area">
          <Line data={dataChart} />
        </div>
      </div>
      <div className="list-groups">
        <div className="unresolved-tickets">
          <label>Unresolved Tickets</label>
          <Table className="table-list">
            <tbody>{UnresolvedList}</tbody>
          </Table>
        </div>
        <div className="unresolved-tickets">
          <label>Tasks</label>
          <div className="search-task">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            &#x1F50D;
          </div>
          <Table className="table-list">
            <tbody>{TaskList}</tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
