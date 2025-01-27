import { signup } from "./actions.js";

export default function SignUpPage() {
  return (
    <form>
      <label htmlFor="name">Name::</label>
      <input id="name" name="name" type="text" required />
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={signup}>Sign-Up</button>
    </form>
  );
}
