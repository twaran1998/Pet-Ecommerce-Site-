import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// icons
import CategoryIcon from "@mui/icons-material/Category";
import CreateIcon from "@mui/icons-material/Create";
import PetsIcon from "@mui/icons-material/Pets";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import "./dashboard.css";

const dummydataForTopStats = [
  {
    categoryName: "Products",
    count: 100,                 //defaultCounts
    icon: <CreateIcon />,
    link: "/products",
  },
  {
    categoryName: "Categories",
    count: 18,
    icon: <CategoryIcon />,
    link: "/category",
  },
  {
    categoryName: "Services",
    count: 5,
    icon: <CleaningServicesIcon />,
    link: "./services",
  },
  {
    categoryName: "Pets",
    count: 12,
    icon: <PetsIcon />,
    link: "./pets",
  },
];

export default function TopStats() {
  const [topStats, settopStats] = useState([]);
  useEffect(() => {
    async function getStats() {
      const stats = await fetch(`${process.env.REACT_APP_APIURL}/api/getTopStats`);
      const topStats = await stats.json();
      // console.log("topstats = ", topStats);
      settopStats(topStats);
    }
    getStats();
  }, []);

  return (
    <div className="dashboardTopStatsCard">
      {dummydataForTopStats.map((obj) => {
        let count = topStats[obj.categoryName];
        let newElem = { ...obj, count: count };       
        return (
          <Box sx={{ minWidth: 150 }}>
            <Card variant="outlined">{card(newElem)}</Card>
          </Box>
        );
      })}
    </div>
  );
}

const card = (data) => (
  <React.Fragment>
    <Link
      href={data.link}
      className="noCardDecoration"
      style={{ textDecoration: "none" }}
    >
      <CardContent>
        <Typography>{data.icon}</Typography>
        <Typography variant="h5" component="div">
          {data.categoryName}
        </Typography>
        <Typography>{data.count}</Typography>
      </CardContent>
      <CardActions></CardActions>
    </Link>
  </React.Fragment>
);
