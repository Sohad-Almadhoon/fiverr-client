const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("currentUser");
    // Guards against the literal "null"/"undefined" strings an old logout left
    // behind, and against corrupt JSON taking the whole app down.
    if (!raw || raw === "null" || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
export default getCurrentUser;
