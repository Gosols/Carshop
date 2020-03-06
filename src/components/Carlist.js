import React, { useState, useEffect } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Button from "@material-ui/core/Button";
import Editcar from "./Editcar";
import Addcar from "./Addcar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import Snackbar from "@material-ui/core/Snackbar";

export default function Carlist() {
  const [cars, setCars] = useState([]);

  useEffect(() => fetchdata(), []);

  const [open, setOpen] = React.useState(false);
  const [editopen, setEditopen] = React.useState(false);
  const [saveopen, setSaveopen] = React.useState(false);

  const handleClose = reason => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setEditopen(false);
    setSaveopen(false);
  };

  const fetchdata = () => {
    fetch("https://carstockrest.herokuapp.com/cars")
      .then(response => response.json())
      .then(data => setCars(data._embedded.cars));
  };

  const saveCar = car => {
    fetch("https://carstockrest.herokuapp.com/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(car)
    })
      .then(res => fetchdata())
      .catch(err => console.error(err));
    setSaveopen(true);
  };
  const updateCar = (car, link) => {
    fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(car)
    })
      .then(res => fetchdata())
      .catch(err => console.error(err));
    setEditopen(true);
  };
  const deletecar = link => {
    if (window.confirm("Are you sure?")) {
      fetch(link, { method: "DELETE" })
        .then(res => fetchdata())
        .catch(err => console.error(err));
      setOpen(true);
    }
  };

  const columns = [
    {
      Header: "Brand",
      accessor: "brand"
    },
    {
      Header: "Model",
      accessor: "model"
    },
    {
      Header: "Color",
      accessor: "color"
    },
    {
      Header: "Fuel",
      accessor: "fuel"
    },
    {
      Header: "Year",
      accessor: "year"
    },
    {
      Header: "Price",
      accessor: "price"
    },

    {
      sortable: false,
      filterable: false,
      width: 100,
      accessor: "_links.self.href",
      Cell: row => (
        <div>
          <div style={{ float: "left" }}>
            <Editcar updateCar={updateCar} car={row.original} />
          </div>
          <div style={{ float: "left" }}>
            <IconButton
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => deletecar(row.value)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={open}
            autoHideDuration={10000}
            onClose={handleClose}
            message="Car Deleted"
            action={
              <>
                <Button color="secondary" size="small" onClick={handleClose}>
                  Close
                </Button>
              </>
            }
          />
        </div>
      )
    }
  ];

  return (
    <div>
      <div>
        <Addcar saveCar={saveCar} />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={saveopen}
          autoHideDuration={10000}
          onClose={handleClose}
          message="Car Added"
          action={
            <>
              <Button color="secondary" size="small" onClick={handleClose}>
                Close
              </Button>
            </>
          }
        />
      </div>
      <ReactTable filterable={true} data={cars} columns={columns} />
    </div>
  );
}
