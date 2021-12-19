import scss from "./Main.module.scss";

const Main = (props) => {
  return (
    <main className={scss.Main}>
      {props.children}
    </main>
  );
};

export default Main;
