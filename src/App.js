import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroups, setBloodGroups] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the API using Axios
    axios
      .get("https://dummyjson.com/users")
      .then((response) => {
        const fetchedUsers = response.data.users;
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers); // Initialize filteredUsers with fetched users

        // Extract unique blood groups from users
        const uniqueBloodGroups = Array.from(
          new Set(fetchedUsers.map((user) => user.bloodGroup))
        );
        setBloodGroups(uniqueBloodGroups);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  useEffect(() => {
    // Filter users based on the search term and selected blood group
    const filtered = users.filter((user) => {
      const searchRegex = new RegExp(searchTerm, "i");
      return (
        (searchRegex.test(user.username) ||
          searchRegex.test(user.email) ||
          searchRegex.test(user.phone) ||
          searchRegex.test(user.address.address)) &&
        (selectedBloodGroup === "" || user.bloodGroup === selectedBloodGroup)
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, selectedBloodGroup, users]);

  return (
    <div>
      <div className="search_div">
        <input
          className="search"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="search"
          value={selectedBloodGroup}
          onChange={(e) => setSelectedBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((group, index) => (
            <option key={index} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Blood Group</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((val, index) => (
              <tr key={index}>
                <td>{val.username}</td>
                <td>{val.email}</td>
                <td>{val.phone}</td>
                <td>{val.address.address}</td>
                <td>{val.bloodGroup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
