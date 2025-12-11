import React from "react";
import "./courseCard.css";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";


const CourseCard = ({ course }) => {
  
  const navigate = useNavigate();
  const { user, isAuth } = UserData();

  const { fetchCourses } = CourseData();
  const token = localStorage.getItem("token");
  console.log("Admin ",token);

  const deleteHandler = async (id) => {
   
    if (confirm("Are you sure you want to delete this course")) {
      try {
        
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        });

        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
  const toggleTrending = async (courseId) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.patch(
      `${server}/api/course/toggle-trending/${courseId}`,
      {},
      {
        headers: { token },
      }
    );

    toast.success(data.message);

    // Refresh course list so UI updates
    fetchCourses(); 
  } catch (error) {
    toast.error(error.response?.data?.message || "Error updating trending!");
  }
};
  return (
    <div className="course-card">
      <img src={`${server}/${course.image}`} alt="" className="course-image" />
      <h3>{course.title}</h3>
      <p>Instructor- {course.createdBy}</p>
      <p>Duration- {course.duration} weeks</p>
      <p>Price- ₹{course.price}</p>
      {isAuth ? (
        <>
          {user && user.role !== "admin" ? (
            <>
              {user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="common-btn"
                >
                  Get Started
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="common-btn"
            >
              Study
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}

      <br />

      {user && user.role === "admin" && (
        <><button
          onClick={() => deleteHandler(course._id)}
          className="common-btn"
          style={{ background: "red" }}
        >
          Delete
        </button><button
          onClick={() => toggleTrending(course._id)}
          className="common-btn"
          style={{
            background: course.isTrending ? "#ff4d4d" : "#4caf50",
            color: "white",
          }}
        >
            {course.isTrending ? "Remove Trending" : "Mark as Trending"}
          </button></>

        
      )}
    </div>
  );
};


export default CourseCard;
