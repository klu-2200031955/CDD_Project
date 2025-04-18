import React, { useState, useEffect } from 'react';
import styles from '../../template.module.css';
import FacultyMyDeptNav from '../NavBars/FacultyMyDeptNav';
import axios from 'axios';
import config from '../../config';
import ViewStudents from './ViewStudents';

export default function MyCourseDetails() {
  const [courses, setCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [fmapid, setFmapid] = useState(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleViewStudentsClick = (id) => {
    setFmapid(id);
    togglePopup();
  };

  useEffect(() => {
    const storedFacultyData = localStorage.getItem('faculty');
    if (storedFacultyData) {
      const parsedFacultyData = JSON.parse(storedFacultyData);
      fetchMappedCourses(parsedFacultyData.facultyid);
    }
  }, []);

  const fetchMappedCourses = async (facultyid) => {
    try {
      const response = await axios.get(`${config.url}/getcoursebyid/${facultyid}`);
      setCourses(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <FacultyMyDeptNav />
      {showPopup && (<ViewStudents closePopup={togglePopup} fmapid={fmapid} />)}
      <div className={styles['group100']}>
        <table className='responsive-table' border={1} align="center" style={{ width: 'auto', height: 'auto' }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Component</th>
              <th>Section</th>
              <th>View Students</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{course.ccode}</td>
                  <td>{course.ctitle}</td>
                  <td>
                    {course.component.map((component, idx) => (
                      <span key={idx}>
                        {component === 'L'
                          ? 'Lecture'
                          : component === 'T'
                          ? 'Tutorial'
                          : component === 'P'
                          ? 'Practical'
                          : component === 'S'
                          ? 'Skill'
                          : component}
                        {idx < course.component.length - 1 && ', '}
                      </span>
                    ))}
                  </td>
                  <td>{course.section}</td>
                  <td><button onClick={() => handleViewStudentsClick(course.fmapid)}>Click Here</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Data Not Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
