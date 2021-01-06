import React from "react";
import { CardContent, Typography, makeStyles, Card } from "@material-ui/core";
import { useParams, Link } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    marginTop: "2vw",
    marginLeft: "25vw",
    marginRight: "25vw",
  },
  pos: {
    marginBottom: 12,
    fontSize: 25,
  },
});

function Result() {
  const param = useParams();
  const classes = useStyles();
  return (
    <React.Fragment>
      <Card className={classes.root}>
        <CardContent style={{ textAlign: "center" }}>
          <Typography variant="h3" color="textPrimary">
            Your Score
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            in
          </Typography>
          <Typography variant="h4" component="h2">
            --{param.testname}--
          </Typography>

          <Typography variant="h2" component="p">
            {param.s1}/{param.s2}
          </Typography>
          <hr />
          <Link to="/"> back to Home </Link>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default Result;
