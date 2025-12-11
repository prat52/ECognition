// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { UserData } from "../context/UserContext";
// import { server } from "../main";


// const RecommendedCourses = () => {
//   const { user } = UserData();
//   const [recommended, setRecommended] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userId = user?._id;
//   console.log(userId);

//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       try {
//         if (!userId) return;

//         // const res = await axios.get(`/api/recommended/${userId}`);
//         const token = localStorage.getItem("token");

// const res = await axios.get(`${server}/api/recommended/${userId}`, {
//   headers: {
//     token: localStorage.getItem("token"),
//   },
// });

// console.log(token);
// console.log("res",res);
//         setRecommended(res.data.recommended || []);
//         console.log("Recommended:", res.data.recommended);

//       } catch (error) {
//         console.error("Error fetching recommended:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecommendations();
//   }, [userId]);

//   if (loading) return <h2>Loading recommendations...</h2>;

//   return (
//     <div style={{ padding: "40px" }}>
//       <h1>Recommended Courses</h1>

//       {recommended.length === 0 ? (
//         <p>No recommended courses found.</p>
//       ) : (
//         <div style={styles.grid}>
//           {recommended.map((course) => (
//             <div key={course._id} style={styles.card}>
//               <img
//                 src={course.image}
//                 alt={course.title}
//                 style={styles.image}
//               />
//               <h3>{course.title}</h3>
//               <p>{course.description.slice(0, 80)}...</p>
//               <p>Category: {course.category}</p>
//               <p>₹{course.price}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecommendedCourses;

// /* ---------- Styles ---------- */
// const styles = {
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//     gap: "20px",
//   },
//   card: {
//     padding: "20px",
//     borderRadius: "10px",
//     background: "#fff",
//     boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
//   },
//   image: {
//     width: "100%",
//     height: "150px",
//     borderRadius: "10px",
//     objectFit: "cover",
//     marginBottom: "10px",
//   },
// };

import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserData } from "../context/UserContext";
import { server } from "../main";
import { useNavigate } from "react-router-dom";
import { styles } from "../../RecommendedCourses.styles"


const RecommendedCourses = () => {
  const { user } = UserData();
  const navigate = useNavigate();

  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?._id;
  const token = localStorage.getItem("token");
  

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!userId) return;

        const res = await axios.get(
  `${server}/api/recommended`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


        setRecommended(res.data.recommended || []);
        
      } catch (error) {
        console.error("Error fetching recommended:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) return <h2>Loading recommendations...</h2>;
  return (
    <div style={{ padding: "40px" }}>
      <h1>Recommended Courses</h1>

      {recommended.length === 0 ? (
        <p>No recommended courses found.</p>
      ) : (
        <div style={styles.grid}>
          {recommended.map((course) => (
            <div
              key={course._id}
              style={styles.card}
              onClick={() => navigate(`/course/${course._id}`)}
            >
              <img
                src={`${server}/${course.image}`}
                alt={course.title}
                style={styles.image}
              />

              <h3>{course.title}</h3>

              <p style={{ color: "#555" }}>
                {course.description.slice(0, 80)}...
              </p>

              <p><b>Category:</b> {course.category}</p>
              <p style={{ fontWeight: "bold" }}>₹{course.price}</p>
              

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedCourses;
