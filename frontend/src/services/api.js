const BASE_URL = "http://localhost:5000/api/users";

// GET profile
export const getUserProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/${userId}`);
  return res.json();
};

// UPDATE profile
export const updateUserProfile = async (userId, data) => {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};