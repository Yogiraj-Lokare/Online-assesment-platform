import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions";
export function LoginForm() {
  const dispatch = useDispatch();
  const submitHandle = (e) => {
    e.preventDefault();
    var body = {
      email: e.target.email.value,
      password: e.target.pass.value,
    };
    dispatch(login(body));
  };
  return (
    <div>
      <Form className="user mt-xl-4" onSubmit={(e) => submitHandle(e)}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control form-control-user"
            placeholder="Email.."
          ></input>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="pass"
            className="form-control form-control-user"
            placeholder="password"
          ></input>
        </div>

        <input
          type="submit"
          className="btn btn-success btn-user btn-block mt-xl-4"
        ></input>
      </Form>
    </div>
  );
}
