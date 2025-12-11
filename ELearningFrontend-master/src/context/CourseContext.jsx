import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState([]);
  const [mycourse, setMyCourse] = useState([]);
  const fetchTrendingCourses = async () => {
  try {
    const { data } = await axios.get(`${server}/api/course/trending`);
    setCourses(data.courses);
  } catch (error) {
    console.log("Error fetching trending courses", error);
  }
};


  async function fetchCourses() {
    try {
      const { data } = await axios.get(`${server}/api/course/all`);

      setCourses(data.courses);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCourse(id) {
    try {
      const { data } = await axios.get(`${server}/api/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMyCourse() {
    try {
      const { data } = await axios.get(`${server}/api/mycourse`, {
       headers: {
      Authorization: `Bearer ${token}`,
    },
      });

      setMyCourse(data.courses);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchMyCourse();
  }, []);
  return (
    <CourseContext.Provider
      value={{
        courses,
        fetchCourses,
        fetchCourse,
        course,
        mycourse,
        setCourses,
        fetchMyCourse,fetchTrendingCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);
