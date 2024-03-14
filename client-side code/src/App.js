import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';
import { IoIosAddCircleOutline } from "react-icons/io";

// Import Font Awesome styles
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);

  const [getData, setGetData] = useState([])
  // console.log(getData)

  const [isEditing, setIsEditing] = useState(false);
  const [readme, setReadme] = useState(0);
  const [updatingRecordId, setUpdatingRecordId] = useState();

  const [count, setCount] = useState();

  //Repeat field values
  const selectedValues = ['Sun', 'Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat'];

  //For Search Funcationality
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    frequency: '',
    rep: '',
    time: ''
  });

  // Fetching Data when changages occured.
  useEffect(() => {
    fetchScheduleData();
  }, [count]);

  // Fetching Data
  const fetchScheduleData = () => {
    axios.get("http://localhost:8081/fetch")
      .then(response => {
        setGetData(response.data.result);
        console.log(response.data.result);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });

  }

  //Updating record data
  const updateRecord = async (id, data, e) => {
    console.log(id);
    setUpdatingRecordId(id);
    e.preventDefault();
    setFormData(data);
    setIsEditing(true); // Set editing mode to true
    setShowModal(true);
    setReadme(1)
    const updatedData = {
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      frequency: formData.frequency,
      rep: formData.rep,
      time: formData.time
    };
  };


  //Inserting New Record
  const submitHandler = (e) => {
    // console.log(updatingRecordId)
    e.preventDefault(); // Prevent default form submission
    // Add the new form data to the scheduleData array
    const updatedScheduleData = [...scheduleData, formData];
    setScheduleData(updatedScheduleData);

    // const requestOptions = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // };
    if (readme == 0) {
      axios.post('http://localhost:8081/add', formData)
        .then(response => response.json())
        .then(data => setScheduleData(data));
      window.location.reload(false);
      // fetchScheduleData();
      console.log(updatedScheduleData); // Log updated scheduleData to console

      closeModal();
    } else {
      console.log(updatingRecordId);
      axios.put(`http://localhost:8081/update/${updatingRecordId}`, formData)
        .then(response => console.log(response))
        //  .then(data => setCount(data));
        .then(() => { closeModal() })
        .then(setCount(count + 1))
      //  window.location.reload(false);
    }
    // Close the modal after submitting the form
  };

  const deleteRecord = (id) => {
    axios.delete(`http://localhost:8081/delete`, { data: { id } })
      .then(response => {
        alert('Record deleted successfully');
        // Optionally, update the state to reflect the change
        fetchScheduleData();
      })
      .catch(error => {
        console.error('Error deleting record: ', error);
      });
  };

  const formHandler = (e) => {
    const { name, value } = e.target;
    // Format the time to 12-hour format before setting it in the state
    const formattedTime = formatTimeTo12Hour(value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  //search query
  const handleSearch = async (event) => {
    event.preventDefault();

    // Perform filtering only when there's a search term
    const searchTerm = event.target.value.toLowerCase();
    setSearchQuery(searchTerm)

    if (searchTerm === '') {
      fetchScheduleData()
    } else {
      const filteredData = getData.filter(value => value.title.toLowerCase().includes(searchTerm));
      setGetData(filteredData);
      console.log(filteredData);

    }

  };

  // Function to format time to 12-hour format
  const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    let formattedHours = hours % 12;
    formattedHours = formattedHours ? formattedHours : 12; // If hours is 0, set it to 12

    return `${formattedHours}:${minutes} ${ampm}`;
  };




  const handleAddButtonClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false); // Reset editing mode when modal is closed
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-auto col-sm-1' id='sideNav'></div>
          <div className='col-auto col-sm-11' id='topNav'></div>
        </div>
      </div>
      <div className='container' >

        <div className="row" style={{ marginTop: "3%", marginLeft: "2%" }}>
          <div className="col-md-6" >
            <input type="text" style={{ width: '60%' }} className="form-control" placeholder="Search" name='search' value={searchQuery}
              onChange={handleSearch} />

          </div>
          <div className="col-md-6" >
            <button style={{ marginLeft: "80%", backgroundColor: "rgb(57,30,90)", color: "white" }} className='btn float-end me-md-0' type='button'
             onClick={handleAddButtonClick}><IoIosAddCircleOutline style={{marginRight:"10px",color:"white",backgroundColor: "rgb(57,30,90)"}} />
  Add </button>
          </div>
        </div>
        <div className='row' id='tableContent'>
          <table className='table'>
            <thead className='head'>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Subject</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(getData) && getData.map((data) => (
                <tr key={data.task_id}>
                  <td>{data.title}</td>
                  <td>{data.description}</td>
                  <td>{data.subject}</td>
                  <td> {data.frequency === "Daily" && (
                    <span>Daily at {formatTimeTo12Hour(data.time)}</span>
                  )}
                    {data.frequency === "Monthly" && data.time && (
                      <span>Monthly at {data.rep} {formatTimeTo12Hour(data.time)}</span>
                    )}
                    {data.frequency === "Weekly" && data.time && (
                      <span>Monthly at {data.rep} {formatTimeTo12Hour(data.time)}</span>
                    )}
                  </td>
                  <td>
                    <button className="btn" style={{ marginLeft: '5px' }} onClick={(e) => updateRecord(data.task_id, data, e)}>
                      <i className="fas fa-pen"></i>
                    </button>
                    <button className="btn" onClick={() => deleteRecord(data.task_id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
      Test

      {/* Modal for adding a new item */}
      {showModal && (
        <div className="modal fade show mt-5" style={{ display: 'block', marginLeft: '61%', width: '350px', height: "90%" }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <h6 style={{ marginLeft: '15px', marginTop: '15px' }}>
                {isEditing ? 'Edit Schedule' : 'Add Schedule'}
              </h6>
              <div>
                <form onSubmit={submitHandler} style={{ marginLeft: '5%', marginRight: '5%' }}>
                  <div className="form-group row" style={{ marginBottom: '2%' }} >
                    <label htmlFor="title" className="col-sm-3 col-form-label">Title</label>
                    <div className="col-sm-9">
                      <input type="text" required name='title' id="title" className="form-control" onChange={formHandler} value={formData.title} />
                    </div>
                  </div>
                  <div className="form-group row" style={{ marginBottom: '2%' }}>
                    <label htmlFor="description" className="col-sm-3 col-form-label">Description</label>
                    <div className="col-sm-9">
                      <textarea type="text" name='description' id="description" className="form-control" onChange={formHandler} value={formData.description} />
                    </div>
                  </div>
                  <div className="form-group row" style={{ marginBottom: '2%' }}>
                    <label htmlFor="subject" className="col-sm-3 col-form-label">Subject</label>
                    <div className="col-sm-9">
                      <input type="text" name='subject' id="subject" className="form-control" onChange={formHandler} value={formData.subject} />
                    </div>
                  </div>
                  <div className="form-group row" style={{ marginBottom: '2%' }}>
                    <label htmlFor="frequency" className="col-sm-3 col-form-label">Frequency</label>
                    <div className="col-sm-9">
                      <select type="text" name='frequency' id="frequency" className="form-control" onChange={formHandler} value={formData.frequency}>
                        <option value="Weekly">Weekly</option>
                        <option value="Daily">Daily</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                  {formData.frequency === 'Monthly' && (
                    <div className="form-group row" style={{ marginBottom: '2%' }}>
                      <label htmlFor="rep" className="col-sm-3 col-form-label">Repeat</label>
                      <div className="col-sm-9">
                        <select type="text" name='rep' id="rep" className="form-control" onChange={formHandler} value={formData.rep}>
                          <option value="First Monday">First Monday</option>
                          <option value="Last Friday">Last Friday</option>
                        </select>
                      </div>
                      <div className="form-group row" style={{ marginBottom: '2%' }}>
                        <label htmlFor="time" className="col-sm-3 col-form-label">Time</label>
                        <div className="col-sm-9" style={{ marginTop: "2%" }}>
                          <input type="time" name='time' id="time" className="form-control" onChange={formHandler} value={formData.time} />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.frequency === 'Weekly' && (
                    <div className="form-group row" style={{ marginBottom: '3%' }}>
                      <label htmlFor="rep" className="col-sm-3 col-form-label">Repeat</label>
                      <div className="col-sm-9">
                        <select type="text" name='rep' id="rep" className="form-control" onChange={formHandler} value={formData.rep}>
                          {selectedValues.map((value, index) => (
                            <option value={value} key={index}>{value}</option>))}
                        </select>
                      </div>
                      <div className="form-group row" style={{ marginBottom: '3%' }}>
                        <label htmlFor="time" className="col-sm-3 col-form-label">Time</label>
                        <div className="col-sm-9" style={{ marginTop: "2%" }}>
                          <input type="time" name='time' id="time" className="form-control" onChange={formHandler} value={formData.time} />
                        </div>
                      </div>
                    </div>
                  )}



                  {formData.frequency === 'Daily' && (
                    <div className="form-group row" style={{ marginBottom: '2%', marginTop: "2%" }}>
                      <label htmlFor="time" className="col-sm-3 col-form-label">Time</label>
                      <div className="col-sm-9" >
                        <input type="time" name='time' id="time" className="form-control" onChange={formHandler} value={formData.time} />
                      </div>
                    </div>
                  )}
                  <div className="form-group row" style={{ marginBottom: '2%' }}>
                    <div className="col-sm-12 m-1 text-center">
                      <button type="button" className="btn btn-secondary m-3" style={{ backgroundColor: 'rgb(235,232,239)', color: 'black' }} onClick={closeModal}>Cancel</button>
                      <button type="submit" className="btn " style={{ backgroundColor: 'rgb(57,30,90)', color: 'white' }}>{isEditing ? 'Update' : 'Done'}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
