import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/items")
      .then((response) => setItems(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    if (editId) {
      axios
        .put(`http://localhost:5000/items/update/${editId}`, {
          name,
          description,
        })
        .then(() => {
          setItems(
            items.map((item) =>
              item._id === editId ? { ...item, name, description } : item
            )
          );
          setEditId(null);
          setName("");
          setDescription("");
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post("http://localhost:5000/items/new", { name, description })
        .then((response) => {
          setItems([...items, response.data]);
          setName("");
          setDescription("");
        })
        .catch((error) => console.log(error));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/items/deleted/${id}`)
      .then(() => setItems(items.filter((item) => item._id !== id)))
      .catch((error) => console.log(error));
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setName(item.name);
    setDescription(item.description);
  };

  return (
    <div>
      <h1>CRUD Application</h1>
      <form onSubmit={handleCreateOrUpdate}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">{editId ? "Update" : "Create"}</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.description}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
