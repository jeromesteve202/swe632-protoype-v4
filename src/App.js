import './App.css';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";
import { AiOutlineDoubleLeft } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";


function App() {

  const [isCompleteScreen, setCompleteScreen] = useState(false);
  const [allAssignments, setAssignments] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [newAssignment, setNewAssignment] = useState("");
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [showToast, setShowToast] = useState({ visible: false, message: "" });
  const [showInstructions, setShowInstructions] = useState(false);


  const handleAddAssignment = () => {

    if (!newClass.trim() || !newAssignment.trim()) {
      alert('You must fill in both fields: Class & Assignment.');
      return;
    }

    let newAssignmentItem = {
      class: newClass,
      assignment: newAssignment
    }

    let updatedAssignmentsArray = [...allAssignments];
    updatedAssignmentsArray.push(newAssignmentItem);

    setAssignments(updatedAssignmentsArray);
    
    localStorage.setItem('assignmentList', JSON.stringify(updatedAssignmentsArray))

    setShowToast({ visible: true, message: "You just added a new assignment! Please track it in the In Progress tab." });
    setTimeout(() => {
      setShowToast({ visible: false, message: "" });
    }, 5000);
    setNewAssignment('');
  }

  const handleDelete = (index) => {
    let updatedAssignments = [...allAssignments];
    updatedAssignments.splice(index, 1);

    localStorage.setItem('assignmentList', JSON.stringify(updatedAssignments));
    setAssignments(updatedAssignments);

    setShowToast({ visible: true, message: "Assignment deleted successfully." });
    setTimeout(() => {
      setShowToast({ visible: false, message: "" });
    }, 5000);

  }

  const handleComplete = (index) => {
    let filteredAssignments = {
      ...allAssignments[index]
    }

    let updatedCompleteArray = [...completedAssignments];
    updatedCompleteArray.push(filteredAssignments);
    setCompletedAssignments(updatedCompleteArray);
    handleDelete(index);
    localStorage.setItem('completedAssignments', JSON.stringify(updatedCompleteArray));

    setShowToast({ visible: true, message: "Assignment marked as complete." });
    setTimeout(() => {
      setShowToast({ visible: false, message: "" });
    }, 5000);
  }

  const handleCompletedAssignmentsDelete = (index) => {
    let updatedAssignments = [...completedAssignments];
    updatedAssignments.splice(index, 1);

    localStorage.setItem('completedAssignments', JSON.stringify(updatedAssignments));
    setCompletedAssignments(updatedAssignments);
    
    setShowToast({ visible: true, message: "Assignment deleted successfully." });
    setTimeout(() => {
      setShowToast({ visible: false, message: "" });
    }, 5000);
  }

  const handleMoveToInProgress = (index) => {
    const assignmentToMove = completedAssignments[index];
    const updatedCompletedAssignments = [...completedAssignments];
    updatedCompletedAssignments.splice(index, 1);
    const updatedAllAssignments = [...allAssignments, assignmentToMove]; 
  
    setCompletedAssignments(updatedCompletedAssignments);
    setAssignments(updatedAllAssignments);
  
    localStorage.setItem('completedAssignments', JSON.stringify(updatedCompletedAssignments));
    localStorage.setItem('assignmentList', JSON.stringify(updatedAllAssignments));

    setShowToast({ visible: true, message: "Assignment was moved back to In Progress." });
    setTimeout(() => {
      setShowToast({ visible: false, message: "" });
    }, 5000);
  };

  useEffect(() => {
    let savedAssignments = JSON.parse(localStorage.getItem('assignmentList'));
    let completedAssignments = JSON.parse(localStorage.getItem('completedAssignments'));

    if (savedAssignments) {
      setAssignments(savedAssignments);
    }

    if (completedAssignments) {
      setCompletedAssignments(completedAssignments);
    }
    
  }, [])

  return (
    <div className="App">
      <header>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/George_Mason_University_logo.svg/2560px-George_Mason_University_logo.svg.png"
        alt="George Mason University Logo"
        className="university-logo"
      />

      <h1>Assignment Tracker V3</h1>

    </header>


      <div className="help-button-wrapper">
        <button onClick={() => setShowInstructions(!showInstructions)} className='help-button' >App Info</button>
      </div>


      {showInstructions && (
        <div>
          <h2>How to use this Application:</h2>
          <h3>1. Fill in the Class field with what class you will be adding the assignment for</h3>
          <h3>2. Fill in the Assignment field with what the assignment will be that you want to track</h3>
          <h3>3. Stay on top of your assignments and ace your classes!</h3>
          <br/>
        </div>
      )}


        <div className='assignment-wrapper'>
          <div className='assignment-input'>
            <div className='assignment-input-item'>
              <label>Class <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                value={newClass} 
                onChange={(e) => setNewClass(e.target.value)} 
                placeholder="What class is this for?" 
                onKeyPress={(e) => e.key === 'Enter' && handleAddAssignment()}
              />
            </div>
            <div className='assignment-input-item'>
              <label>Assignment <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                value={newAssignment} 
                onChange={(e) => setNewAssignment(e.target.value)} 
                placeholder="What's the assignment?" 
                onKeyPress={(e) => e.key === 'Enter' && handleAddAssignment()}
              />
            </div>
            <div className='assignment-input-item'>
              <button type='button' title='Add Assignment' onClick={handleAddAssignment} className='primary-button'>Add</button>
            </div>
          </div>

          <div className='button-area'>
            <button title='In Progress' className={`secondary-button ${isCompleteScreen===false && 'active'}`} onClick={() => setCompleteScreen(false)}>In Progress</button>
            <button title='Complete' className={`secondary-button ${isCompleteScreen===true && 'active'}`} onClick={() => setCompleteScreen(true)}>Completed</button>
          </div>

          <div className='assignment-list'>
            
            {isCompleteScreen === false && allAssignments.map((item, index) => (
              <div className='assignment-list-item' key={index}>
                <div>
                  <h3>{item.class}</h3>
                  <p>{item.assignment}</p>

                </div>
                <div>
                  <AiOutlineDelete
                    onClick={() => handleDelete(index)}
                    title="Delete"
                    className="icon"
                  />
                  <FaCheck
                    onClick={() => handleComplete(index)}
                    title="Complete"
                    className=" check-icon"
                  />
                </div>
              </div>
            ))}

            {isCompleteScreen === true && completedAssignments.map((item, index) => (
              <div className='assignment-list-item' key={index}>
                <div>
                  <h3>{item.class}</h3>
                  <p>{item.assignment}</p>
                </div>
                <div>
                  <AiOutlineDoubleLeft title='Move to In Progress' className="icon2" onClick={() => handleMoveToInProgress(index)}/>
                  <AiOutlineDelete
                    onClick={() => handleCompletedAssignmentsDelete(index)}
                    title="Delete"
                    className="icon"
                  />
                </div>
              </div>
            ))}

              {showToast.visible && (
                <div className="toast">
                  {showToast.message}
                </div>
              )}
            </div>
        </div>
    </div>
  );
}

export default App;
