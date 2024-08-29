import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { BASE_URL } from '../constants/config';

const LineChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job applications
        const response = await axios.get(`${BASE_URL}/job-applications`);
        const applications = response.data;

        // Extract job titles and count applications per job
        const jobData = applications.reduce((acc, app) => {
          const jobTitle = app.job;
          acc[jobTitle] = (acc[jobTitle] || 0) + 1;
          return acc;
        }, {});

        // Prepare data for the chart
        const chartData = [{
          id: "Job Applications",
          color: colors.blueAccent[500],
          data: Object.keys(jobData).map(jobTitle => ({
            x: jobTitle,
            y: jobData[jobTitle]
          }))
        }];

        setData(chartData);
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.blueAccent[500],
            },
          },
          legend: {
            text: {
              fill: colors.blueAccent[500],
            },
          },
          ticks: {
            line: {
              stroke: colors.blueAccent[500],
              strokeWidth: 1,
            },
            text: {
              fill: colors.blueAccent[500],
            },
          },
        },
        legends: {
          text: {
            fill: colors.blueAccent[500],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Job Titles",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number of Applications",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={true}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
