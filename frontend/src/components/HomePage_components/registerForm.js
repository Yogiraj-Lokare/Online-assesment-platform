import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { signin } from "../../redux/actions";
import { useHistory } from "react-router-dom";
export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [conpass, setCpass] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const submitHandle = async (e) => {
    e.preventDefault();
    var body = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.pass.value,
      cpassword: e.target.cpass.value,
    };
    dispatch(signin(body));
    history.push("/");
    //var data = await Axios.post('/user/signup',body);
  };
  const change1 = (e) => {
    setName(e.target.value);
  };
  const change2 = (e) => {
    setEmail(e.target.value);
  };
  const change3 = (e) => {
    setPass(e.target.value);
  };
  const change4 = (e) => {
    setCpass(e.target.value);
  };
  return (
    <div>
      <Form className="user mt-xl-4" onSubmit={(e) => submitHandle(e)}>
        <div className="form-group">
          <label>Username</label>
          <input
            name="name"
            type="text"
            onChange={(e) => change1(e)}
            value={name}
            className="form-control form-control-user"
            placeholder="Username"
          ></input>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => change2(e)}
            className="form-control form-control-user"
            placeholder="Email"
          ></input>
        </div>
        <div className="form-group row">
          <div className="col-sm-6 mb-3 mb-sm-0">
            <label>Password</label>
            <input
              name="pass"
              type="password"
              minLength="6"
              onChange={(e) => change3(e)}
              value={password}
              className="form-control form-control-user"
              placeholder="password"
            ></input>
          </div>
          <div className="col-sm-6">
            <label>Confirm Password</label>
            <input
              name="cpass"
              type="password"
              onChange={(e) => change4(e)}
              value={conpass}
              className="form-control form-control-user"
              placeholder="confirm password"
            ></input>
          </div>
        </div>

        <input
          type="submit"
          className="btn btn-success btn-user btn-block mt-xl-4"
        ></input>
      </Form>
    </div>
  );
}
/*const mapDispatchToProps = (dispatch) => {
    return {
      signin: (b)=> { dispatch(signin(b)) }
    }
}*/
//export default connect(null, mapDispatchToProps)(RegisterForm);
