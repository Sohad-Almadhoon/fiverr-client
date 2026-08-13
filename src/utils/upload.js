import newRequest from "./newRequest";

const upload = async (file) => {
  if (!file) return "";
  const data = new FormData();
  data.append("file", file);
  // Let the caller decide what to do when an upload fails - swallowing the
  // error here silently produced gigs with an undefined cover.
  const res = await newRequest.post("/upload", data);
  return res.data.url;
};

export default upload;
