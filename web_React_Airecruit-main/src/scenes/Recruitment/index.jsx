import { Box, Typography, TextField, Button, useTheme } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

const Recruitment = () => {
  const theme = useTheme(); // Access the theme object

  const [synthesizedVideoBlobs, setSynthesizedVideoBlobs] = useState(Array(3).fill(null));
  const [textInputs, setTextInputs] = useState(["", "", ""]);
  const [keywordInputs, setKeywordInputs] = useState([[], [], []]); // State to store keyword inputs as array of arrays

  const handleTextChange = (event, index) => {
    const updatedTextInputs = [...textInputs];
    updatedTextInputs[index] = event.target.value;
    setTextInputs(updatedTextInputs);
  };

  const handleKeywordChange = (keywords, index) => {
    const updatedKeywordInputs = [...keywordInputs];
    updatedKeywordInputs[index] = keywords;
    setKeywordInputs(updatedKeywordInputs);
  };
  const handleSynthesizeAndSave = async (index) => {
    try {
      const response = await axios.post("http://192.168.3.2:10000/synthesize", {
        text: textInputs[index],
      }, {
        responseType: 'blob' // Ensure response type is blob
      });
      const filename = response.data.filename;
      // Extract filename from the Content-Disposition header if it exists

      console.log(`Synthesis Response ${index + 1}:`, response.data.filename);

      const updatedSynthesizedVideoBlobs = [...synthesizedVideoBlobs];
      updatedSynthesizedVideoBlobs[index] = response.data;
      setSynthesizedVideoBlobs(updatedSynthesizedVideoBlobs);

      // Now call handleSaveVideo directly here with the correct blob and filename
      await handleSaveVideo(index, filename);
    } catch (error) {
      console.error(`Error synthesizing and saving video ${index + 1}:`, error);
    }
  };

  const handleSaveVideo = async (index, filename) => {
    try {
      const job_id = "123456";
      const recruiter_id = "789012";

      const formData = new FormData();
      formData.append("job_id", job_id);
      formData.append("recruiter_id", recruiter_id);

      // Generate a unique filename with a timestamp
      const timestamp = new Date().getTime(); // Get current timestamp

      // Convert the blob (now confirmed to be available) to a File object
      const videoFile = new File([synthesizedVideoBlobs[index]], filename, { type: 'video/mp4' });

      // Append the video file to the form data
      formData.append("video", videoFile);

      formData.append("keywords", keywordInputs[index].join(',')); // Join the keywords array into a comma-separated string

      const response = await axios.post("http://192.168.3.2:10000/saveVideoRh", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(`Save Video ${index + 1} Response:`, response.data);
    } catch (error) {
      console.error(`Error saving videos:`, error);
    }
  };




  return (
    <Box m="20px">
      {/* Render text input, keyword input, buttons, and video player for each video */}
      {[0, 1, 2].map((index) => (
        <Box key={index} mt={2}>
          <TextField
            label={`Interview Questions to Avatar for Video ${index + 1}`}
            variant="outlined"
            fullWidth
            value={textInputs[index]}
            onChange={(event) => handleTextChange(event, index)}
            style={{ marginBottom: '10px' }}
          />
          <TagsInput
            value={keywordInputs[index]}
            onChange={(keywords) => handleKeywordChange(keywords, index)}
            inputProps={{ placeholder: `Keywords for Correct Answers for Video ${index + 1}` }}
            className=""

          />
          <Button variant="contained" color="grey" onClick={() => handleSynthesizeAndSave(index)} sx={{ mt: 2 }}>
            Synthesize and Save Video {index + 1}
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default Recruitment;