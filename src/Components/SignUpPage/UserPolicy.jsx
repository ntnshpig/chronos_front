import { Modal } from "antd";
import scss from "./UserPolicy.module.scss";

export default function userPolicy() {
  Modal.info({
    width: 800,
    content: (
      <div className={scss.PolicyDiv}>
        <h2>User policy</h2>
        <h3>some text</h3>
        <p>
          some text...      some text...
        </p>
        <p>
          some text...      some text...
        </p>
      </div>
    ),
    onOk() {},
  });
}
