// import React, { useState } from "react";
// import "./courses.css";
// import { CourseData } from "../../context/CourseContext";
// import CourseCard from "../../components/coursecard/CourseCard";

// const Courses = () => {
//   const { courses, fetchCourses, fetchTrendingCourses } = CourseData();

//   const [mode, setMode] = useState("all"); // all | trending

//   const loadTrending = () => {
//     setMode("trending");
//     fetchTrendingCourses();
//   };

//   const loadAll = () => {
//     setMode("all");
//     fetchCourses();
//   };

//   return (
//     <div className="courses">
//       <h2>Available Courses</h2>

//       {/* BUTTONS */}
//       <div style={{ 
//   display: "flex", 
//   justifyContent: "center", 
//   gap: "20px",
//   marginBottom: "20px"
// }}>
//         <button
//           className="common-btn"
//           onClick={loadAll}
//           style={{
//             background: mode === "all" ? "#4caf50" : "#4caf50",
//             marginRight: "10px",
//           }}
//         >
//           All Courses
//         </button>

//         <button
//           className="common-btn"
//           onClick={loadTrending}
//           style={{
//             background: mode === "trending" ? "#4caf50" : "#4caf50",
//           }}
//         >
//           Trending Courses
//         </button>
//       </div>

//       {/* COURSE LIST */}
//       <div className="course-container">
//         {courses && courses.length > 0 ? (
//           courses.map((e) => <CourseCard key={e._id} course={e} />)
//         ) : (
//           <p>No Courses Yet!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Courses;

// import React, { useState } from "react";
// import "./courses.css";
// import { CourseData } from "../../context/CourseContext";
// import CourseCard from "../../components/coursecard/CourseCard";
// import { useNavigate } from "react-router-dom";

// const Courses = () => {
//   const { courses, fetchCourses, fetchTrendingCourses } = CourseData();
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("all"); // all | trending

//   const loadTrending = () => {
//     setMode("trending");
//     fetchTrendingCourses();
//   };

//   const loadAll = () => {
//     setMode("all");
//     fetchCourses();
//   };

//   const goToRecommended = () => {
//     navigate("/recommended");
//   };

//   return (
//     <div className="courses">
//       <h2>Available Courses</h2>

//       {/* BUTTONS */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: "20px",
//           marginBottom: "20px",
//         }}
//       >
//         <button
//           className="common-btn"
//           onClick={loadAll}
//           style={{
//             background: mode === "all" ? "#4caf50" : "#4caf50",
//           }}
//         >
//           All Courses
//         </button>

//         <button
//           className="common-btn"
//           onClick={loadTrending}
//           style={{
//             background: mode === "trending" ? "#4caf50" : "#4caf50",
//           }}
//         >
//           Trending Courses
//         </button>

//         {/* NEW RECOMMENDED BUTTON */}
//         <button
//           className="common-btn"
//           onClick={goToRecommended}
//           style={{ background: "#2196f3" }}
//         >
//           Recommended Courses
//         </button>
//       </div>

//       {/* COURSE LIST */}
//       <div className="course-container">
//         {courses && courses.length > 0 ? (
//           courses.map((e) => <CourseCard key={e._id} course={e} />)
//         ) : (
//           <p>No Courses Yet!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Courses;
// import React, { useState, useEffect } from "react";
// import "./courses.css";
// import { CourseData } from "../../context/CourseContext";
// import { UserData } from "../../context/UserContext";
// import CourseCard from "../../components/coursecard/CourseCard";
// import { useNavigate } from "react-router-dom";

// const Courses = () => {
//   const { courses, fetchCourses, fetchTrendingCourses } = CourseData();
//   const { isAuth } = UserData(); // ✅ auth state
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("all");

//   useEffect(() => {
//     fetchCourses(); // load all by default
//   }, []);

//   const loadTrending = () => {
//     setMode("trending");
//     fetchTrendingCourses();
//   };

//   const loadAll = () => {
//     setMode("all");
//     fetchCourses();
//   };

//   const goToRecommended = () => {
//     if (!isAuth) return; // safety
//     navigate("/recommended");
//   };

//   return (
//     <div className="courses">
//       <h2>Available Courses</h2>

//       {/* BUTTONS */}
//       <div className="course-actions">
//         <button
//           className={`common-btn ${mode === "all" && "active"}`}
//           onClick={loadAll}
//         >
//           All Courses
//         </button>

//         <button
//           className={`common-btn ${mode === "trending" && "active"}`}
//           onClick={loadTrending}
//         >
//           Trending Courses
//         </button>

//         {/* ✅ SHOW ONLY WHEN LOGGED IN */}
//         {isAuth && (
//           <button
//             className="common-btn recommended-btn"
//             onClick={goToRecommended}
//           >
//             Recommended Courses
//           </button>
//         )}
//       </div>

//       {/* COURSE LIST */}
//       <div className="course-container">
//         {courses?.length > 0 ? (
//           courses.map((c) => <CourseCard key={c._id} course={c} />)
//         ) : (
//           <p>No Courses Yet!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Courses;
import React, { useState, useEffect } from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import CourseCard from "../../components/coursecard/CourseCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";

const Courses = () => {
  const { courses, fetchCourses, fetchTrendingCourses, setCourses } =
    CourseData();
  const { isAuth } = UserData();
  const navigate = useNavigate();

  const [mode, setMode] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses(); // load all by default
  }, []);

  /* ---------- BUTTON HANDLERS ---------- */

  const loadTrending = () => {
    setMode("trending");
    fetchTrendingCourses();
  };

  const loadAll = () => {
    setMode("all");
    setSearchText("");
    fetchCourses();
  };

  const goToRecommended = () => {
    if (!isAuth) return;
    navigate("/recommended");
  };

  /* ---------- SEARCH HANDLER ---------- */

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    try {
      setLoading(true);
      setMode("search");

      const res = await axios.get(
        `${server}/api/course/search?query=${searchText}`
      );

      setCourses(res.data.courses || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courses">
      

      {/*  SEARCH BAR */}
      <form className="course-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search courses (AI, AWS, Cloud, React...)"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="common-btn">Search</button>
      </form>

      {/* ACTION BUTTONS */}
      <div className="course-actions">
        <button
          className={`common-btn ${mode === "all" && "active"}`}
          onClick={loadAll}
        >
          All Courses
        </button>

        <button
          className={`common-btn ${mode === "trending" && "active"}`}
          onClick={loadTrending}
        >
          Trending Courses
        </button>

        {isAuth && (
          <button
            className="common-btn recommended-btn"
            onClick={goToRecommended}
          >
            Recommended Courses
          </button>
        )}
      </div>

      {/*  COURSE LIST */}
      <div className="course-container">
        {loading ? (
          <p>Searching...</p>
        ) : courses?.length > 0 ? (
          courses.map((c) => <CourseCard key={c._id} course={c} />)
        ) : (
          <p>No Courses Found!</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
