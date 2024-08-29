import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import Header from "../../components/Header";
import { BASE_URL } from "../../constants/config";

const JobsManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobs, setJobs] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [user, setUser] = useState({ _id: "", profile_picture: "" });

  const [newJob, setNewJob] = useState({
    jobTitle: "",
    description: "",
    company_information: "",
    location: "",
    employment_type: "",
    salary_compensation: "",
    requirements: [],
    end_date: "",
    recruiter_id: "", // This will hold the recruiter's ID
  });
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/tokenIsValid`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setUser({
          _id: response.data.user._id,
          profile_picture: response.data.user.profile_picture,
          name: response.data.user.name, // Store name if needed elsewhere
        });
      }
      if (user._id) {
        setNewJob((prev) => ({ ...prev, recruiter_id: user._id }));
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const [jobApplications, setJobApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isJobApplicationsDialogOpen, setIsJobApplicationsDialogOpen] =
    useState(false);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No access token available.");
          return;
        }
        const response = await axios.get(`${BASE_URL}/tokenIsValid`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setUser({
            _id: response.data.user._id,
            profile_picture: response.data.user.profile_picture,
            name: response.data.user.name, // Store name if needed elsewhere
          });
          setNewJob((prev) => ({
            ...prev,
            recruiter_id: response.data.user._id,
          }));
          fetchJobs(response.data.user._id); // Fetch jobs after setting user
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchInitialData();
  }, []);
  const fetchJobs = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No access token available.");
        return;
      }
      const response = await axios.get(`${BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jobsWithId = response.data.map((job, index) => ({
        ...job,
        id: index,
      }));
      setJobs(jobsWithId);
      console.log("Jobs fetched:", response.data);
    } catch (error) {
      console.error(
        "Failed to fetch jobs for recruiter:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async (id) => {
    const jobId = jobs[id]._id;
    await axios.delete(`${BASE_URL}/jobs/${jobId}`);
    fetchJobs();
  };

  const handleEditSave = async () => {
    if (selectedJob) {
      await axios.put(`${BASE_URL}/jobs/${selectedJob._id}`, selectedJob);
      fetchJobs();
      setIsEditDialogOpen(false);
    }
  };

  const handleCreateSave = async () => {
    if (!newJob.recruiter_id) {
      alert(
        "Recruiter ID is missing. Please check if you're logged in correctly."
      );
      return;
    }

    try {
      await axios.post(`${BASE_URL}/jobs`, newJob);
      fetchJobs();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create job", error);
    }
  };

  // const fetchJobApplications = async (jobId) => {
  //   try {
  //     console.log("Fetching job applications for jobId:", jobId);

  //     // Retrieve the token from local storage
  //     const token = localStorage.getItem("token");

  //     // Set up the headers with the Authorization token
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Use the token from local storage
  //       },
  //     };

  //     // Make the GET request with the headers
  //     const response = await axios.get(
  //       `${BASE_URL}/job-application/idJob`,
  //       config
  //     );

  //     console.log("Job applications:", response.data);
  //     setJobApplications(response.data);
  //     setIsJobApplicationsDialogOpen(true);
  //   } catch (error) {
  //     console.error("Error fetching job applications:", error);
  //   }
  // };

  const columns = [
    {
      field: "applicants",
      headerName: "Applicants",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="outlined"
            size="small"
            // onClick={() => fetchJobApplications(params.row.id)}
          >
            Applicants
          </Button>
        );
      },
      width: 100,
    },
    { field: "jobTitle", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "company_information", headerName: "Company Info", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "employment_type", headerName: "Employment Type", flex: 1 },
    { field: "salary_compensation", headerName: "Salary", flex: 1 },
    {
      field: "requirements",
      headerName: "Requirements",
      flex: 1,
      renderCell: (params) => {
        return <Typography>{params.value.join(", ")}</Typography>;
      },
    },
    {
      field: "end_date",
      headerName: "End Date",
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>{new Date(params.value).toLocaleString()}</Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              startIcon={<EditOutlinedIcon />}
              onClick={() => {
                setSelectedJob(jobs.find((job) => job.id === params.id));
                setIsEditDialogOpen(true);
              }}
              variant="outlined"
              size="small"
            />
            <Button
              startIcon={<DeleteOutlineOutlinedIcon />}
              onClick={() => handleDelete(params.id)}
              color="error"
              variant="outlined"
              size="small"
            />
          </>
        );
      },
      width: 120,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Job Management"
        subtitle="Here you can manage your job offers"
      />
      <Box m="20px">
        <Button
          variant="contained"
          color="grey"
          startIcon={<AddOutlinedIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add Job
        </Button>
      </Box>
      <Box
        m="40px 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={jobs}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              margin="dense"
              id="jobTitle"
              label="Job Title"
              type="text"
              fullWidth
              variant="standard"
              value={selectedJob ? selectedJob.jobTitle : ""}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, jobTitle: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={selectedJob ? selectedJob.description : ""}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, description: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="company_information"
              label="Company Information"
              type="text"
              fullWidth
              variant="standard"
              value={selectedJob ? selectedJob.company_information : ""}
              onChange={(e) =>
                setSelectedJob({
                  ...selectedJob,
                  company_information: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              id="location"
              label="Location"
              type="text"
              fullWidth
              variant="standard"
              value={selectedJob ? selectedJob.location : ""}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, location: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="employment_type"
              label="Employment Type"
              type="text"
              fullWidth
              variant="standard"
              value={selectedJob ? selectedJob.employment_type : ""}
              onChange={(e) =>
                setSelectedJob({
                  ...selectedJob,
                  employment_type: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              id="salary_compensation"
              label="Salary"
              type="text"
              fullWidth
              variant="standard"
              value={selectedJob ? selectedJob.salary_compensation : ""}
              onChange={(e) =>
                setSelectedJob({
                  ...selectedJob,
                  salary_compensation: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              id="end_date"
              label="End Date"
              type="datetime-local"
              fullWidth
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              value={selectedJob ? selectedJob.end_date : ""}
              onChange={(e) =>
                setSelectedJob({ ...selectedJob, end_date: e.target.value })
              }
            />

            {/* Dynamic input fields for requirements */}
            {selectedJob &&
              selectedJob.requirements.map((requirement, index) => (
                <TextField
                  key={index}
                  margin="dense"
                  label={`Requirement ${index + 1}`}
                  type="text"
                  fullWidth
                  variant="standard"
                  value={requirement}
                  onChange={(e) => {
                    const updatedRequirements = [...selectedJob.requirements];
                    updatedRequirements[index] = e.target.value;
                    setSelectedJob({
                      ...selectedJob,
                      requirements: updatedRequirements,
                    });
                  }}
                />
              ))}
            <Button
              onClick={() =>
                setSelectedJob({
                  ...selectedJob,
                  requirements: [...selectedJob.requirements, ""],
                })
              }
              variant="outlined"
            >
              Add Requirement
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="grey">
            Save
          </Button>
        </DialogActions>
        {/* Button to attach quiz */}
        <Button
          onClick={() => alert("Attach Quiz button clicked!")}
          variant="outlined"
        >
          Attach Quiz
        </Button>
      </Dialog>
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Job</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              margin="dense"
              id="jobTitle"
              label="Job Title"
              type="text"
              fullWidth
              variant="standard"
              value={newJob.jobTitle}
              onChange={(e) =>
                setNewJob({ ...newJob, jobTitle: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={newJob.description}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="company_information"
              label="Company Information"
              type="text"
              fullWidth
              variant="standard"
              value={newJob.company_information}
              onChange={(e) =>
                setNewJob({ ...newJob, company_information: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="location"
              label="Location"
              type="text"
              fullWidth
              variant="standard"
              value={newJob.location}
              onChange={(e) =>
                setNewJob({ ...newJob, location: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="employment_type"
              label="Employment Type"
              type="text"
              fullWidth
              variant="standard"
              value={newJob.employment_type}
              onChange={(e) =>
                setNewJob({ ...newJob, employment_type: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="salary_compensation"
              label="Salary"
              type="text"
              fullWidth
              variant="standard"
              value={newJob.salary_compensation}
              onChange={(e) =>
                setNewJob({ ...newJob, salary_compensation: e.target.value })
              }
            />
            {newJob.requirements.map((requirement, index) => (
              <TextField
                key={index}
                margin="dense"
                label={`Requirement ${index + 1}`}
                type="text"
                fullWidth
                variant="standard"
                value={requirement}
                onChange={(e) => {
                  const updatedRequirements = [...newJob.requirements];
                  updatedRequirements[index] = e.target.value;
                  setNewJob({ ...newJob, requirements: updatedRequirements });
                }}
              />
            ))}
            <Button
              onClick={() =>
                setNewJob({
                  ...newJob,
                  requirements: [...newJob.requirements, ""],
                })
              }
              variant="outlined"
            >
              Add Requirement
            </Button>
          </Stack>
          <TextField
            margin="dense"
            id="end_date"
            label="End Date"
            type="datetime-local"
            fullWidth
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            value={newJob.end_date}
            onChange={(e) => setNewJob({ ...newJob, end_date: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsCreateDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={handleCreateSave} variant="contained" color="grey">
            Save
          </Button>
        </DialogActions>
        {/* Button to attach quiz */}
        <Button
          onClick={() => alert("Attach Quiz button clicked!")}
          variant="outlined"
        >
          Attach Quiz
        </Button>
      </Dialog>
      {/* Dialog to display job applications */}
      <Dialog
        open={isJobApplicationsDialogOpen}
        onClose={() => setIsJobApplicationsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Job Applications</DialogTitle>
        <DialogContent>
          {/* Render job applications data here */}
          {jobApplications.map((application) => (
            <div key={application._id.$oid}>
              <Typography>Applicant ID: {application.userID}</Typography>
              {/* Render other application details as needed */}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsJobApplicationsDialogOpen(false)}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobsManagement;
