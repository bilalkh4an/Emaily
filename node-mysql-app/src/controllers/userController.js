// Controller functions for users

const users = [
  { id: 1, name: "Bilal Khan", role: "Admin" },
  { id: 2, name: "Ali", role: "Student" },
];


// GET /api/users
const getUsers = (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
};


// GET /api/users/:id
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  

  res.status(200).json({
    success: true,
    data: user,
  });
};

module.exports = { getUsers, getUserById };
