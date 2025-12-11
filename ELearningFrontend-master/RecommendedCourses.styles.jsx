export const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  image: {
    width: "100%",
    height: "150px",
    borderRadius: "10px",
    objectFit: "cover",
    marginBottom: "12px",
  },
};
