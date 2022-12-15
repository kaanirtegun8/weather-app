import { Card, CardContent, CardMedia, CircularProgress, Grid, Typography } from "@mui/material";
import { Fragment, useEffect,useState } from "react";
import useFetch from "../hooks/use-fetch";
import classes from "./CityCard.module.css";

const CityCard = (props) => {
  const [city,setCity] = useState({})
  const {error, isLoading, sendRequest: fetchWeather} = useFetch();

  useEffect(() => {
    fetchWeather(
      {
        url: `${process.env.REACT_APP_FETCH_URL}weather?q=${props.data}&appid=${process.env.REACT_APP_API_KEY}`,
      },
      function convertData(data) {
        setCity({
          temprature: Math.round(data.main.temp - 273.15),
          desc: data.weather[0].description,
          name: data.name,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
        });
      }
    );
  },[fetchWeather, props.data])

  if(error){
    
    console.log('errrrror => ', error)
  }
  return (
    <Fragment>
      {isLoading && <CircularProgress></CircularProgress> }
      {error && <p>{error}</p>}
      {(!error && !isLoading) && <Card className={classes.card}>
        <CardContent className={classes.paddingReset}>
          <Grid
            padding={0}
            justifyContent={"space-between"}
            spacing={1}
            container
          >
            <Grid item>
              <Typography sx={{ fontSize: 50 }} color="text.secondary">
                {city.temprature}
                <span>&#176;</span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                className="uppercase"
                sx={{ fontSize: 15 }}
                textAlign={"center"}
                alignSelf={"end"}
                color="text.primary"
              >
                {city.desc}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                textAlign={"center"}
                alignSelf={"end"}
                color="text.secondary"
              >
                {city.name}
              </Typography>
            </Grid>
          </Grid>
          <CardMedia
            component={"img"}
            image={`${city.icon}.svg`}
          ></CardMedia>
          <Typography
            sx={{ fontSize: 15 }}
            textAlign={"center"}
            alignSelf={"end"}
            color="text.third"
          >
            Humidity: {city.humidity} %
          </Typography>
          <Typography
            sx={{ fontSize: 15 }}
            textAlign={"center"}
            alignSelf={"end"}
            color="text.third"
          >
            Wind Speed: {city.windSpeed} km
          </Typography>
        </CardContent>
      </Card>}
    </Fragment>
  );
};

export default CityCard;
