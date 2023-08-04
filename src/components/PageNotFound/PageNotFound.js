import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import "./PageNotFound.css";
import pgNotFound from "./404.gif";
export default class error extends Component {
  goBack = () => {
    window.history.back();
  };

  render() {
    return (
      <div className="Img_404" id="myblogContainer">
        <img srcSet={pgNotFound} alt="Page not found" />
        <Button
          variant="contained"
          size="small"
          className="goBkBtn"
          onClick={this.goBack}
        >
          Go back
        </Button>
      </div>
    );
  }
}
