import axios from "axios";

const API_URL = "https://dummyjson.com/users";

export const fetchEmployees = async (
  page,
  sortField,
  sortOrder,
  filters,
  pageSize
) => {
  try {
    const skip = (page - 1) * pageSize;
    const response = await axios.get(API_URL, {
      params: { skip, limit: pageSize },
    });
    console.log("API Response:", response.data);
    const employees = response.data.users;
    console.log("Sorting by:", sortField, "Order:", sortOrder);

    //  sorting
    const sortedEmployees = employees.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "name") {
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    console.log("Sorted employees:", sortedEmployees);

    //  filtering
    const filteredEmployees = sortedEmployees.filter((employee) => {
      return Object.keys(filters).every((key) => {
        if (key === "country") {
          return (
            filters[key] === "" || employee.address.country === filters[key]
          );
        }
        return filters[key] === "" || employee[key] === filters[key];
      });
    });
    console.log("Filtered employees:", filteredEmployees);

    return filteredEmployees.map((employee) => ({
      id: employee.id,
      image: employee.image,
      name: `${employee.firstName} ${employee.lastName}`,
      demography: `${employee.gender[0].toUpperCase()}/${employee.age}`,
      designation: employee.company.title,
      location: `${employee.address.state}, ${employee.address.country}`,
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};



