import React, { useState } from 'react'
import {Chart, registrables} from "chart.js"  
import { Pie } from 'react-chartjs-2';

Chart.register(...registrables);

const InstructorChart = ({courses}) => {

  const [currChart, setCurrChart] = useState("students");

  const getRandomColors = (numColors) =>{
    const colors = [];
    for(let i=0; i<numColors; i++){
      const color = `rgb(${Math.floor(Math.random()*256)} , ${Math.floor(Math.random()*256)} , ${Math.floor(Math.random()*256)} )`
      colors.push(color);
    }
  }

  const chartDataForStudents = {
    lables :courses.map((course) => course.courseName),
    datasets :[
      {
        data:courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor : getRandomColors(courses.length),
      }
    ]
  }

  const chatDataForIncome = {
    lables :courses.map((course) => course.courseName),
    datasets :[
      {
        data:courses.map((course) => course.totalAmountGenerated),
        backgroundColor : getRandomColors(courses.length),
      }
    ]
  }

  const options = {

  }

  return (
    <div>
      <p>Visualise</p>
      <div>
        <button onClick={() => setCurrChart("students")}>
          Student
        </button>

        <button onClick={() => setCurrChart("income")}>
          Income
        </button>
      </div>

      <div>
        <Pie
          data={
            currChart ==="students" ? chartDataForStudents : chatDataForIncome
          }
          options={options}
        />
      </div>
    </div>
  )
}
export default InstructorChart
