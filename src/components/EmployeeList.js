import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchEmployees } from "../api/api";
import "../css/EmployeeTable.css";
import { FaFilter } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({});

  const pageSize = 10;

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setEmployees([]);
    loadMore(true);
  }, [sortField, sortOrder, filters]);

  const loadMore = async (isReset = false) => {
    let newEmployees = [];
    let currentPage = isReset ? 1 : page;

    while (newEmployees.length < pageSize && hasMore) {
      const fetchedEmployees = await fetchEmployees(
        currentPage,
        sortField,
        sortOrder,
        filters,
        pageSize
      );

      if (fetchedEmployees.length === 0) {
        setHasMore(false);
        break;
      }

      newEmployees = [...newEmployees, ...fetchedEmployees];
      currentPage += 1;
    }

    if (newEmployees.length > 0) {
      setEmployees((prevEmployees) =>
        isReset
          ? newEmployees.slice(0, pageSize)
          : [...prevEmployees, ...newEmployees.slice(0, pageSize)]
      );
      setPage(currentPage);
    } else {
      setHasMore(false);
    }
    console.log("Current Employees:", newEmployees);
  };

  const handleSort = (field) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    setPage(1);
    setEmployees([]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    setEmployees([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <>
      <div className="filter-container">
        <span
          style={{
            marginRight: "271px",
            fontWeight: "bold",
            fontSize: "37px",
          }}
        >
          Employees
        </span>
        <span className="span1">
          <FaFilter style={{ color: "rgb(173, 61, 61)" }} />
          <select name="country" onChange={handleFilterChange}>
            <option value="">Country</option>
            <option value="United States">United States</option>
            <option value="India">India</option>
          </select>
        </span>
        <span>
          <select name="gender" onChange={handleFilterChange}>
            <option value=""> Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </span>
      </div>
      <div className="table-container">
        <InfiniteScroll
          dataLength={employees.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more records</p>}
        >
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>
                  {" "}
                  <span className="header-with-icon">
                    ID{" "}
                    <span style={{ display: "flex" }}>
                      <FaArrowUp />{" "}
                      <FaArrowDown style={{ color: "rgb(173, 61, 61)" }} />
                    </span>
                  </span>
                </th>
                <th>Image </th>
                <th onClick={() => handleSort("name")}>
                  <span className="header-with-icon">
                    Full Name{" "}
                    <span style={{ display: "flex" }}>
                      <FaArrowUp />{" "}
                      <FaArrowDown style={{ color: "rgb(173, 61, 61)" }} />
                    </span>
                  </span>
                </th>
                <th>Demography</th>
                <th>Designation</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>
                    <img src={employee.image} alt={employee.name} />
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.demography}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default EmployeeList;
