import axios from "axios";

export const createEmbedding = async (text) => {
  const res = await axios.post("http://localhost:8000/embed", {
    text,
  });

  return res.data.embedding;
};
