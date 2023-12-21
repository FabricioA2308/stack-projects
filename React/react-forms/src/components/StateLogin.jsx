import Input from "./Input.jsx";

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <Input inputType="email" id="email" type="email" name="email" />
        <Input
          inputType="password"
          id="password"
          type="password"
          name="password"
        />
      </div>
      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Reset
        </button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}
