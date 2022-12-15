import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import classes from "./SearchCity.module.css";
import React, { useEffect, useState } from "react";
import useFetch from "../hooks/use-fetch";
import CircularProgress from "@mui/material/CircularProgress";
import CityCard from "./CityCard";
import { Alert } from "@mui/material";

const SearchCity = () => {
  const [cityInput, setCityInput] = useState('');
  const [cities, setCities] = useState([]);
  const [alert, setAlert] = useState(false);

  const { errorPost, isLoadingPost, sendRequest: postWeather } = useFetch();
  const { error, sendRequest: fetchWeather} = useFetch();
  const {
    errorGetCities,
    isLoadingGetCities,
    sendRequest: getCities,
  } = useFetch();

  useEffect(() => {
    const transFormCities = (cityObj) => {
      const loadedCities = [];
      for (let cityId in cityObj) {
        loadedCities.push({
          cityId: cityId,
          city: cityObj[cityId],
        });
      }
      setCities(loadedCities);
    };

    getCities(
      {
        url: `${process.env.REACT_APP_FIREBASE_API}/cities.json`,
      },
      transFormCities
    );

    

  }, [getCities]);

  const setValueHandler = (event) => {
    setCityInput(event.target.value);
  };
  

  const searchCityHandler = async () => {
    let checkData = null;
    await fetchWeather(
      {
        url: `${process.env.REACT_APP_FETCH_URL}weather?q=${cityInput}&appid=${process.env.REACT_APP_API_KEY}`,
      },
      await function convertData(data) {
        checkData = data;
      }
    );
    if(checkData){
      await postWeather(
        {
          url: `${process.env.REACT_APP_FIREBASE_API}/cities.json`,
          method: "POST",
          body: cityInput,
          headers: {
            "Content-Type": "application/json",
          },
        },
        function savedCity(data) {
          console.log("New city save with id:", data);
        }
      );
      setAlert(false);
    }else{
      setAlert(true);
    }
  };


  return (
    <React.Fragment>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={12}>
          <TextField
            onChange={setValueHandler}
            fullWidth
            autoFocus
            color="secondary"
            id="standard-basic"
            label="Search for a city"
            variant="standard"
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            onClick={searchCityHandler}
            className={classes.button}
            size="large"
            color="secondary"
            fullWidth
            variant="contained"
          >
            Add City
          </Button>
        </Grid>
      </Grid>
      {alert && <Alert severity="error">Enter a valid city!</Alert>}
      {(isLoadingGetCities || isLoadingPost) && <CircularProgress />}
      {errorGetCities || errorPost}
      <Grid
        container
        marginTop={5}
        rowGap={2}
        columnGap={2}
        justifyContent={"space-around"}
        marginBottom={10}
      >
        {cities.map((city) => {
          return (
            <Grid key={city.cityId} item>
              <CityCard  data={city.city}></CityCard>
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  );
};

export default SearchCity;
